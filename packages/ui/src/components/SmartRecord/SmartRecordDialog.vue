<script setup lang="ts" generic="T extends Record<string, any>">
import { computed, ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import SmartFieldValue from './SmartFieldValue.vue'
import { isSmartTableInDevMode } from '../SmartTable/dev-mode.composable'
import { debounce } from 'notsapodata'
import SmartRecordFields from './SmartRecordFields.vue'
import { useODataEntitySetPI } from '../../pi';
import { DialogClose } from 'radix-vue'
import VuDelayedSwitch from 'vunor/DelayedSwitch.vue'
import VuDialog from 'vunor/Dialog.vue'
import VuCardHeader from 'vunor/CardHeader.vue'
import VuIcon from 'vunor/Icon.vue'
import VuCardInner from 'vunor/CardInner.vue'
import VuInput from 'vunor/Input.vue'
import VuTabs from 'vunor/Tabs.vue'
import VuInnerLoading from 'vunor/InnerLoading.vue'
import VuButton from 'vunor/Button.vue'

type TFullField = { name: keyof T; label?: string }
type TField = keyof T | TFullField

const props = defineProps<{
  icon?: string
  iconSize?: string
  titleField?: keyof T
  subTitleField?: keyof T
  record: T | undefined
  fetchData?: boolean
  headerFields: TField[]
  exclude?: (keyof T)[]
  include?: (keyof T)[]
  groups?: Record<string, TField[]>
  closeButton?: boolean
  hideDescriptionFields?: boolean
  hideUnitFields?: boolean
}>()

const { metadataLoading, model, fields, fieldsMap, entity } = useODataEntitySetPI().inject()

const open = defineModel<boolean>('open')
const loading = ref(false)
const error = ref('')
const data = ref<T>()
const _loading = computed(() => loading.value || metadataLoading.value)
const _row = computed(() => data.value || props.record || ({} as T))

const _headerFields = computed<TFullField[]>(() =>
  props.headerFields.map(f => (typeof f === 'string' ? { name: f } : (f as TFullField)))
)

const _otherFields = computed<TFullField[]>(() => {
  let a =
    fields.value
      ?.filter(f => !props.exclude?.includes(f.$Name))
      .map(f => f.$Name)
      .sort() || []
  if (props.include) {
    a = a.filter(f => props.include!.includes(f))
  }
  if (props.hideUnitFields) {
    const _units = (fields.value?.map(f => f.$unit) || []).filter(Boolean) as string[]
    const unitsSet = new Set<string>(_units)
    a = a.filter(f => !unitsSet.has(f))
  }
  if (props.hideDescriptionFields) {
    const _descr = (fields.value?.map(f => f.$$description) || []).filter(Boolean) as string[]
    const descrSet = new Set<string>(_descr)
    a = a.filter(f => !descrSet.has(f))
  }
  return a
    .filter(f => !_headerFields.value.map(h => h.name).includes(f))
    .map(f => ({ name: f }) as TFullField)
})

const _groups = computed<Record<string, TFullField[]> | undefined>(() => {
  const g = {} as Record<string, TFullField[]>
  const groupedFields = new Set<string>()
  for (const [key, val] of Object.entries(props.groups || {})) {
    g[key] = val.map(f => (typeof f === 'string' ? { name: f } : (f as TFullField)))
    g[key].forEach(f => groupedFields.add(f.name as string))
  }
  if (_otherFields && Object.keys(g).length) {
    g['Other'] = _otherFields.value.filter(f => !groupedFields.has(f.name as string))
  }
  return Object.keys(g).length ? g : undefined
})

async function update() {
  error.value = ''
  if (!props.record) {
    return
  }
  if (!props.fetchData) {
    return
  }
  loading.value = true
  try {
    data.value = (await model.readRecord(entity.value!.name, props.record)) as T
  } catch (e) {
    data.value = undefined
    error.value = (e as Error).message
  }
  loading.value = false
  await nextTick()
  if (_groups.value) {
    tab.value = toId(Object.keys(_groups.value)[0] || '')
    onTab(tab.value)
  }
}

onMounted(() => {
  update()
  attachScrollEvent()
})

const onContentScroll = debounce((event: Event) => {
  const container = event.target as HTMLDivElement
  const containerRect = container.getBoundingClientRect()
  const anchors = Array.from(container.querySelectorAll('h6[data-anchor]'))

  let firstVisibleAnchor = null
  let closestAnchor = null
  let minDistance = Infinity

  for (const anchor of anchors) {
    const anchorRect = anchor.getBoundingClientRect()

    if (anchorRect.bottom >= containerRect.top && anchorRect.top <= containerRect.bottom) {
      if (!firstVisibleAnchor) {
        firstVisibleAnchor = anchor
      }
    }

    const distance = Math.abs(anchorRect.top - containerRect.top)
    if (distance < minDistance) {
      minDistance = distance
      closestAnchor = anchor
    }
  }

  const selectedAnchor = firstVisibleAnchor || closestAnchor
  const anchorId = selectedAnchor?.getAttribute('id')

  if (anchorId) {
    tab.value = anchorId
  }
}, 100)

async function attachScrollEvent() {
  await nextTick()
  document
    .querySelector(`#smart-record-content`)
    ?.closest('section')
    ?.addEventListener('scroll', onContentScroll)
}
function detachScrollEvent() {
  document
    .querySelector(`#smart-record-content`)
    ?.closest('section')
    ?.removeEventListener('scroll', onContentScroll)
}

onUnmounted(() => {
  detachScrollEvent()
})

watch(() => [props.record, props.fetchData], update)

watch([open], () => {
  if (open.value) {
    attachScrollEvent()
  } else {
    detachScrollEvent()
  }
})

function toId(group: string) {
  return `grp-${group.replace(/[^A-Za-z0-9]/g, '-').toLowerCase()}`
}

const tab = ref('')

function onTab(val?: string): any {
  if (!val) return
  const anchor = document.querySelector(`#smart-record-content #${val}`) as HTMLDivElement
  if (anchor) {
    setTimeout(() => {
      anchor.scrollIntoView({ behavior: 'smooth' })
    }, 1)
  }
}

const searchTerm = ref('')

const filteredFields = ref<TFullField[]>()

const onSearch = debounce(() => {
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    const fields = (
      _groups.value ? Object.values(_groups.value).flat() : _otherFields.value
    ) as TFullField[]
    filteredFields.value = fields.filter(f => {
      const field = fieldsMap.value?.get(f.name as string)
      if (field) {
        const label = (
          (isSmartTableInDevMode.value ? field.$Name : f.label) ||
          field.$label ||
          ''
        ).toLowerCase()
        const value = String(_row.value?.[f.name] || '').toLowerCase()
        const descr = field.$$description
          ? (_row.value?.[field.$$description] || '').toLowerCase()
          : ''
        return label.includes(search) || value.includes(search) || descr.includes(search)
      }
      return false
    })
  } else {
    filteredFields.value = undefined
  }
}, 50)
</script>

<template>
  <VuDelayedSwitch v-slot="{ on }" :value="open">
    <VuDialog
      v-if="on"
      v-model:open="open"
      v-bind="$attrs"
      content-class="flex-grow-1 overflow-auto"
    >
      <template v-slot:header>
        <div class="p-$card-spacing pb-0">
          <VuCardHeader class="flex items-center gap-$m">
            <slot name="header-icon">
              <VuIcon v-if="icon" :name="icon" :style="`--icon-size: ${iconSize || '2.34em'};`" />
            </slot>
            <div class="flex flex-col">
              <slot name="title" v-if="titleField || $slots['title']">
                <!-- prettier-ignore-attribute :name -->
                <SmartFieldValue
                  :name="(titleField as string)"
                  :value="_row[titleField!]"
                  :row="_row"
                  v-slot="{ value }"
                >
                  {{ value }}
                </SmartFieldValue>
              </slot>
              <div class="text-body-s pb-$s" v-if="subTitleField || $slots['subTitle']">
                <slot name="subTitle">
                  <!-- prettier-ignore-attribute :name -->
                  <SmartFieldValue
                    :name="(subTitleField as string)"
                    :value="_row[subTitleField!]"
                    :row="_row"
                    v-slot="{ value }"
                  >
                    {{ value }}
                  </SmartFieldValue>
                </slot>
              </div>
            </div>
            <DialogClose v-if="closeButton" as-child>
              <button class="dialog-close">
                <VuIcon name="i--close" />
              </button>
            </DialogClose>
          </VuCardHeader>
        </div>
        <VuCardInner class="not-sap-record-dialog-header pb-0">
          <div class="not-sap-record-dialog-header-ovrelay"></div>
          <slot name="body-icon">
            <VuIcon v-if="icon" :name="icon" class="not-sap-record-dialog-header-icon" />
          </slot>
          <SmartRecordFields :fields="_headerFields" :record="_row" />

          <VuInput
            design="filled"
            placeholder="Search"
            class="my-$m max-w-14em"
            icon-append="i--search"
            v-model="searchTerm"
            @update:modelValue="onSearch"
          />
          <VuTabs
            v-if="_groups && !filteredFields"
            v-model="tab"
            @update:model-value="onTab"
            :tabs="Object.keys(_groups).map(g => ({ label: g, value: toId(g) }))"
            indicator
          />
        </VuCardInner>
      </template>

      <VuCardInner class="relative overflow-clip" id="smart-record-content">
        <template v-if="_groups && !filteredFields">
          <template v-for="[group, fields] in Object.entries(_groups)" :key="group">
            <slot :name="`title-grp-${group.toLowerCase().replace(/\s/g, '-')}`" :id="toId(group)">
              <h6
                class="tracking-[.05em] leading-[4em]! first:text-mt-0"
                :id="toId(group)"
                data-anchor
              >
                {{ group }}
              </h6>
            </slot>
            <slot :name="`before-grp-${group.toLowerCase().replace(/\s/g, '-')}`"></slot>
            <SmartRecordFields :fields="fields" :record="_row" />
            <slot :name="`after-grp-${group.toLowerCase().replace(/\s/g, '-')}`"></slot>
          </template>
        </template>
        <SmartRecordFields v-else :fields="filteredFields || _otherFields" :record="_row" />
      </VuCardInner>
      <VuInnerLoading v-if="_loading" class="backdrop-blur-sm" />
      <div v-if="error" class="not-sap-record-dialog-error-overlay backdrop-blur-sm">
        <div class="not-sap-record-dialog-error-text">{{ error }}</div>
        <div class="flex gap-$s scope-primary">
          <VuButton label="Try Again" class="c8-filled" @click="update" />
          <VuButton label="Close" class="c8-flat" @click="open = false" />
        </div>
      </div>
    </VuDialog>
  </VuDelayedSwitch>
</template>

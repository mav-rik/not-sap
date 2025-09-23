<script setup lang="ts">
import { useODataEntitySetPI } from '@/_not-sap-ui/renderless/ODataEntitySet.pi'
import type { TEntityCurrencyEntry } from '@/_odata'

const props = defineProps<{
  name: string
  value: string | number | Date | boolean | undefined
  row?: Record<string, unknown>
}>()

const { fieldsMap, entity } = useODataEntitySetPI().inject()

const _field = computed(() => fieldsMap.value.get(props.name))
const _currency = computed<TEntityCurrencyEntry | undefined>(() => {
  if (_isMonetary.value && currencies.value && _units.value) {
    const n = Number(props.value || 0)
    if (n === 0) {
      return undefined
    }
    return currencies.value.get(_units.value as string)
  }
})
const _value = computed(() => {
  if (_isMonetary.value && currencies.value && _units.value) {
    const u = _currency.value
    if (u) {
      const n = Number(props.value || 0)
      return n
        .toLocaleString('en-US', {
          minimumFractionDigits: u.DecimalPlaces,
          maximumFractionDigits: u.DecimalPlaces,
        })
        .replace(/,/g, ' ')
    }
  }
  return typeof props.value === 'string'
    ? _field.value?.fromRaw.toDisplay(props.value)
    : _field.value?.fromJson.toDisplay(props.value || '')
})
const _date = computed(() => {
  if (props.value instanceof Date) {
    return props.value
  }
  if (_field.value && ['Edm.DateTime', 'Edm.Date'].includes(_field.value.$Type)) {
    return _field.value.fromRaw.toJson(props.value as string)
  }
})
const _unitField = computed(() => {
  if (_field.value?.$unit) {
    return fieldsMap.value.get(_field.value.$unit)
  }
})
const _units = computed(() => {
  if (_unitField.value) {
    return props.row?.[_unitField.value.$Name]
  }
})

const _isMonetary = computed(() => {
  return _unitField.value?.$semantics === 'currency-code'
})

const currencies = ref<Map<string, TEntityCurrencyEntry>>()

async function prepareCurrencies() {
  if (Number(props.value || 0) !== 0 && entity.value && _isMonetary.value) {
    currencies.value = await entity.value.readCurrencies()
  }
}

watch([_isMonetary], prepareCurrencies)

onMounted(prepareCurrencies)
</script>

<template>
  <!-- prettier-ignore-attribute :description -->
  <slot
    :field="_field"
    :unit-field="_unitField"
    :raw-value="props.value"
    :value="_value"
    :date="_date"
    :units="_units"
    :currency="_currency"
    :row
    :is-monetary="_isMonetary"
    :description="(_field?.$$description && row?.[_field?.$$description] as string | undefined)"
  >
  </slot>
</template>

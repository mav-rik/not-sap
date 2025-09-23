<script
  setup
  lang="ts"
  generic="
    MODEL extends OData<M>,
    K extends keyof M['entitySets'],
    M extends TOdataDummyInterface = MODEL extends OData<infer M> ? M : TOdataDummyInterface
  "
>
import { OData, type TOdataDummyInterface } from 'notsapodata'
import { useODataEntitySetPI } from './ODataEntitySet.pi'

const props = defineProps<{
  model: MODEL
  entitySet: K
}>()

const {
  fields,
  fieldsMap,
  entity,
  metadata,
  metadataLoading,
  metadataLoadingPromise,
  metadataLoadingError,
} = useODataEntitySetPI<MODEL, K, M>().provide(props)
</script>

<script lang="ts">
export default {}
</script>

<template>
  <slot
    :model
    :entity-set
    :entity
    :fields
    :fields-map
    :metadata
    :metadata-loading
    :metadata-loading-promise
    :metadata-loading-error
  >
  </slot>
</template>

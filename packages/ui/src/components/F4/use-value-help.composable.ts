import type { EntitySet, TEntitySetQueryParams } from 'notsapodata';
import type { OData, TOdataDummyInterface, TODataTypedFilterValue } from 'notsapodata';
import { useSmartTablePI } from '../SmartTable/SmartTable.pi';
import type { TPropertyAnnotations } from 'notsapodata';
import { computed, ref, watch } from 'vue';

export interface TValueHelpQuery {
  top?: number;
  skip?: number;
  filters?: TEntitySetQueryParams['filter'];
  searchTerm?: string;
}

export function useValueHelp<
  MODEL extends OData<M>,
  K extends keyof M['entitySets'],
  M extends TOdataDummyInterface = MODEL extends OData<infer M> ? M : TOdataDummyInterface,
>(fieldName: string) {
  const { entity, fieldsFilters, queryImmediate, mustRefresh } = useSmartTablePI<
    MODEL,
    K,
    M
  >().inject();

  const helpEntitySet = ref<EntitySet>();
  const model = ref<OData>();
  const valueList = ref<TPropertyAnnotations['Common.ValueList']>();
  const columnsNames = ref<string[]>([]);
  const updateVars = () => {
    entity.value
      ?.getValueHelpEntitySet(fieldName)
      .then((es) => {
        helpEntitySet.value = es as EntitySet<TOdataDummyInterface, string>;
        model.value = (es as EntitySet<TOdataDummyInterface, string>).getModel();
        valueList.value = entity.value?.getField(
          fieldName as M['entityTypes'][M['entitySets'][K]]['fields']
        )?.annotations['Common.ValueList'];
        columnsNames.value =
          valueList.value?.Parameters.filter((p) => outputFields.includes(p.$Type)).map(
            (p) => p.ValueListProperty
          ) || [];
      })
      .catch((error) => {
        console.error(`"${fieldName}" failed to load value-help`, error);
      });
  };
  watch([entity], () => {
    updateVars();
  });
  updateVars();
  const searchSupported = computed(() => valueList.value?.SearchSupported);

  const outputFields = [
    'Common.ValueListParameterInOut',
    'Common.ValueListParameterOut',
    'Common.ValueListParameterDisplayOnly',
    'SAP__common.ValueListParameterInOut',
    'SAP__common.ValueListParameterOut',
    'SAP__common.ValueListParameterDisplayOnly',
  ];

  const inFields = [
    'Common.ValueListParameterIn',
    'Common.ValueListParameterInOut',
    'SAP__common.ValueListParameterIn',
    'SAP__common.ValueListParameterInOut',
  ];

  const columns = computed(() => {
    if (helpEntitySet.value) {
      return columnsNames.value.map((p) => helpEntitySet.value?.getField(p)!).filter(Boolean);
    }
    return [];
  });

  const inParams = computed(
    () =>
      valueList.value?.Parameters.filter(
        (p) => p.LocalDataProperty && inFields.includes(p.$Type)
      ) || []
  );

  function getFilterValue(item: Record<string, string>): TODataTypedFilterValue {
    return {
      type: 'value',
      // @ts-expect-error
      value: [item[inParams.value?.[0]?.ValueListProperty]],
    };
  }

  return {
    columnsNames,
    columns,
    fieldsFilters,
    getFilterValue,
    valueList,
    searchSupported,
    queryImmediate,
    mustRefresh,
    model,
  };
}

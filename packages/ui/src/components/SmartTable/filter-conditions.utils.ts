import {
  odataFilterFormat,
  type TODataFieldsFilters,
  type TODataFilter,
  type TODataFilterConditionType,
  type TODataFilters,
  type TODataTypedFilterValue,
} from 'notsapodata'

export type TODataTypedFilterValueDisplay = TODataTypedFilterValue & {
  display: string
}

export type TODataTypedFilterValueDisplayArray = TODataTypedFilterValueDisplay[]

export function doesConditionHave2ndValue(item: TODataTypedFilterValue) {
  const _hasValue2: TODataFilterConditionType[] = ['bw', 'notBw']
  return _hasValue2.includes(item.type)
}

export function isConditionFilled(item: TODataTypedFilterValue) {
  return Boolean(
    item.type === 'empty' ||
      item.type === 'notEmpty' ||
      (doesConditionHave2ndValue(item) ? item.value[0] && item.value[1] : item.value[0])
  )
}

export function convertF4Condition(
  c: TODataTypedFilterValue
): TODataTypedFilterValueDisplayArray[number] {
  return {
    type: c.type,
    value: c.value,
    display: odataFilterFormat.toString[c.type](c.value[0] as string, c.value[1] as string),
  }
}

export function fieldsFiltersToODataFilters(fieldsFilters: TODataFieldsFilters): TODataFilters {
  const odataFilters: TODataFilters = []

  for (const [key, filters] of Object.entries(fieldsFilters)) {
    const p: TODataFilter[] = []
    const n: TODataFilter[] = []
    for (const f of filters || []) {
      const typed = odataFilterFormat.toTypedValue(f)
      const target = typed.type.startsWith('not') ? n : p
      target.push({ [key]: odataFilterFormat.fromTypedValue(typed) })
    }
    if (p.length) {
      odataFilters.push({
        $or: p,
      })
    }
    if (n.length) {
      odataFilters.push({
        $and: n,
      })
    }
  }
  return [{ $and: odataFilters }]
}

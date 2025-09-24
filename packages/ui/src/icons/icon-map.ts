export const notSapIconMap = {
  'checkmark': 'fluent:checkmark-16-filled',
  'chevron-down': 'fluent:chevron-down-16-filled',
  'chevron-down-2': 'fluent:chevron-down-12-filled',
  'chevron-up': 'fluent:chevron-up-16-filled',
  'chevron-up-2': 'fluent:chevron-up-12-filled',
  'clear': 'mdi:clear-box',
  'close': 'ic:round-clear',
  'columns': 'tabler:columns-3-filled',
  'config': 'proicons:settings',
  'delete': 'proicons:delete',
  'eye-off': 'proicons:eye-off',
  'f4-help': 'carbon:popup',
  'fav-off': 'fluent:star-16-regular',
  'fav-on': 'fluent:star-16-filled',
  'filter': 'proicons:filter-2',
  'filter-off': 'proicons:filter-cancel-2',
  'lock': 'proicons:lock',
  'refresh': 'proicons:arrow-sync',
  'search': 'proicons:search',
  'select-all': 'fluent:select-all-on-16-regular',
  'select-none': 'fluent:select-all-off-16-regular',
  'sort': 'iconoir:sort',
  'sort-asc': 'iconoir:sort-up',
  'sort-desc': 'iconoir:sort-down',
} as const

export type NotSapIconName = keyof typeof notSapIconMap

export const notSapIconNames = Object.keys(notSapIconMap) as NotSapIconName[]

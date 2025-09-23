import { defineShortcuts, type TVunorShortcut } from 'vunor/theme'

export const notSapShortcuts: TVunorShortcut = defineShortcuts({
  // elevated
  'elevated': {
    '': 'current-bg-scope-light-0 bg-current',
    'dark:': 'current-bg-scope-dark-1',
    '[&_.elevated]:dark:': 'current-bg-scope-dark-2',
    '[&_.elevated_.elevated]:dark:': 'current-bg-scope-dark-3',
  },

  'not-sap-token': {
    '': 'surface-50 opacity-90 border px-$xs rounded flex items-center cursor-default select-none text-body-s text-[12px] whitespace-nowrap',
    'hover:': 'opacity-100',
  },
  'not-sap-token-remove': {
    '': 'cursor-pointer opacity-50',
    'hover:': 'opacity-100',
  },

  'not-sap-dialog-footer': 'shadow-[0_-1px_6px_0px_rgba(0,_0,_0,_0.1)] z-2',
})

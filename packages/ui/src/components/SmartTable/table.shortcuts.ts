import { defineShortcuts, type TVunorShortcut } from 'vunor/theme'

export const notSapTableShortcuts: TVunorShortcut = defineShortcuts({
  'not-sap-table': {
    '[&_td]:': 'min-h-fingertip shadow-[inset_0_1px_#77777725] items-center', // pr-$m
    '[&_td.not-sap-checkbox-cell]:': 'shadow-[inset_-1px_1px_#77777725] px-$m w-[1%]', // pr-$m
    '[&_th]:': 'min-h-fingertip', // pr-$m

    '[&_th:first-child]:': 'pl-$m',
    '[&_th:last-child]:': 'pr-$m',
    '[&_td:first-child]:': 'pl-$m',
    '[&_td:last-child]:': 'pr-$m',
  },

  'not-sap-hl': 'bg-transparent absolute left-0 top-0 right-0 bottom-0 z-1 pointer-events-none',

  'not-sap-row': {
    '': 'outline-none cursor-default relative',
    '[&_.not-sap-hl]:hover:': 'bg-grey-400/5',
    '[&[data-highlighted]_.not-sap-hl]:': 'bg-grey-400/10',
    '[&[data-state=checked]]:': 'surface-50',
  },

  'not-sap-cell': 'h-auto flex min-h-fingertip py-$m px-$m items-center relative',
  'not-sap-unit': 'opacity-50 fw-$bold inline-block',
  'not-sap-head-numeric': 'justify-end!',
  'not-sap-cell-numeric': 'justify-end font-mono text-primary-500 fw-$bold',

  'not-sap-table-fixed': {
    '[&_th]:': 'h-fingertip truncate overflow-hidden',
    '[&_td]:': 'h-fingertip truncate overflow-hidden',
    '[&_.not-sap-cell]:': 'py-0 overflow-hidden truncate w-full',
  },

  'not-sap-col-hl': 'bg-grey-400/5',

  'not-sap-listbox-item':
    'flex items-center min-h-fingertip gap-$m px-$card-spacing select-none cursor-default',
  'not-sap-listbox-checkbox': {
    '': 'checkbox current-bg-scope-color-500 current-border-scope-color-500 border-solid',
    'group-[[data-state=unchecked]]/lbindicator:': 'current-border-grey-500 border-current/40',
  },
})

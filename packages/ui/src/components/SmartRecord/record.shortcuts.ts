import { defineShortcuts, type TVunorShortcut } from 'vunor/theme'

export const notSapRecordShortcuts: TVunorShortcut = defineShortcuts({
  'not-sap-record-fields': {
    '': 'grid grid-cols-[auto_1fr] gap-y-$s gap-x-$m',
  },
  'not-sap-record-label': {
    '': 'tracking-[.05em] opacity-70',
  },
  'not-sap-record-dialog-header': 'border-y relative overflow-clip pb-0',
  'not-sap-record-dialog-header-ovrelay':
    'absolute left-0 top-0 right-0 bottom-0 bg-black/50 dark:bg-black/20 mix-blend-overlay',
  'not-sap-record-dialog-header-icon':
    'absolute right-[-7em] bottom-[-1em] [--icon-size:20em] opacity-8',
  'not-sap-record-dialog-error-overlay': 'inner-loading flex-col gap-$m cursor-default',
  'not-sap-record-dialog-error-text': 'scope-error surface-50 border p-$m rounded',
  // default styles for record dialog
  'not-sap-record-dialog':
    'w-[100ch] min-h-[min(45em,100vh)] max-h-[min(98vh,67em)] h-[max(98vh,67em)] max-w-[100vw]',
  'not-sap-field-value-description': 'italic opacity-70',
})

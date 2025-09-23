import { notSapShortcuts } from './components/shortcuts'
import { rawVunorShortcuts, mergeVunorShortcuts } from 'vunor/theme'
import { notSapTableShortcuts } from './components/SmartTable/table.shortcuts'
import { notSapRecordShortcuts } from './components/SmartRecord/record.shortcuts'

export const notSapUiVunorShortcuts = mergeVunorShortcuts([
  ...rawVunorShortcuts,
  notSapShortcuts,
  notSapTableShortcuts,
  notSapRecordShortcuts,
])

import { useODataEntitySetPI } from '../../../renderless/ODataEntitySet.pi';
import type { TODataTypedFilterValue } from 'notsapodata';
import type { Reactive, ComputedRef, Ref } from 'vue';
import { reactive, ref, watch } from 'vue';
import { useProvideInject } from 'vunor/utils';
import { useSmartTablePI } from '../SmartTable.pi';
import { NotSapPresets } from '../../../presets/presets';
import { parsePresetField, stringifyPresetField } from '../../../presets';
import { convertF4Condition } from '../filter-conditions.utils';

export type TNotSapFavFilter = {
  label: string;
  filters: TODataTypedFilterValue[];
};

export const useSmartFilterPI = () =>
  useProvideInject('not-sap-ui-smart-filter', () => {
    const toInject = {} as {
      favFilters: Ref<TNotSapFavFilter[]>;
      refreshFavFilters: () => Promise<void>;
      saveFavFilter: (label: string, filters: TODataTypedFilterValue[]) => Promise<void>;
      delFavFilter: (label: string) => Promise<void>;
      favFiltersSaveDialog: Ref<boolean>;
      favFiltersLoadDialog: Ref<boolean>;
      favFiltersToSave: Reactive<{
        label: string;
        filters: TODataTypedFilterValue[];
      }>;
      openFavFiltersDialog: (type: 'save' | 'load', filters?: TODataTypedFilterValue[]) => void;
      fieldName: ComputedRef<string>;
      enableVariants: boolean;
    };

    return {
      _inject: () => toInject,
      _provide: (opts: { fieldName: ComputedRef<string> }) => {
        toInject.fieldName = opts.fieldName;

        const { appNamespace } = useODataEntitySetPI().inject();
        const { variantKey, refreshPresets, enableVariants } = useSmartTablePI().inject();

        const favFilters = ref<TNotSapFavFilter[]>([]) as Ref<TNotSapFavFilter[]>;

        async function refreshFavFilters() {
          if (appNamespace?.value) {
            const p = new NotSapPresets(appNamespace.value, variantKey.value);
            const ff = await p.readFavFilters(opts.fieldName.value);
            favFilters.value = Object.entries(ff || {}).map(([label, value]) => ({
              label,
              filters: parsePresetField(value),
            })) as TNotSapFavFilter[];
          } else {
            favFilters.value = [];
          }
        }

        async function saveFavFilter(
          label: string,
          filters: TODataTypedFilterValue[]
        ): Promise<void> {
          if (appNamespace?.value) {
            const p = new NotSapPresets(appNamespace.value, variantKey.value);
            await p.saveFavFilters(opts.fieldName.value, label, stringifyPresetField(filters));
            await refreshPresets();
            await refreshFavFilters();
          }
        }

        async function delFavFilter(label: string): Promise<void> {
          if (appNamespace?.value) {
            const p = new NotSapPresets(appNamespace.value, variantKey.value);
            await p.delFavFilters(opts.fieldName.value, label);
            await refreshPresets();
            await refreshFavFilters();
          }
        }

        toInject.favFilters = favFilters;
        toInject.enableVariants = enableVariants;

        toInject.refreshFavFilters = refreshFavFilters;
        toInject.saveFavFilter = saveFavFilter;
        toInject.delFavFilter = delFavFilter;

        toInject.favFiltersSaveDialog = ref(false);
        toInject.favFiltersLoadDialog = ref(false);
        toInject.favFiltersToSave = reactive({
          field: '',
          label: '',
          filters: [],
        });

        toInject.openFavFiltersDialog = (
          type: 'load' | 'save',
          filters?: TODataTypedFilterValue[]
        ) => {
          if (type === 'load') {
            toInject.favFiltersLoadDialog.value = true;
          } else if (type === 'save' && filters) {
            toInject.favFiltersToSave.filters = filters;
            const l = filters.map((t) => convertF4Condition(t).display).join(' | ');
            toInject.favFiltersToSave.label =
              (l.length > 30 ? l.slice(0, 30) + '...' : l) + ` (${filters.length})`;
            toInject.favFiltersSaveDialog.value = true;
          }
        };

        watch([opts.fieldName, appNamespace, variantKey], refreshFavFilters);
        refreshFavFilters();

        return toInject;
      },
    };
  });

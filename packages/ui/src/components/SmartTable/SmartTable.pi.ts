import type {
  EntitySet,
  EntitySetField,
  EntitySetFields,
  Metadata,
  OData,
  TEntitySetQueryParams,
  TEntitySetSorter,
  TOdataDummyInterface,
  TODataFieldsFilters,
  TODataFilters,
  TODataParams,
} from 'notsapodata';
import { useProvideInject } from 'vunor/utils';
import type { ModelRef, Ref, ComputedRef } from 'vue';
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { fieldsFiltersToODataFilters } from './filter-conditions.utils';
import { useODataEntitySetPI } from '../../renderless/ODataEntitySet.pi';
import { debounce } from 'notsapodata'
import { NotSapPresets, type TNotSapPreset } from '../../presets/presets';
import { parsePresetField, stringifyPresetField } from '../../presets';

export type TODataEntityCustomQuery<
  MODEL extends OData<M>,
  K extends keyof M['entitySets'],
  M extends TOdataDummyInterface = MODEL extends OData<infer M> ? M : TOdataDummyInterface,
> = (
  entity: EntitySet<M, K>,
  params: TODataParams,
  append: boolean,
  records: Record<M['entityTypes'][M['entitySets'][K]]['fields'], string>[]
) => Promise<{
  inlineCount?: number;
  records: Record<M['entityTypes'][M['entitySets'][K]]['fields'], string>[];
  append?: boolean;
  nextTop?: number;
  nextSkip?: number;
  loadedCount?: number;
}>;

export const useSmartTablePI = <
  MODEL extends OData<M>,
  K extends keyof M['entitySets'],
  M extends TOdataDummyInterface = MODEL extends OData<infer M> ? M : TOdataDummyInterface,
>() =>
  useProvideInject('not-sap-ui-smart-table', () => {
    const toInject = {} as {
      entity: Ref<EntitySet<M, K> | undefined>;
      model: MODEL;
      getODataFilters: () => TODataFilters;
      getFilterString: () => string | undefined;
      results: ModelRef<Record<M['entityTypes'][M['entitySets'][K]]['fields'], string>[]>;
      inlineCount: Ref<number | undefined>;
      query: (params?: TEntitySetQueryParams) => void;
      queryImmediate: (params?: TEntitySetQueryParams, append?: boolean) => Promise<void>;
      queryNext: () => Promise<void>;
      readAllEntries: (
        params?: TEntitySetQueryParams & {
          chunkSize?: number;
        }
      ) => {
        abort: () => void;
        records: Ref<Record<M['entityTypes'][M['entitySets'][K]]['fields'], string>[]>;
        count: Ref<number>;
        total: Ref<number>;
        done: Ref<boolean>;
        error: Ref<Error | undefined>;
      };
      filtersNames: Ref<M['entityTypes'][M['entitySets'][K]]['fields'][]>;
      fieldsFilters: Ref<TODataFieldsFilters>;
      fieldsFiltersCount: Ref<number>;
      columnsNames: Ref<M['entityTypes'][M['entitySets'][K]]['fields'][]>;
      top: ComputedRef<number | undefined>;
      skip: ComputedRef<number | undefined>;
      forceFilters: ComputedRef<string | TODataFilters | undefined>;
      forceSorters: ComputedRef<TEntitySetSorter[] | undefined>;
      searchTerm: ComputedRef<string | undefined>;
      searchFocus: ComputedRef<string | undefined>;
      querying: Ref<boolean>;
      queryingNext: Ref<boolean>;
      filters: Ref<EntitySetFields>;
      columns: Ref<EntitySetFields>;
      sorters: ModelRef<TEntitySetSorter[]>;
      filterableFields: ComputedRef<Map<string, EntitySetField>>;
      sortableFields: ComputedRef<Map<string, EntitySetField>>;
      selectedRows: Ref<
        Record<string, string> | string | (Record<string, string> | string)[] | undefined
      >;
      selectAll: Ref<boolean>;
      rowValueFn: ComputedRef<(row: Record<string, any>) => Record<string, any> | string>;
      keepSelectedAfterRefresh: ComputedRef<boolean>;
      resetFilters: () => void;
      showConfigDialog: (_tab?: 'columns' | 'filters' | 'sorters') => void;
      showCreatePresetDialog: () => void;
      showManagePresetsDialog: () => void;
      mustRefresh: Ref<boolean>;
      metadataLoading: Ref<boolean | undefined>;
      metadataLoadingPromise: Ref<Promise<Metadata<M>>>;
      metadataLoadingError: Ref<Error | undefined>;
      fieldsMap: ComputedRef<Map<M['entityTypes'][M['entitySets'][K]]['fields'], EntitySetField>>;
      queryError: Ref<Error | undefined>;
      loadedCount: Ref<number>;
      blockQuery: ComputedRef<boolean | undefined>;
      blockQueryReason: ComputedRef<string | undefined>;
      // variant management
      appNamespace?: ComputedRef<string>;
      variantKey: ComputedRef<string>;
      presets: Ref<TNotSapPreset[]>;
      activePreset: Ref<TNotSapPreset | undefined>;
      updateDefaultPreset: (id: string) => Promise<void>;
      updateFavPresets: (favs?: string[]) => Promise<void>;
      deletePreset: (id: string) => Promise<void>;
      createPreset: (opts: {
        label: string;
        fav?: boolean;
        default?: boolean;
        filtersNames?: boolean;
        columnsNames?: boolean;
        sorters?: boolean;
        fieldsFilters?: boolean;
        public?: boolean;
      }) => Promise<void>;
      updatePreset: (
        id: string,
        opts: {
          fav?: boolean;
          default?: boolean;
          filtersNames?: boolean;
          columnsNames?: boolean;
          sorters?: boolean;
          fieldsFilters?: boolean;
        }
      ) => Promise<void>;
      refreshPresets: () => Promise<TNotSapPreset | undefined>;
      applyPreset: (preset: TNotSapPreset) => void;
      onInitPreset: (cb: () => void | Promise<void>) => void;
      enableVariants: boolean;
    };

    return {
      _inject: () => toInject,
      _provide: (opts: {
        filtersNames: Ref<M['entityTypes'][M['entitySets'][K]]['fields'][]>;
        fieldsFilters: Ref<TODataFieldsFilters>;
        columnsNames: Ref<M['entityTypes'][M['entitySets'][K]]['fields'][]>;
        sorters: ModelRef<TEntitySetSorter[]>;
        results: ModelRef<Record<M['entityTypes'][M['entitySets'][K]]['fields'], string>[]>;
        top: ComputedRef<number | undefined>;
        skip: ComputedRef<number | undefined>;
        searchTerm: ComputedRef<string | undefined>;
        searchFocus: ComputedRef<string | undefined>;
        forceFilters: ComputedRef<string | TODataFilters | undefined>;
        forceSelect: ComputedRef<string[] | undefined>;
        forceSorters: ComputedRef<TEntitySetSorter[] | undefined>;
        blockQuery: ComputedRef<boolean | undefined>;
        blockQueryReason: ComputedRef<string | undefined>;
        selectedRows: Ref<
          Record<string, string> | string | (Record<string, string> | string)[] | undefined
        >;
        rowValueFn: ComputedRef<(row: Record<string, any>) => Record<string, any> | string>;
        keepSelectedAfterRefresh: ComputedRef<boolean>;
        showConfigDialog: (_tab?: 'columns' | 'filters' | 'sorters') => void;
        showCreatePresetDialog: () => void;
        showManagePresetsDialog: () => void;
        customQuery: ComputedRef<TODataEntityCustomQuery<MODEL, K, M> | undefined>;
        variantKey: ComputedRef<string | undefined>;
        enableVariants?: boolean;
      }) => {
        const {
          model,
          entity,
          entitySet,
          fieldsMap,
          fields,
          metadataLoading,
          metadataLoadingPromise,
          metadataLoadingError,
          appNamespace,
        } = useODataEntitySetPI<MODEL, K, M>().inject();

        let queryDetected = false;

        toInject.model = model;
        toInject.entity = entity;
        toInject.fieldsMap = fieldsMap;
        toInject.metadataLoadingError = metadataLoadingError;
        toInject.queryError = ref();

        toInject.getODataFilters = () => fieldsFiltersToODataFilters(toInject.fieldsFilters.value);

        toInject.getFilterString = () => entity.value?.renderFilter(toInject.getODataFilters());

        toInject.resetFilters = () => (toInject.fieldsFilters.value = {});

        toInject.results = opts.results;

        toInject.querying = ref(false);
        toInject.queryingNext = ref(false);

        toInject.inlineCount = ref<number>();

        toInject.columnsNames = opts.columnsNames;
        toInject.filtersNames = opts.filtersNames;
        toInject.fieldsFilters = opts.fieldsFilters;

        toInject.fieldsFiltersCount = computed(() => {
          let count = 0;
          for (const [, filters] of Object.entries(toInject.fieldsFilters.value)) {
            count += filters?.length || 0;
          }
          return count;
        });

        toInject.top = opts.top;
        toInject.skip = opts.skip;
        toInject.forceFilters = opts.forceFilters;
        toInject.forceSorters = opts.forceSorters;
        toInject.searchTerm = opts.searchTerm;
        toInject.searchFocus = opts.searchFocus;
        toInject.selectedRows = opts.selectedRows;
        toInject.rowValueFn = opts.rowValueFn;
        toInject.keepSelectedAfterRefresh = opts.keepSelectedAfterRefresh;
        toInject.selectAll = ref(false);

        toInject.columns = computed(() => {
          const fields = [] as EntitySetFields;
          toInject.columnsNames.value.forEach((name) => {
            const f = fieldsMap.value.get(name);
            if (f) {
              fields.push(f);
            }
          });
          return fields;
        });

        toInject.filterableFields = computed(() => {
          const m = new Map<string, EntitySetFields[number]>();
          fields.value.filter((f) => f.$filterable !== false).forEach((f) => m.set(f.$Name, f));
          return m;
        });

        toInject.sortableFields = computed(() => {
          const m = new Map<string, EntitySetFields[number]>();
          fields.value.filter((f) => f.$sortable !== false).forEach((f) => m.set(f.$Name, f));
          return m;
        });

        toInject.sorters = opts.sorters;
        if (toInject.forceSorters.value) {
          toInject.sorters.value = mergeSorters(
            toInject.forceSorters.value,
            toInject.sorters.value
          );
        }

        toInject.filters = computed(() => {
          const fields = [] as EntitySetFields;
          toInject.filtersNames.value.forEach((name) => {
            const f = toInject.filterableFields.value.get(name);
            if (f) {
              fields.push(f);
            }
          });
          return fields;
        });

        let nextSkip = 0;
        let nextTop = 1000;

        toInject.queryNext = () => {
          return toInject.queryImmediate(
            {
              top: nextTop,
              skip: nextSkip,
            },
            true
          );
        };

        function clearSelection() {
          toInject.selectAll.value = false;
          toInject.selectedRows.value = [];
        }

        watch([toInject.columnsNames, toInject.sorters], () => {
          if (queryDetected) {
            toInject.query();
          }
        });

        watch([toInject.fieldsFilters, toInject.columnsNames, toInject.sorters], () => {
          toInject.mustRefresh.value = true;
        });

        toInject.mustRefresh = ref(false);

        function mergeSorters(
          forceSorters: TEntitySetSorter[] | undefined,
          sorters: TEntitySetSorter[] | undefined
        ): { name: string; desc?: boolean }[] {
          const result: { name: string; desc?: boolean }[] = [];
          const nameMap = new Map<string, { name: string; desc?: boolean }>();

          for (const s of forceSorters ?? []) {
            const obj = typeof s === 'string' ? { name: s } : s;
            result.push(obj);
            nameMap.set(obj.name, obj);
          }

          for (const s of sorters ?? []) {
            const obj = typeof s === 'string' ? { name: s } : s;
            const existing = nameMap.get(obj.name);
            if (existing) {
              if (existing.desc === undefined && obj.desc !== undefined) {
                existing.desc = obj.desc;
              }
            } else {
              result.push(obj);
              nameMap.set(obj.name, obj);
            }
          }

          return result;
        }

        function prepareQuery(params?: TEntitySetQueryParams) {
          const skip = params?.skip ?? toInject.skip.value ?? 0;
          const top = params?.top ?? toInject.top.value ?? 1000;
          return entity.value!.prepareQuery({
            filter: params?.filter ?? toInject.forceFilters.value ?? toInject.getFilterString(),
            inlinecount: params?.inlinecount ?? 'allpages',
            search: params?.search ?? toInject.searchTerm.value,
            searchFocus: params?.searchFocus ?? undefined,
            select: Array.from(
              new Set([
                ...(params?.select ?? toInject.columnsNames.value ?? []),
                ...(opts.forceSelect.value || []),
              ])
            ),
            sorters: mergeSorters(
              opts.forceSorters.value,
              params?.sorters || toInject.sorters.value
            ),
            top,
            skip,
          });
        }

        toInject.blockQuery = opts.blockQuery;
        toInject.blockQueryReason = opts.blockQueryReason;

        toInject.readAllEntries = (params?) => {
          if (!entity.value) {
            throw new Error('EntitySet not initialized');
          }
          const q = prepareQuery(params);
          const records = ref([]) as Ref<Record<M['entityTypes'][M['entitySets'][K]]['fields'], string>[]>;
          const count = ref(0);
          const total = ref(toInject.inlineCount.value || 0);
          const done = ref(false);
          const error = ref() as Ref<Error | undefined>;

          const { abort, promise } = model.readAllEntries(q.entitySet, {
            ...q.params,
            chunkSize: params?.chunkSize,
            progressCb(_count, _total, _done) {
              count.value = _count;
              total.value = _total || 0;
            },
          });
          promise.catch((e) => {
            error.value = e;
            done.value = true;
          });
          promise
            .then((r) => {
              records.value = r;
            })
            .finally(() => {
              done.value = true;
            });

          return {
            abort,
            records,
            count,
            total,
            done,
            error,
          };
        };

        let queryCount = 0;

        toInject.queryImmediate = async (params?: TEntitySetQueryParams, append?: boolean) => {
          toInject.queryError.value = undefined;
          await nextTick();
          if (toInject.blockQuery.value) {
            toInject.querying.value = false;
            throw new Error(`Querying blocked: ${toInject.blockQueryReason.value}`);
          }
          toInject.mustRefresh.value = false;
          if (entity.value) {
            queryCount++;
            const currentQuery = queryCount;
            queryDetected = true;
            if (!append && !toInject.keepSelectedAfterRefresh.value) {
              clearSelection();
            }
            if (append) {
              toInject.queryingNext.value = true;
            } else {
              toInject.querying.value = true;
            }
            const q = prepareQuery(params);
            const top = q.params.$top!;
            toInject.selectAll.value = false;
            try {
              if (opts.customQuery.value) {
                const customResult = await opts.customQuery.value(
                  entity.value,
                  q.params,
                  !!append,
                  toInject.results.value
                );
                if (currentQuery !== queryCount) {
                  return;
                }
                if (customResult.append) {
                  toInject.results.value = [...toInject.results.value, ...customResult.records];
                } else {
                  toInject.results.value = customResult.records;
                }
                if (typeof customResult.inlineCount === 'number') {
                  toInject.inlineCount.value = customResult.inlineCount;
                }
                nextSkip = customResult.nextSkip ?? toInject.results.value.length;
                nextTop = customResult.nextTop ?? top;
                toInject.loadedCount.value = customResult.loadedCount ?? toInject.results.length;
              } else {
                const { data, count } = await model.read(q.entitySet, q.params);
                if (currentQuery !== queryCount) {
                  return;
                }
                nextTop = top;
                if (data) {
                  if (append) {
                    const appended = [...toInject.results.value, ...data];
                    toInject.results.value = appended;
                    toInject.loadedCount.value = appended.length;
                    nextSkip = appended.length;
                  } else {
                    toInject.results.value = data;
                    toInject.loadedCount.value = data.length;
                    nextSkip = data.length;
                  }
                  toInject.inlineCount.value = count;
                } else {
                  if (!append) {
                    toInject.results.value = [];
                    nextSkip = 0;
                    toInject.loadedCount.value = 0;
                  }
                  toInject.inlineCount.value = undefined;
                }
              }
            } catch (error) {
              // todo: add error handling
              toInject.results.value = [];
              toInject.inlineCount.value = undefined;
              toInject.queryError.value = error as Error;
              toInject.loadedCount.value = 0;
            }
            toInject.mustRefresh.value = false;
            if (append) {
              toInject.queryingNext.value = false;
            } else {
              toInject.querying.value = false;
            }
          }
        };
        const queryDebounced = debounce(toInject.queryImmediate, 200);
        toInject.query = (params?: TEntitySetQueryParams) => {
          toInject.querying.value = true;
          toInject.mustRefresh.value = false;
          queryDebounced(params);
        };

        toInject.showConfigDialog = opts.showConfigDialog;
        toInject.showCreatePresetDialog = opts.showCreatePresetDialog;
        toInject.showManagePresetsDialog = opts.showManagePresetsDialog;

        toInject.metadataLoading = metadataLoading;
        toInject.metadataLoadingPromise = metadataLoadingPromise;

        toInject.loadedCount = ref(toInject.results.value.length);

        ///////////////////////////////////////////////////////////
        // Variants management
        ///////////////////////////////////////////////////////////

        toInject.enableVariants = !!opts.enableVariants;
        toInject.appNamespace = appNamespace;
        toInject.variantKey = computed(() => opts.variantKey.value || (entitySet.value as string));
        toInject.activePreset = ref();

        toInject.presets = ref([]);
        const presetsLabels = new Set<string>();

        const defaultPresetContent = {
          filtersNames: stringifyPresetField(toInject.filtersNames.value),
          columnsNames: stringifyPresetField(toInject.columnsNames.value),
          sorters: stringifyPresetField(toInject.sorters.value),
        };

        if (opts.enableVariants) {
          watch([appNamespace, toInject.variantKey], refreshPresets);
          initPresets();
        }

        async function initPresets() {
          const defaultPreset = await refreshPresets();
          if (defaultPreset) {
            toInject.activePreset.value = defaultPreset;
          }
          if (defaultPreset && defaultPreset.content !== defaultPresetContent) {
            applyPreset(defaultPreset, true);
          }
          fireInitPreset();
        }

        async function refreshPresets() {
          toInject.presets.value = [];
          presetsLabels.clear();
          if (appNamespace?.value) {
            const p = new NotSapPresets(appNamespace.value, toInject.variantKey.value);
            const presets = await p.readPresets(defaultPresetContent);
            toInject.presets.value = presets;
            for (const preset of presets) {
              presetsLabels.add(preset.label);
            }
            return presets.find((p) => p.default) || presets[0];
          }
        }

        function applyPreset(preset: TNotSapPreset, force?: boolean) {
          if (!opts.enableVariants) return;
          if (preset.id !== toInject.activePreset.value?.id || force) {
            toInject.activePreset.value = preset;
            if (typeof preset.content['filtersNames'] === 'string') {
              toInject.filtersNames.value = parsePresetField(preset.content['filtersNames']);
            }
            if (typeof preset.content['columnsNames'] === 'string') {
              toInject.columnsNames.value = parsePresetField(preset.content['columnsNames']);
            }
            if (typeof preset.content['sorters'] === 'string') {
              toInject.sorters.value = parsePresetField(preset.content['sorters']);
            }
            if (typeof preset.content['fieldsFilters'] === 'string') {
              toInject.fieldsFilters.value = parsePresetField(preset.content['fieldsFilters']);
            }
          }
        }

        async function deletePreset(id: string) {
          if (!opts.enableVariants) return;
          if (id === '*standard*') {
            throw new Error('Can not delete *standard* preset');
          }
          if (appNamespace?.value) {
            const p = new NotSapPresets(appNamespace.value, toInject.variantKey.value);
            await p.manager.delete(id);
            await refreshPresets();
            await nextTick();
            toInject.activePreset.value =
              toInject.presets.value.find((p) => p.id === id) || toInject.activePreset.value;
          }
        }

        async function updateDefaultPreset(id: string) {
          if (!opts.enableVariants) return;
          if (appNamespace?.value) {
            const p = new NotSapPresets(appNamespace.value, toInject.variantKey.value);
            p.setDefaultPreset(id);
            await refreshPresets();
          }
        }

        async function updateFavPresets(favs?: string[]) {
          if (!opts.enableVariants) return;
          if (appNamespace?.value) {
            const p = new NotSapPresets(appNamespace.value, toInject.variantKey.value);
            await p.setFavPresets(
              favs || toInject.presets.value.filter((p) => p.fav).map((p) => p.id)
            );
          }
        }

        async function createPreset(createOpts: {
          label: string;
          fav?: boolean;
          default?: boolean;
          filtersNames?: boolean;
          columnsNames?: boolean;
          sorters?: boolean;
          fieldsFilters?: boolean;
          public?: boolean;
        }) {
          if (!opts.enableVariants) return;
          if (presetsLabels.has(createOpts.label)) {
            throw new Error(`A preset with name "${createOpts.label}" already exists`);
          }
          if (appNamespace?.value) {
            const p = new NotSapPresets(appNamespace.value, toInject.variantKey.value);
            const updateContent =
              createOpts.filtersNames ||
              createOpts.columnsNames ||
              createOpts.sorters ||
              createOpts.fieldsFilters;
            if (!updateContent) {
              throw new Error(
                'At least one of filtersNames, columnsNames, sorters or filters must be true'
              );
            }
            const content = {
              filtersNames: createOpts.filtersNames
                ? stringifyPresetField(toInject.filtersNames.value)
                : undefined,
              columnsNames: createOpts.columnsNames
                ? stringifyPresetField(toInject.columnsNames.value)
                : undefined,
              sorters: createOpts.sorters
                ? stringifyPresetField(toInject.sorters.value)
                : undefined,
              fieldsFilters: createOpts.fieldsFilters
                ? stringifyPresetField(toInject.fieldsFilters.value)
                : undefined,
            } as Record<string, string>;
            const id = await p.createPreset({
              content,
              fav: createOpts.fav,
              label: createOpts.label,
              public: createOpts.public,
            });
            if (createOpts.default) {
              await p.setDefaultPreset(id);
            }
            if (createOpts.fav) {
              await p.setFavPresets(
                Array.from(
                  new Set([...toInject.presets.value.filter((p) => p.fav).map((p) => p.id), id])
                )
              );
            }
            await refreshPresets();
            await nextTick();
            toInject.activePreset.value =
              toInject.presets.value.find((p) => p.id === id) || toInject.activePreset.value;
          }
        }

        async function updatePreset(
          id: string,
          updateOpts: {
            fav?: boolean;
            default?: boolean;
            filtersNames?: boolean;
            columnsNames?: boolean;
            sorters?: boolean;
            fieldsFilters?: boolean;
          }
        ) {
          if (!opts.enableVariants) return;
          if (id === '*standard*') {
            throw new Error('Can not update *standard* preset');
          }
          if (appNamespace?.value) {
            const p = new NotSapPresets(appNamespace.value, toInject.variantKey.value);
            const updateContent =
              updateOpts.filtersNames ||
              updateOpts.columnsNames ||
              updateOpts.sorters ||
              updateOpts.fieldsFilters;
            const content = updateContent
              ? {
                  filtersNames: updateOpts.filtersNames
                    ? stringifyPresetField(toInject.filtersNames.value)
                    : undefined,
                  columnsNames: updateOpts.columnsNames
                    ? stringifyPresetField(toInject.columnsNames.value)
                    : undefined,
                  sorters: updateOpts.sorters
                    ? stringifyPresetField(toInject.sorters.value)
                    : undefined,
                  fieldsFilters: updateOpts.fieldsFilters
                    ? stringifyPresetField(toInject.fieldsFilters.value)
                    : undefined,
                }
              : undefined;
            await p.updatePreset({
              id,
              content,
              fav: updateOpts.fav,
            });
            if (updateOpts.default) {
              await p.setDefaultPreset(id);
            }
            await refreshPresets();
            // const defaultPreset = await refreshPresets()
            // if (toInject.activePreset.value?.id === id && defaultPreset) {
            //   applyPreset(defaultPreset)
            // }
          }
        }

        toInject.updateDefaultPreset = updateDefaultPreset;
        toInject.updateFavPresets = updateFavPresets;
        toInject.deletePreset = deletePreset;
        toInject.createPreset = createPreset;
        toInject.updatePreset = updatePreset;
        toInject.applyPreset = applyPreset;
        toInject.refreshPresets = refreshPresets;

        const initPresetListeners: (() => void | Promise<void>)[] = [];
        function fireInitPreset() {
          for (const cb of initPresetListeners) {
            cb();
          }
        }

        toInject.onInitPreset = (cb: () => void | Promise<void>) => {
          onMounted(() => {
            initPresetListeners.push(cb);
          });
          onUnmounted(() => {
            initPresetListeners.splice(initPresetListeners.indexOf(cb), 1);
          });
        };

        return toInject;
      },
    };
  });

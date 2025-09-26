import type { Metadata, OData, TOdataDummyInterface } from 'notsapodata';
import { useProvideInject } from 'vunor/utils';
import { computed, inject, ref, type ComputedRef, type Ref } from 'vue';
import type { EntitySet, EntitySetField, EntitySetFields } from 'notsapodata';

export const useODataEntitySetPI = <
  MODEL extends OData<M>,
  K extends keyof M['entitySets'],
  M extends TOdataDummyInterface = MODEL extends OData<infer M> ? M : TOdataDummyInterface,
>() =>
  useProvideInject('not-sap-ui-entity-set', () => {
    const toInject = {} as {
      entity: Ref<EntitySet<M, K> | undefined>;
      fields: ComputedRef<EntitySetFields<M['entityTypes'][M['entitySets'][K]]['fields']>>;
      metadataLoading: Ref<boolean | undefined>;
      metadataLoadingPromise: Ref<Promise<Metadata<M>>>;
      metadataLoadingError: Ref<Error | undefined>;
      metadata: Ref<Metadata<M> | undefined>;
      fieldsMap: ComputedRef<Map<M['entityTypes'][M['entitySets'][K]]['fields'], EntitySetField>>;
      model: MODEL;
      appNamespace?: ComputedRef<string>;
      entitySet: ComputedRef<K>;
    };

    return {
      _inject: () => toInject,
      _provide: (props: { model: MODEL; entitySet: K }) => {
        const metadata = ref<Metadata<M>>();
        const metadataLoading = ref<boolean>(false);
        toInject.metadataLoadingError = ref();
        toInject.entitySet = computed(() => props.entitySet);
        const entity = ref<EntitySet<M, K>>();

        const metadataPromise = props.model.getMetadata();
        const metadataLoadingPromise = ref(metadataPromise);
        metadataPromise
          .then((m) => {
            metadata.value = m;
            if (props.entitySet) {
              entity.value = m.getEntitySet(props.entitySet);
            } else {
              entity.value = undefined;
            }
            return m;
          })
          .catch((error) => {
            toInject.metadataLoadingError.value = error;
            console.error(error);
          })
          .finally(() => {
            metadataLoading.value = false;
          });

        toInject.appNamespace = inject('__not_sap_app_namespace__') as
          | ComputedRef<string>
          | undefined;

        toInject.metadata = metadata;
        toInject.metadataLoading = metadataLoading;
        toInject.metadataLoadingPromise = metadataLoadingPromise;

        toInject.entity = entity;
        toInject.fields = computed(() => toInject.entity.value?.fields || []);

        toInject.fieldsMap = computed(
          () =>
            toInject.entity.value?.fieldsMap ||
            new Map<M['entityTypes'][M['entitySets'][K]]['fields'], EntitySetField>()
        );

        toInject.model = props.model;
        return toInject;
      },
    };
  });

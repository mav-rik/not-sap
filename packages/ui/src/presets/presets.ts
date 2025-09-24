import { PresetManager, type TVariant } from './preset-manager'

export interface TNotSapPreset {
  id: string
  label: string
  fav: boolean
  public: boolean
  owner: string
  content: Record<string, unknown>
  default?: boolean
}

const NOT_SAP_PRESET = 'not-sap-preset'
const NOT_SAP_DEFAULT_PRESET = 'not-sap-default-preset'
const NOT_SAP_FAV_PRESETS = 'not-sap-fav-presets'
const NOT_SAP_FAV_FILTERS = 'not-sap-fav-filters'

export class NotSapPresets {
  public readonly manager: PresetManager

  constructor(
    public readonly appName: string,
    protected readonly key: string
  ) {
    this.manager = new PresetManager(appName)
  }

  async read(): Promise<TVariant[]> {
    const vars = Array.from((await this.manager.getAll())?.values() || [])
    const persistencyKey = `${this.appName}.${this.key}`
    return vars.filter(v => v.selector.persistencyKey === persistencyKey)
  }

  async readFavFilters(field: string) {
    const vars = await this.read()
    for (const p of vars) {
      if (p.changeType === NOT_SAP_FAV_FILTERS) {
        return p.content[field] as Record<string, string> | undefined
      }
    }
  }

  async saveFavFilters(field: string, label: string, filters: string) {
    const vars = await this.read()
    let preset: TVariant | undefined
    for (const p of vars) {
      if (p.changeType === NOT_SAP_FAV_FILTERS) {
        preset = p
        break
      }
    }
    if (preset) {
      preset.content[field] = (preset.content[field] || {}) as any
      ;(preset.content[field] as any)[label] = filters
      await this.manager.update(preset.variantId, {
        content: preset.content,
      })
    } else {
      await this.manager.create(this.key, {
        changeType: NOT_SAP_FAV_FILTERS,
        label: 'Favorite Filters',
        content: { [field]: { [label]: filters } },
        public: false,
        fav: false,
        executeOnSelection: false,
        standard: false,
      })
    }
  }

  async delFavFilters(field: string, label: string) {
    const vars = await this.read()
    let preset: TVariant | undefined
    for (const p of vars) {
      if (p.changeType === NOT_SAP_FAV_FILTERS) {
        preset = p
        break
      }
    }
    if (preset) {
      preset.content[field] = (preset.content[field] || {}) as any
      delete (preset.content[field] as any)[label]
      await this.manager.update(preset.variantId, {
        content: preset.content,
      })
    }
  }

  async readPresets(defaultContent?: Record<string, unknown>) {
    const vars = await this.read()
    const presets = [
      {
        id: '*standard*',
        label: 'Default',
        fav: true,
        default: false,
        content: defaultContent || {},
      },
    ] as TNotSapPreset[]
    let defaultPreset = '*standard*'
    const favs = new Set<string>()
    for (const p of vars) {
      if (p.changeType === NOT_SAP_PRESET) {
        presets.push({
          id: p.variantId,
          label: p.texts.variantName.value,
          fav: false,
          public: p.layer === 'PUBLIC',
          owner: p.support.user,
          content: p.content,
        })
      } else if (p.changeType === NOT_SAP_DEFAULT_PRESET) {
        defaultPreset = p.content['defaultPreset'] as string
      } else if (p.changeType === NOT_SAP_FAV_PRESETS) {
        for (const item of p.content['favs'] as string[]) {
          favs.add(item)
        }
      }
    }
    if (defaultPreset) {
      for (const p of presets) {
        if (p.id === defaultPreset) {
          p.default = true
        }
      }
    }
    for (const p of presets) {
      if (favs.has(p.id)) {
        p.fav = true
      }
    }
    return presets
  }

  async createPreset(
    preset: Partial<Omit<TNotSapPreset, 'id' | 'owner' | 'label' | 'content' | 'default'>> & {
      content: Record<string, string>
      label: string
    }
  ): Promise<string> {
    return this.manager.create(this.key, {
      changeType: NOT_SAP_PRESET,
      label: preset.label,
      content: preset.content,
      public: preset.public,
      fav: false,
      executeOnSelection: false,
      standard: false,
    })
  }

  async updatePreset(
    preset: Partial<Omit<TNotSapPreset, 'delete' | 'id'>> & { id: string }
  ): Promise<void> {
    await this.manager.update(preset.id, {
      content: preset.content,
      fav: false,
      executeOnSelection: false,
      standard: false,
    })
  }

  async setDefaultPreset(id: string): Promise<void> {
    await this.manager.create(this.key, {
      id: `__${this.appName}__${this.key}_defaultPreset`,
      changeType: NOT_SAP_DEFAULT_PRESET,
      content: {
        defaultPreset: id,
      },
      label: '*Default Preset ID*',
    })
  }

  async setFavPresets(favs: string[]): Promise<void> {
    await this.manager.create(this.key, {
      id: `__${this.appName}__${this.key}_favPresets`,
      changeType: NOT_SAP_FAV_PRESETS,
      content: {
        favs: favs.filter(f => f !== '*standard*'),
      },
      label: '*Favorite Presets IDs*',
    })
  }
}

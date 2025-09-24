import { iconifyIconsLoader } from './icon-loader'
import { notSapIconMap, NotSapIconName } from './icon-map'

export * from './icon-map'
export * from './icon-loader'

export const notSapIconsPreset = (icons?: Partial<Record<NotSapIconName, string | undefined>> & Record<string, string>) => iconifyIconsLoader({ aliases: {...notSapIconMap, ...icons} })
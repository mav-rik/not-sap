import { iconifyIconsLoader } from './icons/icon-loader'
import { notSapIconMap, NotSapIconName } from './icons/icon-map'

export * from './icons/icon-map'
export * from './icons/icon-loader'

export const notSapIconsPreset = (icons?: Partial<Record<NotSapIconName, string | undefined>> & Record<string, string>) => iconifyIconsLoader({ aliases: {...notSapIconMap, ...icons} })
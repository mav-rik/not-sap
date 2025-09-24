import { defineConfig, type Preset } from 'unocss'
import { presetVunor, vunorShortcuts } from 'vunor/theme'

import { notSapIconNames } from './src/icons/icon-map'
import { notSapUiVunorShortcuts } from './src/vunor'
import { notSapIconsPreset } from './src/icons'

console.log('---- UNOCSS CONFIG ----')

export default defineConfig({
  presets: [
    presetVunor() as Preset,
    notSapIconsPreset(),
  ],
  shortcuts: [vunorShortcuts(notSapUiVunorShortcuts)],
  safelist: [
    ...notSapIconNames.map(name => `i--${name}`),
    'scope-neutral',
    'i8',
    'i8-filled',
    'layer-0',
    'layer-1',
  ],
  preflights: [
    {
      getCSS() {
        return `.i8 input { border: none } .i8 { border-style: solid }`
      },
    },
  ],
  content: {
    filesystem: [
      'src/**/*.{vue,js,ts,jsx,tsx}'
    ],
  }
})

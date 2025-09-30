import { defineConfig, type Preset } from 'unocss'
import { presetVunor, vunorShortcuts } from 'vunor/theme'

import { notSapIconNames } from './src/icons/icon-map'
import { notSapUiVunorShortcuts } from './src/vunor'
import { notSapIconsPreset } from './src/icons'

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
        return `.i8 input { border: none } .i8, .not-sap-token { border-style: solid }` +
`:root {
  --scope-color: 66 143 185;
  --scope-color-50: 242 246 247;
  --scope-color-100: 211 224 231;
  --scope-color-200: 177 204 217;
  --scope-color-300: 141 184 206;
  --scope-color-400: 104 164 196;
  --scope-color-500: 66 143 185;
  --scope-color-600: 62 121 155;
  --scope-color-700: 57 99 125;
  --scope-color-800: 51 78 96;
  --scope-color-900: 44 58 68;
  --scope-light-0: 255 255 255;
  --scope-light-1: 248 248 248;
  --scope-light-2: 240 242 243;
  --scope-light-3: 234 235 236;
  --scope-light-4: 228 228 228;
  --scope-dark-0: 31 31 31;
  --scope-dark-1: 34 37 38;
  --scope-dark-2: 37 42 45;
  --scope-dark-3: 43 46 48;
  --scope-dark-4: 51 51 51;
  --current-hl: 66 143 185;

  --current-bg: var(--scope-light-0);
  --current-text: var(--scope-dark-2);
  --current-icon: var(--scope-dark-2);
  --current-border: 131 134 144;
  --un-bg-opacity: 1;
  --un-text-opacity: 1;
}

html.dark {
  --current-bg: var(--scope-dark-0);
  --current-text: var(--scope-light-2);
  --current-icon: var(--scope-light-2);
}
`        
      },
    },
  ],
  content: {
    filesystem: [
      'src/**/*.{vue,js,ts,jsx,tsx}'
    ],
  }
})

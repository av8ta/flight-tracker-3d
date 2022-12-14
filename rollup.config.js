import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import css from 'rollup-plugin-css-only'
import injectProcessEnv from 'rollup-plugin-inject-process-env'
import copy from 'rollup-plugin-copy'
import { terser } from 'rollup-plugin-terser'

export default [
  {
    input: 'ui/index.tsx',
    output: [
      {
        file: 'public/bundle.js',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      resolve(),
      commonjs(),
      injectProcessEnv({ NODE_ENV: 'production' }),
      typescript({ tsconfig: './ui/tsconfig.json' }),
      css(),
      terser(),
      copy({
        targets: [
          { src: 'ui/index.html', dest: 'public' },
          { src: 'ui/**/*.css', dest: 'public' },
          { src: 'ui/assets/images/**/*', dest: 'public/images' }
        ]
      })
    ]
  }
]
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import css from 'rollup-plugin-import-css'
import injectProcessEnv from 'rollup-plugin-inject-process-env'
import copy from 'rollup-plugin-copy'
import { terser } from 'rollup-plugin-terser'
import image from '@rollup/plugin-image'
import Dotenv from 'rollup-plugin-dotenv'
const dotenv = Dotenv.default

export default [
  {
    input: 'ui/index.ts',
    output: [
      {
        file: 'public/bundle.js',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      dotenv(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: './ui/tsconfig.json' }),
      image(),
      css(),
      terser(),
      copy({
        targets: [
          { src: 'ui/index.html', dest: 'public' },
          { src: 'ui/assets/images/**/*', dest: 'public/images' },
          { src: 'ui/assets/Cesium/**/*', dest: 'public/cesium' }
        ]
      }),
      injectProcessEnv({ NODE_ENV: 'production', cesium_token: process.env.cesium_token })
    ]
  }
]
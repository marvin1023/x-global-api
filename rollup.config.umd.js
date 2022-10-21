import { defineConfig } from 'rollup';
import { babel } from '@rollup/plugin-babel';
import esbuild from 'rollup-plugin-esbuild';
import postcss from 'rollup-plugin-postcss';

export default defineConfig({
  input: './src/index.ts',
  output: [
    {
      file: './dist/index.js',
      format: 'umd',
      name: 'globalApi',
    },
  ],
  plugins: [
    esbuild({
      target: 'es2015',
      minify: true,
    }),
    babel({
      presets: ['@babel/preset-env'],
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
    }),
    postcss({
      plugins: [],
    }),
  ],
});

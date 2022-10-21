import { defineConfig } from 'rollup';
import esbuild from 'rollup-plugin-esbuild';
import postcss from 'rollup-plugin-postcss';

// import path from 'path';
// import pkg from './package.json';
// import license from 'rollup-plugin-license';
// import { terser } from 'rollup-plugin-terser';
// import dts from 'rollup-plugin-dts';

export default defineConfig({
  input: './src/index.ts',
  output: [
    {
      dir: './dist/esm',
      format: 'es',
      preserveModules: true, // 保留模块结构
      preserveModulesRoot: 'src', // 将保留的模块放在根级别的此路径下
    },
  ],
  plugins: [
    esbuild({
      target: 'esnext',
    }),
    postcss({
      plugins: [],
    }),
  ],
});

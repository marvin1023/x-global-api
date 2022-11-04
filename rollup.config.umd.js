import { defineConfig } from 'rollup';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import license from 'rollup-plugin-license';
import { terser } from 'rollup-plugin-terser';

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
    postcss(),
    typescript({ tsconfigOverride: { compilerOptions: { declaration: false } } }),
    terser(),
    license({
      banner: {
        content: {
          file: './LICENSE',
          encoding: 'utf-8', // Default is utf-8
        },
      },
    }),
  ],
});

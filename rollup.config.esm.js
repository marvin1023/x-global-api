import { defineConfig } from 'rollup';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import license from 'rollup-plugin-license';

export default defineConfig({
  input: './src/index.ts',
  output: [
    {
      file: './dist/esm/index.js',
      format: 'es',
    },
  ],
  plugins: [
    postcss({
      extract: true,
    }),
    typescript(),
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

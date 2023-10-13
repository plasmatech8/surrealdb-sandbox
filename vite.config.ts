import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import topLevelAwait from 'vite-plugin-top-level-await';
import wasm from 'vite-plugin-wasm';

export default defineConfig({
	plugins: [sveltekit(), purgeCss(), wasm(), topLevelAwait()],
	optimizeDeps: {
		exclude: ['surrealdb.wasm']
	}
});

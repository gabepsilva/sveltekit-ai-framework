/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
	coverageAnalysis: 'perTest',
	mutate: ['src/lib/**/*.ts', '!src/**/*.{test,spec}.ts'],
	ignorePatterns: [
		'.security-cache/**',
		'.svelte-kit/**',
		'build/**',
		'coverage/**',
		'playwright-report/**',
		'reports/**',
		'test-results/**'
	],
	disableTypeChecks: 'src/lib/**/*.ts',
	testRunner: 'vitest',
	vitest: {
		configFile: 'vite.config.ts',
		related: true
	},
	reporters: ['clear-text', 'progress', 'html', 'json'],
	htmlReporter: { fileName: 'reports/mutation/mutation.html' },
	jsonReporter: { fileName: 'reports/mutation/mutation.json' },
	thresholds: {
		high: 90,
		low: 80,
		break: 80
	},
	concurrency: 2,
	cleanTempDir: 'always'
};

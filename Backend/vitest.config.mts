import {defineConfig} from 'vitest/config';

export default defineConfig({
    test: {
        poolOptions: {
            forks: {
                singleFork: true,
            },
        },
        coverage: {
            provider: 'istanbul' // or 'v8'
        },
    },
});
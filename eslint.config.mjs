import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import tslint from 'typescript-eslint';

export default tslint.config(
    {
        plugins: {
            '@stylistic': stylistic,
        },
    },
    eslint.configs.recommended,
    ...tslint.configs.recommendedTypeChecked,
    stylistic.configs.customize({
        indent: 4,
        quotes: 'single',
        semi: true,
        braceStyle: '1tbs',
        arrowParens: true,
        quoteProps: 'consistent-as-needed',
        commaDangle: 'only-multiline',
    }),
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        files: ['./test/**'],
        rules: {
            '@typescript-eslint/no-unsafe-assignment': ['off'],
        },
    },
);
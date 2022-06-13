module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'plugin:react/recommended',
        'airbnb',
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
            modules: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: [
        'react',
    ],
    rules: {
        indent: ['error', 4, { SwitchCase: 1 }],
        'max-len': ['error', { code: 150 }],
        'no-plusplus': ['off'],
        'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx'] }],
        'object-curly-newline': ['warn', { ImportDeclaration: { multiline: true } }],
        'no-param-reassign': ['off', { props: false }],
        'react/jsx-indent': ['off'],
        'react/prop-types': ['off'],
        'react/jsx-indent-props': ['off'],
        'import/no-cycle': ['off', { ignoreExternal: true, maxDepth: 1 }],
        'import/no-useless-path-segments': ['off', { noUselessIndex: true }],
    },
};

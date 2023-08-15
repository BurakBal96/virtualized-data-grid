const { override, addWebpackModuleRule, useBabelRc } = require('customize-cra');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');

module.exports = override(
    addWebpackModuleRule({
        test: /\.module\.s[ac]ss$/i,
        use: [
            // Creates `style` nodes from JS strings
            'style-loader',
            // Translates CSS into CommonJS,
            {
                loader: 'css-loader',
                options: {
                    importLoaders: 2,
                    sourceMap: false,
                    modules: {
                        mode: 'local',
                        auto: true,
                        exportGlobals: true,
                        localIdentName: '[name]__[local]--[hash:base64:5]',
                        localIdentHashSalt: 'my-custom-hash',
                        // namedExport: true,
                        exportLocalsConvention: 'camelCase',
                        getLocalIdent: getCSSModuleLocalIdent
                    }
                }
            },
            {
                loader: 'sass-loader',
                options: {
                    implementation: require.resolve('sass')
                }
            }
        ]
    }),
    useBabelRc(),
);

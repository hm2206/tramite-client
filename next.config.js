
const env = require('./env.json')

module.exports = {
    basePath: env.app.base_path,
    assetPrefix: env.app.asset_prefix,
    distDir: 'build',
    publicRuntimeConfig: {
        staticFolder: env.app.asset_prefix
    }
}
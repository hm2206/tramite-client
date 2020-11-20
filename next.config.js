
const env = require('./env.json')

module.exports = {
    basePath: env.app.base_path,
    assetPrefix: env.app.domain,
    distDir: 'build',
    publicRuntimeConfig: {
        staticFolder: env.app.domain
    }
}
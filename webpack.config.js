function buildConfig(env) {
    return require('./webpack-component/component.' + env + '.js')(env)
}

module.exports = buildConfig;
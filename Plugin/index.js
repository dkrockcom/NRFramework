exports.PluginInitialize = (app, server) => {
    require('./Socket').Initialize(app, server);
};
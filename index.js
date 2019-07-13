const appConfig = require('./AppConfig');
const Framework = require('./Framework');

Framework.Initialize(appConfig, (info) => {
  console.log(info);
});
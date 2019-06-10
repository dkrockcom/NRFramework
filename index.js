const express = require('express');
const app = express();

const { DB_SERVER_TYPE } = require('./Framework/DFEnum');
global.Framework = require('./Framework');
const User = require('./Controller/User');

let options = {
  appName: '',
  app: app,
  port: 5000,
  staticPath: `${__dirname}/public`,
  cors: true,
  dbType: DB_SERVER_TYPE.MYSQL,
  dbConfig: {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'test'
  },
  exception: (error) => {
    console.log(error);
  },
  controllers: { User },
  multerOptions: null
}

Framework.Initialize(options, (info) => {
  console.log(info);
});
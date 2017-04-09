require('dotenv').config();

const Server = require('./core/server/Server');

const Repository = require('./core/repository/Repository');
const app = new Server(new Repository());

app.start();

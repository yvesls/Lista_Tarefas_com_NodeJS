const express = require("express");
const routes = require("./routes");
const path = require('path');
const app = express();
require("dotenv").config();
app.use(express.json()); // utilizando o padrão de comunicação 
app.use(routes);
app.use(express.static(path.join(__dirname, 'public')));
  
module.exports = app; 
  
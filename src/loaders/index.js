const startDB = require("./mongodb"); // estratégia para não sujar muito o arquivo app.js 

class Loaders {
    start() {
        startDB();
    }
} 

module.exports = new Loaders();
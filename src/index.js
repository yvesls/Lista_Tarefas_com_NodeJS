const app = require("./app");
const port = process.env.PORT;
const loaders = require("./loaders")

loaders.start();

app.listen(port, ()=> {
    console.log(`servidor sendo executado na porta ${port}`);
})
 
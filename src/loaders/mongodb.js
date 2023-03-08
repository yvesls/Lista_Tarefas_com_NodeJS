const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.URL_MONGODB;
const startDB = async () => {
    await mongoose.connect(url)
        .then(()=>console.log('connected'))
        .catch(e=>console.log(e));
}

module.exports = startDB;

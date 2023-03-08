const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ProductSchema = new Schema({
  id: ObjectId,
  titulo: String,
  concluida: Boolean,
  previsao: String,
  data: Date
});
  
const ProductModel = mongoose.model("tasks", ProductSchema);

module.exports = ProductModel;
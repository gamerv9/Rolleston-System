const mongoose = require("mongoose")
var colors = require('colors')

const connectDatabase = () => {
  mongoose
    .connect(process.env.mongo)
    .then((con) => {
      console.log((`[✔] Database connected : ${con.connection.host}`).yellow);
    })
};
module.exports = connectDatabase
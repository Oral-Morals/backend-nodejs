const mongoose = require('mongoose');
const connectionString = process.env.DATABASE_URL;
module.exports = function () {
  mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
    .then(() => {
      console.log('Mongo Connection Open!');
    })
    .catch((err) => {
      console.log('Mongo Connection Error!', err);
    });
};

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// set up express
const app = express();
app.use(express.json());
app.use(cors());

// start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`The server is listing on port: ${PORT}`);
});

//setup Mongoose
const dbUrl =
  'mongodb+srv://ptadmin:ptadmin123@cluster0.bkxls.mongodb.net/<dbname>?retryWrites=true&w=majority';
mongoose
  .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(console.log('mongodb connected'));

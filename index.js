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
mongoose.connect(
  process.env.DB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log('mongodb connected');
  }
);

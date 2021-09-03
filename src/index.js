require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
//==================================================
// MIDDLEWARE
//==================================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//==================================================
// EJS
//==================================================

//==================================================
// DATABASE
//==================================================
const dbSetup = require("./database/setup");
dbSetup();
//==================================================
// PASSPORT MIDDLEWARE
//==================================================

//==================================================
// ROUTES
//==================================================

//==================================================
// SEEDERS
//==================================================
const { seedCountries } = require('./seeders/countrySeeder');

// seedCountries();
//==================================================
// SERVER
//==================================================
app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
})

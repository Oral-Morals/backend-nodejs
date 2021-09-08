require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const registrationRoutes = require('./routes/registrationRoutes.js')
//==================================================
// MIDDLEWARE
//==================================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//==================================================
// DATABASE
//==================================================
const dbSetup = require("./database/setup");
dbSetup();

//==================================================
// ROUTES
//==================================================
app.use(registrationRoutes);

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

require("dotenv").config();
const express = require("express");
const app = express();

//==================================================
// DATABASE
//==================================================
const dbSetup = require("./database/setup");
dbSetup();

//==================================================
// MIDDLEWARE
//==================================================
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//==================================================
// ROUTES
//==================================================
const authRoutes = require("./routes/authRoutes");
app.use("/api/v1", authRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/v1", userRoutes);

const postRoutes = require("./routes/postRoutes");
app.use("/api/v1", postRoutes);

const mobileTestRoutes = require("./routes/mobileTestRoutes");
app.use("/api/v1", mobileTestRoutes);

//==================================================
// SEEDERS
//==================================================
const { seedCountries } = require("./seeders/countrySeeder");

// seedCountries();
//==================================================
// SERVER
//==================================================
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});

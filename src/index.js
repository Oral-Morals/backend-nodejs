require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const authRoutes = require("./routes/authRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
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
app.use("/api/v1/auth", authRoutes);

// TODO: Add login authorization middleware to /api/v1/media-upload
app.use("/api/v1/media-upload", mediaRoutes);

//==================================================
// SEEDERS
//==================================================
const { seedCountries } = require("./seeders/countrySeeder");

// seedCountries();
//==================================================
// SERVER
//==================================================
app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});

const multer = require("multer");
const path = require("path");

// Multer Storage Engine configs
// Enable disk storage so files can be saved to this project.
const diskStorage = multer.diskStorage({
  destination: "./src/uploads/",

  filename: function (req, file, cb) {
    console.log("src/utils/multer-config---logging: file:");
    console.log(file);

    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, file.originalname);
    // cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// The memory storage engine stores the files in memory as Buffer objects. It doesn't have any options.
// WARNING: Uploading very large files, or relatively small files in large numbers very quickly,
// can cause your application to run out of memory when memory storage is used.
const memoryStorage = multer.memoryStorage();

// Pass the storage engine as an object.
// Export multer to be used as middleware from this file.
module.exports = multer({ storage: diskStorage });

// TODO
// Max size of each file type?

const multer = require("../utils/multer-config");
const cloudinary = require("../utils/cloudinary-config");

// Export multer and cloudinary already configured.
exports.multer = multer;
exports.cloudinary = cloudinary;

// exports.upload = async (req, res, next) => {
//   console.log("inside upload function");
//   multer.single("image");
//   console.log("after multer function");
//   next();
// };

exports.upload = multer.single("image");
// exports.upload = multer.single("video");

// exports.uploadToCloudinary = cloudinary.uploader.upload(req.file.originalname, function (error, result) {
//   console.log(result);
// });

exports.uploadToCloudinary = async (req, res, next) => {
  console.log("req.file");
  console.log(req.file);
  // cloudinary.uploader
  //   .upload("./src/uploads/test-video.mp4", {
  //     resource_type: "video",
  //     // The path below is folder/image
  //     public_id: "test/test-video",
  //     overwrite: true,
  //   })
  //   .then((result) => {
  //     console.log("success", JSON.stringify(result, null, 2));
  //   })
  //   .catch((error) => {
  //     console.log("error", JSON.stringify(error, null, 2));
  //   });

  cloudinary.uploader
    .upload("./src/uploads/om.PNG", {
      resource_type: "image",
      // The path below is folder/image
      public_id: "test/test",
      overwrite: true,
    })
    .then((result) => {
      console.log("success", JSON.stringify(result, null, 2));
    })
    .catch((error) => {
      console.log("error", JSON.stringify(error, null, 2));
    });
  next();
};

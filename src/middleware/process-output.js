const cloudinary = require("../utils/cloudinary-config");

// Exports the cloudinary object.
exports.cloudinary = cloudinary;

// Uploads the user's profile picture to cloudinary.
exports.profilePicToCloudinary = async (req, res, next) => {
  console.log("req.file");
  console.log(req.file);
  console.log(req.user);

  await cloudinary.uploader
    .upload(`./src/uploads/${req.file.originalname}`, {
      resource_type: "image",
      // The path below is folder/image
      public_id: `users/${req.user.id}/${req.user.username}/profile-pic/${req.file.fieldname}`,
      overwrite: true,
    })
    .then((result) => {
      req.cloudinary = result;
    })
    .catch((error) => {
      console.log("error", JSON.stringify(error, null, 2));
    });
  next();
};

// Uploads the user's video to cloudinary.
exports.videoToCloudinary = async (req, res, next) => {
  console.log("req.file");
  console.log(req.file);
  cloudinary.uploader
    .upload("./src/uploads/test-video.mp4", {
      resource_type: "video",
      // The path below is folder/image
      public_id: "test/test-video",
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

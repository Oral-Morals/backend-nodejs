const cloudinary = require("../utils/cloudinary-config");
const moment = require("moment");

moment().format();

// Exports the cloudinary object.
exports.cloudinary = cloudinary;

// Get appropriate resource type by looking at the MIME type on the req.file.mimetype property set by Multer.
const resourceType = (mimeType) => {
  // Cloudinary supports many different file formats, which it categorizes into three different asset types:
  // image, video (also includes audio files) and raw.
  if (mimeType.includes("audio")) return "video";
  if (mimeType.includes("image")) return "image";
  if (mimeType.includes("video")) return "video";
};

const buildPublicID = (req) => {
  // Initialize variables to be used in returned string.
  let contentFolder;

  let fileName;

  // For profile pictures, set the folder name to "profile-pic".
  if (req.path === "/profile-pic") contentFolder = "/profile-pic";

  // For posts, set the folder name to "post" with the time of upload.
  if (req.path === "/post/audio" || req.path === "/post/video") contentFolder = `posts/post-${moment().format()}`;

  // For single media uploads set the file name to the field name.
  if (req.file) fileName = req.file.fieldname;

  // The path below is users/${database ID}/${username}/${content folder: post or profile pic}}/${the form field name}.
  return `users/${req.user.id}/${req.user.username}/${contentFolder}/${fileName}`;
};

// Uploads the user's media to cloudinary.
exports.uploadToCloudinary = async (req, res, next) => {
  try {
    const upload = await cloudinary.uploader.upload(`${req.file.destination}${req.file.originalname}`, {
      resource_type: resourceType(req.file.mimetype),

      public_id: buildPublicID(req),

      // Overwrite a file with the same name.
      overwrite: true,
      // tags: ["example", "example-2"],
    });

    req.cloudinary = upload;
  } catch (error) {
    console.log(error);
  }

  next();
};

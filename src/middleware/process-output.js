const cloudinary = require("../utils/cloudinary-config");
const moment = require("moment");

moment().format();

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
  if (req.path === "/users/profile") contentFolder = "/profile-pic";

  // For posts, set the folder name to "post" with the time of upload.
  if (req.path === "/post/new-post") contentFolder = `posts/post-${moment().format()}`;

  // Set the file name to the field name.
  if (req.file) fileName = req.file.fieldname;

  // The path below is users/${username}-${database ID}/${content folder: post or profile pic}}/${the form field name}.
  return `users/${req.user.username}-${req.user.id}/${contentFolder}/${fileName}`;
};

// Uploads the user's media to cloudinary.
exports.uploadToCloudinary = async (req, res, next) => {
  try {
    // Skip uploading to Cloudinary if there is no file uploaded in the profilePic field.
    if (req.path === "/users/profile" && !req.file) {
      return next();
    }
    // upload takes the location of the file as the first argument.
    const upload = await cloudinary.uploader.upload(`${req.file.destination}${req.file.originalname}`, {
      // The resource type should be image, video or raw depending on the file.
      resource_type: resourceType(req.file.mimetype),

      // The identifier that is used for accessing the uploaded asset.
      // The Public ID may contain a full path including folders separated by a slash (/).
      public_id: buildPublicID(req),

      // Overwrite a file with the same name.
      overwrite: true,

      // TODO: Do we need to use tags?
      // Tags for cloudinary uploads.
      // tags: ["example", "example-2"],
    });

    req.cloudinary = upload;

    // TODO: DRY
    // Checks for an image, if true this is an audio post and an image is required with audio.
    if (req.file.image) {
      const upload = await cloudinary.uploader.upload(`${req.file.image.destination}${req.file.image.originalname}`, {
        resource_type: resourceType(req.file.image.mimetype),

        // Use the uploaded audio public ID so both the audio and image files are in the same folder.
        public_id: req.cloudinary.public_id,

        overwrite: true,
      });

      req.cloudinary.image = upload;
    }
  } catch (error) {
    console.log(error);
  }

  next();
};

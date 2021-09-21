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
  if (req.path === "/new-post") contentFolder = `posts/post-${moment().format()}`;

  // Set the file name to the field name.
  if (req.file) fileName = req.file.fieldname;

  // The path below is users/${database ID}/${username}/${content folder: post or profile pic}}/${the form field name}.
  return `users/${req.user.id}/${req.user.username}/${contentFolder}/${fileName}`;
};

// Uploads the user's media to cloudinary.
exports.uploadToCloudinary = async (req, res, next) => {
  try {
    // upload takes the location of the file as the first argument.
    const upload = await cloudinary.uploader.upload(`${req.file.destination}${req.file.originalname}`, {
      // The resource type should be image, video or raw depending on the file.
      resource_type: resourceType(req.file.mimetype),

      // The identifier that is used for accessing the uploaded asset.
      // The Public ID may contain a full path including folders separated by a slash (/).
      public_id: buildPublicID(req),

      // Overwrite a file with the same name.
      overwrite: true,
      // tags: ["example", "example-2"],
    });

    req.cloudinary = upload;
  } catch (error) {
    console.log(error);
  }
  // Example response from cloudinary
  // req.cloudinary = {
  //   asset_id: "6459355dfc2491bedc2530a077daa885",
  //   public_id: "users/6144157ecadd333dc445cf91/test/profile-pic/profilePic",
  //   version: 1632031723,
  //   version_id: "480d6ea5e3f7a0b82e84cccbdfc81017",
  //   signature: "ca86d2410ac588be3dc9831e6e1355c8b8ab6466",
  //   width: 547,
  //   height: 92,
  //   format: "png",
  //   resource_type: "image",
  //   created_at: "2021-09-19T06:08:43Z",
  //   tags: [],
  //   bytes: 6021,
  //   type: "upload",
  //   etag: "cb23a646794188901fa775b9a5234d83",
  //   placeholder: false,
  //   url: "http://res.cloudinary.com/nathanjm/image/upload/v1632031723/users/6144157ecadd333dc445cf91/test/profile-pic/profilePic.png",
  //   secure_url:
  //     "https://res.cloudinary.com/nathanjm/image/upload/v1632031723/users/6144157ecadd333dc445cf91/test/profile-pic/profilePic.png",
  //   overwritten: true,
  //   original_filename: "om",
  //   original_extension: "PNG",
  //   api_key: "411721246542147",
  // };
  next();
};

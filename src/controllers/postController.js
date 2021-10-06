const Post = require("../models/postModel");

// Get the URL from Cloudinary and save to database
exports.createPost = async (req, res) => {
  try {
    let videoThumbnail = null;

    // If the type of post is video, set the video thumbnail by
    // changing the extension to an image format. Cloudinary will
    // deliver an image.
    if (req.file.fieldname === "video") {
      // Splits a string into an array of substrings.
      let urlToArray = req.cloudinary.secure_url.split(".");

      // Replace the video extension with jpg.
      urlToArray[3] = "jpg";

      // Convert the array to a string then replace all commas with a period.
      videoThumbnail = urlToArray.toString().replace(/,/g, ".");
    }

    // Create new post from upload form.
    const newPost = await Post.create({
      userId: req.user.id,
      caption: req.body.caption,
      mediaType: req.file.fieldname,
      mediaLinks: {
        audioVideo: req.cloudinary.secure_url,
        image: videoThumbnail || req.cloudinary.image.secure_url,
        cloudinaryPublicID: req.cloudinary.public_id,
      },
    });

    return res.status(200).json({ status: "success", message: `New ${newPost.mediaType} post created.` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// Get a single post
exports.fetchSinglePost = async (req, res) => {
  try {
    let query = await Post.findById(req.params.id);

    if (!query) return res.status(404).json({ status: "fail", message: `Post not found.` });

    return res.status(200).json({ data: query });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "fail", message: error.message });
  }
};

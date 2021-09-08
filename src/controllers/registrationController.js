exports.registration = async (req, res) => {
  try {
    res.status(200).send('Please register')
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
};

const multer = require('multer');

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './localData/');
  },
  filename: (req, file, cb) => {
    cb(null, req.body.id + '_' + file.originalname);
  }
});

// Create the multer instance
const upload = multer({ storage: storage });

module.exports = upload;


const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './localData/');
  },
  filename: (req, file, cb) => {
    cb(null, req.body.id + '_' + file.originalname);
  }
});

const upload = multer({ storage: storage });

module.exports = upload;


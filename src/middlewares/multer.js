import multer from 'multer';
import { TEMP_UPLOAD_DIR } from '../сontact/index.js';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, TEMP_UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueValue = Date.now();
    cb(null, `${uniqueValue}_${file.originalname}`);
  },
});

export const upload = multer({ storage });

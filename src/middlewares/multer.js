import multer from 'multer';
import { TEMP_UPLOAD_DIR } from '../сontact/index.js';
import path from 'path';
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(TEMP_UPLOAD_DIR));
  },
  filename: function (req, file, cb) {
    const uniqueValue = Date.now();
    cb(null, `${uniqueValue}_${path.extname(file.originalname)}`);
  },
});

export const upload = multer({ storage });

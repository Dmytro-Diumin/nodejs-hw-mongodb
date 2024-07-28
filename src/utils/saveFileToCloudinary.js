import cloudinary from 'cloudinary';
import { env } from './env.js';
import { CLOUDINARY } from '../сontact/index.js';

cloudinary.v2.config({
  secure: true,
  cloud_name: env(CLOUDINARY.CLOUD_NAME),
  api_key: env(CLOUDINARY.API_KEY),
  api_secret: env(CLOUDINARY.API_SECRET),
});

export const saveFileToCloudinary = async (file) => {
  try {
    const result = await cloudinary.v2.uploader.upload(file.path);
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload photo to Cloudinary');
  }
};

const express = require('express');
const app = express();
const router = express.Router();
const UserController = require('../controllers/usersController');
const MessagesController = require ('../controllers/messagesController');
const GroupController = require('../controllers/groupController');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'bancoImagens', // A pasta onde os arquivos serão armazenados no Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'], // Formatos permitidos
  },
});

const upload = multer({ storage: storage });


module.exports = {
  express,
  router,
  UserController,
  app,
  MessagesController,
  GroupController,
  upload,
  multer
};

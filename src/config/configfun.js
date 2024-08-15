const express = require('express');
const app = express();
const router = express.Router();
const UserController = require('../controllers/usersController');
const MessagesController = require ('../controllers/messagesController');
const GroupController = require('../controllers/groupController');
const multer  = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'bancoImagens');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
})
const upload = multer({storage: storage})


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

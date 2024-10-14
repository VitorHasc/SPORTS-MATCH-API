const { router, UserController, upload } = require('../config/configfun');
const multer = require('multer');

function normalizeFilePath(req, res, next) {
  if (req.file && req.file.path) {
    req.file.path = req.file.path.replace(/\\/g, '/');
  }
  next();
} //aqui foi criada essa função para garantir que as barras não estejam invertidas

router.post('/login', UserController.login);
router.post('/registro', upload.single('file'), UserController.registro);
router.get('/user', UserController.puxarUsuarioalvo);
router.post('/registroMR', UserController.registroMR);
router.post('/perfil', UserController.perfil);
router.post('/searchUsers', UserController.encontrarUsuarios);

module.exports = router;

const {app, multer, upload} = require('./config/configfun');
const express = require('express'); 
const {SECRET, jwt, port} = require('./config/configvar');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const routesUsers = require('./routes/usersRoutes');
const routesMessages = require('./routes/messagesRoutes');
const routesGrupos = require('./routes/groupsRoutes')

//CORS para o funcionamento do server em ambiente web
const corsOptions = {
  origin: 'http://localhost:8081', 
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

//Autenticando o token
app.use((req, res, next) => {
  try{
  const rotasLivres = ['/users/login', '/users/registro', '/users/user', '/users/registroMR', '/imagem/imagem', '/users/esportes'];
  if (rotasLivres.includes(req.path)) { //req.path pega o caminho que o front end mandou. Cai aqui caso tenha sido uma das rotas livres
    return next();
  }
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ auth: false, message: 'Nenhum token fornecido.' });
  }
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    console.log(token)
    if (err) {
      return res.status(500).json({ auth: false, message: 'Falha ao autenticar o token.' });
    }
    if('/e'==(req.path)){  //Aqui é o seguinte, caso a rota seja /e significa que o front esta tentando logar com token, então, pode liberar direto sem cair no resto das coisas
      return res.status(200).json({auth: true, message: 'Deu certo mermão'})
    }
    req.ID = decoded.ID;
    next();
  });
  }
  catch(error){
    console.log(error);
    res.send(error);
  }
});

app.get('/imagem/imagem', (req, res) => {
  const {perfilFoto} = req.query;
  console.log(perfilFoto);
  const imagem = path.join(__dirname, '..', perfilFoto);
  console.log(imagem);
  res.sendFile(imagem);
});



//Chamando as rotas
app.use('/users', routesUsers);
app.use('/messages', routesMessages);
app.use('/groups', routesGrupos);

//Ligando o servidor
app.listen(port, '0.0.0.0', () => {
  console.log("Servidor iniciado" + port);
})  

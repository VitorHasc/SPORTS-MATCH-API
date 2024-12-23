const {jwt} = require('../config/configvar');
const { PrismaClient } = require('@prisma/client');
const { findUserById, createUser, loginUser } = require('../models/modelUsers.js');
const { searchUsers } = require('../models/modelUsers.js');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient()

//--------------------------------------------------------------------------------------------------------------------------------------------//
//----------------------------------------------------LOGAR USUARIO---------------------------------------------------------------------------//
//--------------------------------------------------------------------------------------------------------------------------------------------//

const registro = async (req, res) => {
  const { nome, senha, email, cidade, latitude, longitude, datanasc, genero, nick, biografia, esportes }= req.body; 
  const caminhoImagem = req.file.path;

  if (!nome || !senha || !email || !datanasc){
    return res.status(400).send('Informação Faltando');
  }

  try {
    const hashedSenha = await bcrypt.hash(senha, 10); 

    const user = await createUser({ nome, senha: hashedSenha, email, cidade, latitude, longitude, datanasc, caminhoImagem, genero, nick, biografia, esportes });

    const token = jwt.sign({ ID: user.idusuario }, process.env.SECRET, { expiresIn: '48h' });
    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

const registroMR = async (req, res) => {
  const {email} = req.body;
  console.log(email);
  const testeEmail = await loginUser({email});
  let validade = true;
  if(testeEmail){
    validade = false;
    res.json({validade})
  }
  else if(!testeEmail){
    res.json({validade});
  }
}

//------------------------------------------------------------------------------------------------------------------------------------------//

const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).send('Email/Senha Faltando');
  }

  try {
    const user = await loginUser({ email });

    if (!user) {
      return res.status(400).send('Usuário não encontrado');
    }

    // Comparar a senha fornecida com o hash no banco
    const senhaCorreta = await bcrypt.compare(senha, user.senha);

    if (senhaCorreta) {
      return puxarUsuarioatual(req, res, user.idusuario);
    } else {
      return res.status(400).send('Senha incorreta');
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

//--------------------------------------------------------------------------------------------------------------------------------------------//

const perfil = async (req, res) => {
  const idusuario = req.ID;
  return puxarUsuarioatual (req, res, idusuario);
}

//--------------------------------------------------------------------------------------------------------------------------------------------//

const puxarUsuarioatual = async (req, res, idusuario) => {
  console.log(idusuario);
  try {
    const user = await findUserById(idusuario);
    const token = jwt.sign({ ID: idusuario }, process.env.SECRET, { expiresIn: '300h' });
    return res.json({user, token});
  }
  catch(err){}
}

const puxarUsuarioalvo = async (req, res) => {
  const idusuarioString = await req.query.id
  const idusuario = parseInt(idusuarioString, 10);
  console.log(typeof idusuario)
  const user = await findUserById(idusuario);
  console.log(user);
  return res.json(user);
}

//--------------------------------------------------------------------------------------------------------------------------------------------//
//----------------------------------------------------SEARCH OUTROS USUARIOS------------------------------------------------------------------//
//--------------------------------------------------------------------------------------------------------------------------------------------//

const encontrarUsuarios = async (req, res) => {
  console.log("GRITOOO")
  let { idademin, idademax, genero, esporte, nome, pagina } = req.body;
  const idusuario = req.ID;
  console.log("pegando idades" + idademin + idademax)
  if(idademax && idademin){
    const today = new Date();
    const minDate = new Date(today);
    minDate.setFullYear(today.getFullYear() - idademax);
    const maxDate = new Date(today);
    maxDate.setFullYear(today.getFullYear() - idademin); 
    idademin = minDate.toISOString();
    idademax = maxDate.toISOString();
  }
  const lalo = await findUserById(idusuario);
  const latitude = lalo.latitude;
  const longitude = lalo.longitude;
  console.log("TODOS JUNTOS!" + longitude + latitude + idademin + idademax + genero + esporte + nome + pagina + idusuario)
  try{
    const users = await searchUsers({longitude, latitude, idademin, idademax, genero, esporte, nome, pagina, idusuario});
    console.log(users);
    return res.json(users);
  }
  catch(error){
    return res.send(error);
  }
}
 
const pegarEsportes = async (req, res) => {
  const resultado = await pegarEsportesBanco();
  return res.json (resultado);
}


module.exports = {
  login,
  registro,
  registroMR,
  perfil,
  encontrarUsuarios,
  puxarUsuarioalvo,
  pegarEsportes
};


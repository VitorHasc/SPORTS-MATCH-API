const {SECRET, jwt} = require('../config/configvar');
const { PrismaClient } = require('@prisma/client');
const { pegarConversasBanco, criarMensagens, pegarMensagensBanco } = require('../models/modelMessages');

const prisma = new PrismaClient()

const pegarConversas = async (req, res) => {
    const idusuario = req.ID;
    try {
      const resposta = await pegarConversasBanco(idusuario);
      res.json(resposta);
    } catch (error) {
        console.log(error);
    }
};

const enviarMensagem = async (req, res) => {
    const idusuario = req.ID;
    const {idalvo, texto} = req.body;
    console.log(texto);
    const resposta = await criarMensagens(idusuario, idalvo, texto);
    console.log(resposta)
    res.json(resposta);
}

const pegarMensagens = async (req, res) => {
    const idusuario = req.ID;
    const {idalvo} = req.body;
    const resposta = await pegarMensagensBanco(idusuario, idalvo);
    res.json({resposta, idusuario});
}

module.exports = {
    pegarConversas,
    enviarMensagem,
    pegarMensagens
  };
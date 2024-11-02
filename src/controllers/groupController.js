const {SECRET, jwt} = require('../config/configvar');
const { PrismaClient } = require('@prisma/client');
const { 
    procurarGrupos, 
    meusGruposm, 
    verMensagensm, 
    enviarMensagemm, 
    fazerPedidom, 
    confirmarPedidom, 
    criarGrupom ,
    buscarPedidom
} = require('../models/modelGroup');

const prisma = new PrismaClient();

// Buscar grupos que o usuário não participa
const encontrarGrupos = async (req, res) => {
    const idusuario = req.ID;
    const resposta = await procurarGrupos(idusuario);
    res.json({ resposta });
};

// Buscar grupos que o usuário participa
const meusGrupos = async (req, res) => {
    const idusuario = req.ID;
    const grupos = await meusGruposm(idusuario);
    res.json({ grupos });
};

// Ver mensagens de um grupo
const verMensagens = async (req, res) => {
    const idusuario = req.ID;
    const grupoId = req.query.grupoId;
    const mensagens = await verMensagensm(parseInt(grupoId));
    mensagens;
    res.json({ mensagens, idusuario });
};

// Enviar uma mensagem para um grupo
const enviarMensagemGrupo = async (req, res) => {
    console.log("AAAAAAAAAAA")
    const { grupoId, conteudo } = req.body;
    const usuarioId = req.ID;
    console.log(usuarioId)
    const novaMensagem = await enviarMensagemm(grupoId, usuarioId, conteudo);
    res.json({ novaMensagem });
};

// Enviar um pedido para entrar em um grupo
const fazerPedido = async (req, res) => {
    const { grupoId } = req.body;
    const usuarioId = req.ID;
    const pedido = await fazerPedidom(parseInt(usuarioId), parseInt(grupoId));
    res.json({ pedido });
};

// Confirmar pedido de entrada em um grupo
const confirmarPedido = async (req, res) => {
    const { pedidoId } = req.body;
    const usuarioId = req.ID;
    console.log(usuarioId);
    const pedido = await confirmarPedidom(pedidoId, usuarioId);
    res.json({ pedido });
};

// Criar um novo grupo
const criarGrupo = async (req, res) => {
    const { nome, descricao, fundo } = req.body;
    const usuarioId = req.ID;
    const novoGrupo = await criarGrupom(nome, descricao, usuarioId, fundo);
    res.json({ novoGrupo });
};

const buscarPedidos = async (req, res) => {
    const grupoId = req.query.grupoId;
    const pedidos = await buscarPedidom(parseInt(grupoId));
    res.json({ pedidos });
};


module.exports = {
    encontrarGrupos,
    meusGrupos,
    verMensagens,
    enviarMensagemGrupo,
    fazerPedido,
    confirmarPedido,
    criarGrupo,
    buscarPedidos 
};

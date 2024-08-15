const {SECRET, jwt} = require('../config/configvar');
const { PrismaClient } = require('@prisma/client');
const { procurarGrupos } = require('../models/modelGroup');

const encontrarGrupos = async (req, res) => {
    const idusuario = req.ID;
    const resposta = await procurarGrupos(idusuario);
    res.json({ resposta });
}

  
module.exports = {
    encontrarGrupos,
}
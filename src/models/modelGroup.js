const prisma = require('./conexaodb');

const procurarGrupos = async (usuarioId) => {
    const grupos = await prisma.grupo.findMany({
        where: {
            NOT: {
                usuarios: {
                    some: {
                        usuarioId: usuarioId
                    }
                }
            }
        }
    });
    return grupos;
}
  
  
module.exports = { 
  procurarGrupos
};
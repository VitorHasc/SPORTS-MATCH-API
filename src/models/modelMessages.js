const prisma = require('./conexaodb');

const pegarConversasBanco = async (idusuario) => {
    const remetentes = await prisma.mensagemInd.findMany({
        where: {
            destinatarioId: idusuario,
        },
        select: {
            remetente: {
                select: {
                    idusuario: true,
                    nome: true,
                    perfilFoto: true,  
                },
            },
            horario: true,
            texto: true, 
        },
    });

    const destinatarios = await prisma.mensagemInd.findMany({
        where: {
            remetenteId: idusuario,
        },
        select: {
            destinatario: {
                select: {
                    idusuario: true,
                    nome: true,
                    perfilFoto: true,  
                },
            },
            horario: true,
            texto: true, 
        },
    });
    console.log(remetentes);
    console.log(destinatarios)

    // Extrair os usuários e as datas das mensagens
    const usuariosRemetentes = remetentes.map(r => ({
        idusuario: r.remetente.idusuario,
        nome: r.remetente.nome,
        perfilFoto: r.remetente.perfilFoto,  // Incluído o perfilFoto
        ultimaMensagem: r.texto,  
        horario: r.horario,  
    }));

    const usuariosDestinatarios = destinatarios.map(d => ({
        idusuario: d.destinatario.idusuario,
        nome: d.destinatario.nome,
        perfilFoto: d.destinatario.perfilFoto,  // Incluído o perfilFoto
        ultimaMensagem: d.texto,  
        horario: d.horario,  
    }));

    // A PARTE ABAIXO É APENAS PARA ELIMINAR CASO UM DOS NOMES APAREÇA REPETIDO, POR EXEMPLO, CASO EXISTA UMA MARIA COMO REMETENTE E UMA COMO DESTINATARIA
    const todosUsuarios = [...usuariosRemetentes, ...usuariosDestinatarios];
    const usuariosUnicos = todosUsuarios.reduce((acc, usuario) => {
        const existente = acc.find(u => u.idusuario === usuario.idusuario);
        if (existente) {
            if (usuario.horario > existente.horario) {
                existente.ultimaMensagem = usuario.ultimaMensagem; 
                existente.horario = usuario.horario;  
                existente.perfilFoto = usuario.perfilFoto; 
            }
        } else {
            acc.push(usuario);
        }
        return acc;
    }, []);

    return usuariosUnicos;
};





const criarMensagens = async (idusuario, idalvo, texto) => {
    const horarioAtual = new Date().toISOString();
    const novaMensagem = await prisma.mensagemInd.create({
      data: {
        remetenteId: idusuario,
        destinatarioId: idalvo,
        texto: texto,
        horario: horarioAtual,
      },
    });
    return novaMensagem;
  };
  
  const pegarMensagensBanco = async (idusuario, idoutro) => {
    const mensagens = await prisma.mensagemInd.findMany({
        where: {
            OR: [
                {
                    destinatarioId: idusuario,
                    remetenteId: idoutro,
                },
                {
                    destinatarioId: idoutro,
                    remetenteId: idusuario,
                }
            ]
        },
        orderBy: {
            horario: 'asc'
        }
    });

    return mensagens;
}

  
  
  module.exports = { 
    pegarConversasBanco,
    criarMensagens,
    pegarMensagensBanco
  };
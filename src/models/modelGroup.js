const prisma = require('./conexaodb');

// Procurar grupos que o usuário não participa
const procurarGrupos = async (usuarioId) => {
    const grupos = await prisma.grupo.findMany({
        where: {
            usuarios: {
                none: {
                    usuarioId: usuarioId
                }
            }
        },
        include: {
            usuarios: true
        }
    });
    return grupos;
};

// Buscar grupos que o usuário participa
const meusGruposm = async (usuarioId) => {
    const grupos = await prisma.grupo.findMany({
        where: {
            usuarios: {
                some: {
                    usuarioId: usuarioId,
                    pedido: true // Adiciona a condição para filtrar onde pedido é true
                }
            }
        },
        include: {
            usuarios: {
                include: {
                    usuario: true // Inclui informações do usuário
                }
            }
        }
    });

    // Adiciona uma propriedade 'isAdmin' para cada grupo retornado, mas apenas para o usuário específico
    const gruposComAdm = grupos.map(grupo => {
        // Encontrar a relação do usuário atual para verificar se ele é admin
        const grupoUsuario = grupo.usuarios.find(u => u.usuarioId === usuarioId); // Encontra o registro específico do usuário

        return {
            ...grupo,
            isAdmin: grupoUsuario ? grupoUsuario.adm : false // Se houver registro, pega o valor de 'adm'; caso contrário, é false
        };
    });

    // Limpar a lista de usuarios, mantendo apenas a informação do usuario que chamou
    const gruposFinalizados = gruposComAdm.map(grupo => ({
        ...grupo,
        usuarios: grupo.usuarios.filter(u => u.usuarioId === usuarioId) // Mantém apenas o usuário que chamou a rota
    }));

    return gruposFinalizados;
};

// Ver mensagens de um grupo
const verMensagensm = async (grupoId) => {
    const mensagens = await prisma.mensagemGrupo.findMany({
        where: {
            grupoId: grupoId
        },
        include: {
            remetente: {
                select: {
                    idusuario: true,
                    nome: true,
                    perfilFoto: true,  // Pega a foto de perfil do usuário
                }
            }
        }
    });
    return mensagens;
};


// Enviar uma mensagem para um grupo
const enviarMensagemm = async (grupoId, usuarioId, conteudo) => {
    const novaMensagem = await prisma.mensagemGrupo.create({
        data: {
            grupoId: grupoId,
            remetenteId: usuarioId,
            conteudo: conteudo
        }
    });
    return novaMensagem;
};

// Enviar pedido para entrar em um grupo
const fazerPedidom = async (usuarioId, grupoId) => { 
    console.log("GRITEEEE" + grupoId)
    const pedidoExistente = await prisma.grupo_Usuario.findFirst({
        where: {
            usuarioId: usuarioId,
            grupoId: grupoId,
            pedido: false  // Considerando que "pedido: false" indica um pedido pendente
        }
    });

    // Se já existir um pedido, lança um erro ou retorna uma mensagem de erro
    if (pedidoExistente) {
        throw new Error("Já existe um pedido pendente para este grupo.");
    }

    // Se não existir pedido, cria um novo
    const pedido = await prisma.grupo_Usuario.create({
        data: {
            usuarioId: usuarioId,
            grupoId: grupoId,
            pedido: false,
            adm: false  // Definindo que não é administrador inicialmente
        }
    });

    return pedido;
};

// Confirmar pedido de entrada em um grupo
const confirmarPedidom = async (pedidoId, usuarioId) => {
    console.log(pedidoId)
    console.log(usuarioId)
    const grupoUsuario = await prisma.grupo_Usuario.findFirst({
        where: {
            idGU: pedidoId,
            grupo: {
                usuarios: {
                    some: {
                        usuarioId: usuarioId,
                        adm: true
                    }
                }
            }
        }
    });
    if (!grupoUsuario) {
        throw new Error("Você não tem permissão para confirmar este pedido.");
    }
    const pedido = await prisma.grupo_Usuario.update({
        where: {
            idGU: pedidoId
        },
        data: {
            pedido: true
        }
    });
    return pedido;
};

// Criar um novo grupo
const criarGrupom = async (nome, descricao, usuarioId, fundo) => {
    const novoGrupo = await prisma.grupo.create({
        data: {
            nome: nome,
            descricao: descricao,
            perfilFoto: fundo,
            usuarios: {
                create: {
                    usuarioId: usuarioId,
                    adm: true, // O criador será o administrador
                    pedido: true
                }
            }
        }
    });
    return novoGrupo;
};

// Buscar todos os pedidos de um grupo
const buscarPedidom = async (grupoId) => {
    const pedidos = await prisma.grupo_Usuario.findMany({
        where: {
            grupoId: grupoId,
            pedido: false
        },
        include: {
            usuario: true
        }
    });
    return pedidos;
};


module.exports = { 
    procurarGrupos,
    meusGruposm,
    verMensagensm,
    enviarMensagemm,
    fazerPedidom,
    confirmarPedidom,
    criarGrupom,
    buscarPedidom
};

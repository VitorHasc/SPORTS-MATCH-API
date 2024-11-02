const { haversineDistance } = require('../function');
const prisma = require('./conexaodb');
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: 'mysql.infocimol.com.br',       
  user: 'infocimol24',      
  password: process.env.DATABASE_PASSWORD,             
  database: 'infocimol24', 
  port: 3306,                
});

const findUserById = async (idusuario) => {
  return await prisma.usuario.findUnique({
    where: {
      idusuario: idusuario
    },
    select: {
      idusuario: true,
      nome: true,
      biografia: true,
      email: true,
      cidade: true,
      latitude: true,
      longitude: true,
      datanasc: true,
      perfilFoto: true,
      nick: true,
      genero: true,
      esportes: {
        select: {
          nome: true,
          idesporte: true
        }
      }
    }
  });
};

const createUser = async ({
  nome,
  senha,
  email,
  cidade,
  latitude,
  longitude,
  datanasc,
  caminhoImagem,
  genero,
  nick,
  biografia,
  esportes, // Adicione a variável esportes aqui
}) => {
  console.log(email, nome, senha, cidade, latitude, longitude, datanasc, caminhoImagem, genero, nick, biografia, esportes);

  // Criação do usuário
  const user = await prisma.usuario.create({
    data: {
      nome,
      email,
      cidade,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      perfilFoto: caminhoImagem,
      biografia,
      senha,
      datanasc,
      genero,
      online: "1992-04-15T00:00:00.00Z", 
      nick,
    },
  });


  const array = esportes.split(',').map(item => item.toLowerCase());

  console.log(array);
  if (array && array.length > 0) {
    const esportesData = array.map((esporte) => ({
      nome: esporte,
      usuarioId: user.idusuario, 
    }));
    console.log(esportesData);
    await prisma.esporte.createMany({
      data: esportesData,
    });
  }

  return user;
};

const loginUser = async ({email}) => {
  return await prisma.usuario.findFirst({
    where: {
      email: email
    }
  });
}





const searchUsers = async ({ longitude, latitude, idademin, idademax, genero, esporte, nome, pagina, idusuario }) => {
  console.log(esporte)
  console.log("Filtros de idade:", idademin, idademax);
  console.log("Coordenadas:", latitude, longitude);

  // Encontrando IDs de usuários já interagidos
  const usuariosJaInteragidosRows = await prisma.mensagemInd.findMany({
    where: {
      OR: [
        { remetenteId: idusuario },
        { destinatarioId: idusuario },
      ],
    },
    select: {
      remetenteId: true,
      destinatarioId: true,
    },
  });

  const idsUsuariosJaInteragidos = usuariosJaInteragidosRows.flatMap(interacao => [
    interacao.remetenteId,
    interacao.destinatarioId,
  ]);
  let usuarios
  if(!esporte){
    [usuarios] = await pool.query(`
      SELECT 
        *, 
        (6371 * acos(
          cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + 
          sin(radians(?)) * sin(radians(latitude))
        )) AS distancia
      FROM Usuario
      WHERE datanasc BETWEEN ? AND ?
        ${genero ? `AND genero = ?` : ''}
        ${idsUsuariosJaInteragidos.length > 0 ? `AND idusuario NOT IN (${idsUsuariosJaInteragidos.map(() => '?').join(', ')})` : ''}
      ORDER BY distancia ASC
      LIMIT 5 OFFSET ?
    `, [
      latitude,
      longitude,
      latitude,
      idademin,
      idademax,
      ...(genero ? [genero] : []),
      ...idsUsuariosJaInteragidos,
      (pagina - 1) * 5
    ]);
  }
  if(esporte){
    [usuarios] = await pool.query(`
      SELECT 
        u.*, 
        (6371 * acos(
          cos(radians(?)) * cos(radians(u.latitude)) * cos(radians(u.longitude) - radians(?)) + 
          sin(radians(?)) * sin(radians(u.latitude))
        )) AS distancia
      FROM Usuario u
      INNER JOIN Esporte e ON u.idusuario = e.usuarioId
      WHERE u.datanasc BETWEEN ? AND ?
        ${genero ? `AND u.genero = ?` : ''}
        ${esporte ? `AND e.nome = ?` : ''}
        ${idsUsuariosJaInteragidos.length > 0 ? `AND u.idusuario NOT IN (${idsUsuariosJaInteragidos.map(() => '?').join(', ')})` : ''}
      ORDER BY distancia ASC
      LIMIT 5 OFFSET ?
    `, [
      latitude,
      longitude,
      latitude,
      idademin,
      idademax,
      ...(genero ? [genero] : []),
      ...(esporte ? [esporte] : []),
      ...idsUsuariosJaInteragidos,
      (pagina - 1) * 5
    ]);  
  }
  


  const index = usuarios.findIndex(usuario => usuario.idusuario === idusuario);
  if (index !== -1) {
  usuarios.splice(index, 1);
  }

  return { usuarios, pagina };
};

const pegarEsportesBanco = async () => {
  const esportes = await prisma.esporte.findMany({
    select: {
      nome: true,
    },
    distinct: ['nome'],
  });
  return esportes.map(esporte => esporte.nome);
};


module.exports = { 
  findUserById, 
  createUser,
  loginUser,
  searchUsers,
  pegarEsportesBanco 
};
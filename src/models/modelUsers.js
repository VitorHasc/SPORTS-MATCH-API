const { haversineDistance } = require('../function');
const prisma = require('./conexaodb');
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'junction.proxy.rlwy.net',
  user: 'root',
  password: 'gaVEYXRZvPJOXBprmOWWWSCTGLPTISjC',
  database: 'railway',
  port: 14777,
});

// Para usar a conexão
(async () => {
  const connection = await pool.getConnection();
  try {
    const [rows, fields] = await connection.query('SELECT * FROM sua_tabela');
    console.log(rows);
  } finally {
    connection.release(); // Libera a conexão de volta para o pool
  }
})();

// Para usar a conexão
(async () => {
  const connection = await pool.getConnection();
  try {
    const [rows, fields] = await connection.query('SELECT * FROM sua_tabela');
    console.log(rows);
  } finally {
    connection.release(); // Libera a conexão de volta para o pool
  }
})();

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

const createUser = async ({ nome, senha, email, cidade, latitude, longitude, datanasc, caminhoImagem, genero, nick, biografia }) => {
  console.log(email, nome, senha, cidade, latitude, longitude, datanasc, caminhoImagem, genero, nick, biografia);
  return await prisma.usuario.create({
    data: {
      nome,
      email,
      cidade,
      latitude:parseFloat(latitude),
      longitude:parseFloat(longitude),
      perfilFoto:caminhoImagem,
      biografia,
      senha,
      datanasc,
      genero,
      online: "1992-04-15T00:00:00.00Z",
      nick,
    }
  });
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
      FROM usuario
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
      FROM usuario u
      INNER JOIN esporte e ON u.idusuario = e.usuarioId
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


module.exports = { 
  findUserById, 
  createUser,
  loginUser,
  searchUsers 
};
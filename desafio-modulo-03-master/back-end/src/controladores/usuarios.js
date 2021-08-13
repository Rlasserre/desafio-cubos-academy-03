const conexao = require('../conexao');
const bcrypt = require('bcrypt');


const cadastrarUsuario = async (req, res) => {
  const { nome, nome_loja, email, senha } = req.body;
  
  if (!nome) {
    return res.status(400).json("Por favor informe seu nome.");
  }

  if (!nome_loja) {
    return res.status(400).json("por favor informe o nome da loja.");
  }

  if (!email) {
    return res.status(400).json("Informe o email ele será o seu login.");
  }

  if (!senha) {
    return res.status(400).json("Informe uma senha.");
  }

  try {
    const queryConsultaEmail = 'select * from usuarios where email = $1';
    const { rowCount: quantidadeUsuarios } = await conexao.query(queryConsultaEmail, [email]);

    if (quantidadeUsuarios > 0) {
        return res.status(400).json('O email informado já existe.');
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const query = 'insert into usuarios (nome, email, senha, nome_loja) values ($1, $2, $3, $4)';
    const usuarioCadastrado = await conexao.query(query, [nome, email, senhaCriptografada, nome_loja]);

    if (usuarioCadastrado.rowCount === 0) {
        return res.status(400).json('Não foi possível cadastrar o usuário.');
    }

    return res.status(200).json('Usuario cadastrado com sucesso!');
} catch (error) {
    return res.status(error.message);
}
}
    

const obterPerfil = async (req, res) => {
  const { usuario } = req;
  return res.status(200).json(usuario);
  }
  
  
  const atualizarPerfil = async (req, res) => {
    const { usuario } = req;
    const { nome, email, senha, nome_loja } = req.body;
  
    if (!nome && !email && !senha && !nome_loja) {
      return res
        .status(400)
        .json("Informe ao menos um campo para ser atualizado.");
    }
    try {
  
      if (senha) {
        const query =
          "update usuarios set nome = $1, email = $2, nome_loja = $3, senha = $4 where id = $5";
        const senhaCriptografada = await bcrypt.hash(senha, 10);
        const values = [
          nome ?? usuario.nome,
          email ?? usuario.email,
          nome_loja ?? usuario.nome_loja,
          senhaCriptografada,
          usuario.id,
        ];
        const { rowCount } = await conexao.query(query, values);
        
        if (rowCount === 0) {
          return res.status(400).json("Não foi possível atualizar o usuário.");
        }
        return res.status(200).json("Usuário atualizado com sucesso.");
      }
      const query =
        "update usuarios set nome = $1, email = $2, nome_loja = $3 where id = $4";
  
      const values = [
        nome ?? usuario.nome,
        email ?? usuario.email,
        nome_loja ?? usuario.nome_loja,
        usuario.id,
      ];
      const { rowCount } = await conexao.query(query, values);
      if (rowCount === 0) {
        return res.status(400).json("Não foi possível atualizar dados do usuário.");
      }
      return res.status(200).json("Usuário atualizado com sucesso.");
    } catch (error) {
      res.status(400).json(error.message);
    }
  };
  
  module.exports = {
    cadastrarUsuario,
    obterPerfil,
    atualizarPerfil
  };
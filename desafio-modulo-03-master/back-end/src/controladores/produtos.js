const conexao = require("../conexao");

const listarProdutos = async (req, res) => {
  const { categoria } = req.query;
  const { usuario } = req;

try {
  if (categoria) {
  const categoriaFormat = `${categoria}%`;

  const produtos = await conexao.query(
      "select * from produtos where usuarios_id = $1 and categoria ilike $2",[usuario.id, categoriaFormat]);

  if (produtos.rowCount === 0) {
      return res.status(404).json("Não foram encontrados produtos cadastrados nessa categoria.");
  }

      return res.status(200).json(produtos.rows);
  }

  const produtos = await conexao.query("select * from produtos where usuarios_id = $1",[usuario.id]);

  if (produtos.rowCount === 0) {
      return res.status(404).json("Não foram encontrados produtos deste usuário.");
  }
                
    res.status(200).json(produtos.rows);
  } catch (error) {
    res.status(400).json(error.message);
  }
}

const obterProduto = async (req, res) => {
  const { id } = req.params;
  const { usuario } = req;

  try {
    const produtos = await conexao.query("select * from produtos where id = $1", [id]);

  if (produtos.rowCount === 0) {
      return res.status(400).json("Produto não encontrado.");
  }

    const produto = produtos.rows[0];

  if (produto.usuarios_id !== usuario.id) {
      return res.status(401).json("Produto não pertence ao usuário.");
  }

    res.status(200).json(produto);
  } catch (error) {
    res.status(400).json(error.message);
  }
}

const cadastrarProduto = async (req, res) => {
  const { nome, estoque, categoria, preco, descricao, imagem } = req.body;
  const { usuario } = req;
 
  if (!nome) {
    return res.status(400).json("O nome do produto deve ser informado.");
  }

  if (!estoque) {
    return res.status(400).json("Informe o estoque do produto.");
  }

  if (!preco) {
    return res.status(400).json("O preço deve ser informado.");
  }
  
  try {
    const query = "insert into produtos (usuarios_id, nome, estoque, categoria, preco, descricao, imagem) values ($1,$2,$3,$4,$5,$6,$7)";
    const produto = await conexao.query(query, [usuario.id, nome, estoque, categoria, preco, descricao, imagem]);

    if (produto.rowCount === 0) {
      return res.status(400).json("Não foi possível cadastrar produto.");
    }

    res.status(200).json("Produto cadastrado com sucesso.");
  } catch (error) {
    res.status(400).json(error.message);
  }
}

const atualizarProduto = async (req, res) => {
  const { id } = req.params;
  const { nome, estoque, categoria, preco, descricao, imagem } = req.body;
  const { usuario } = req;
    
  if (!nome && !estoque && !categoria && !preco && !descricao && !imagem) {
    return res.status(400).json("Informe ao menos um campo.");
  }

  try {
    const produtos = await conexao.query("select * from produtos where id = $1", [id]);

  if (produtos.rowCount === 0) {
    return res.status(400).json("Produto não encontrado.");
  }

    const produto = produtos.rows[0];

  if (produto.usuarios_id !== usuario.id) {
    return res.status(401).json("Produto não pertence ao usuário.");
  }

    const query = "update produtos set nome = $1, estoque = $2, categoria = $3, preco = $4, descricao = $5, imagem = $6  where id = $7";
   
    const produtoAtualizacao = await conexao.query(query,
        [
        nome || produto.nome, 
        estoque || produto.estoque,
        categoria || produto.categoria,
        preco || produto.preco,
        descricao || produto.descricao,
        imagem || produto.imagem,
        id,
        ]);

  if (produtoAtualizacao.rowCount === 0) {
    return res.status(400).json("Erro ao atualizar o produto.");
  }

    res.status(200).json("A atualização foi realizada com sucesso.");
  } catch (error) {
    res.status(400).json(error.message);
  }
}

const excluirProduto = async (req, res) => {
  const { id } = req.params;
  const { usuario } = req;

  try {
    const produtos = await conexao.query("select * from produtos where id = $1", [id]);

    if (produtos.rowCount === 0) {
      return res.status(400).json("Produto não encontrado.");
    }

    const produto = produtos.rows[0];

    if (produto.usuarios_id !== usuario.id) {
      return res.status(401).json("Produto não cadastrado para o usuário.");
    }

    const produtoExclusao = await conexao.query("delete from produtos where id = $1", [id]);

    if (produtoExclusao.rowCount === 0) {
      return res.status(400).json("Não foi possível remover produto.");
    }

    res.status(200).json("Produto excluido com sucesso.");
  } catch (error) {
    res.status(400).json(error.message);
  }
}

module.exports = {
  listarProdutos,
  obterProduto,
  cadastrarProduto,
  atualizarProduto,
  excluirProduto,
}
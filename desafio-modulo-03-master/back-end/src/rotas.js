const express = require("express");
const verificaLogin = require("./filtros/verificaLogin"); 
const usuarios = require("./controladores/usuarios");
const login = require("./controladores/login");
const produtos = require("./controladores/produtos");

const rotas = express();


//cadastro usuario e login
rotas.post("/usuarios", usuarios.cadastrarUsuario);
rotas.post("/login", login.login);

//atualizar e dados do perfil de usuario
rotas.get("/perfil", verificaLogin, usuarios.obterPerfil);
rotas.put("/perfil", verificaLogin, usuarios.atualizarPerfil);

//rotas de produtos
rotas.get("/produtos", verificaLogin, produtos.listarProdutos);
rotas.get("/produtos/:id", verificaLogin, produtos.obterProduto);
rotas.post("/produtos", verificaLogin, produtos.cadastrarProduto);
rotas.put("/produtos/:id", verificaLogin, produtos.atualizarProduto);
rotas.delete("/produtos/:id", verificaLogin, produtos.excluirProduto);

module.exports = rotas;
const express = require("express");
const controladores = require("./controladores/recurso");

const roteador = express();

roteador.get("/contas", controladores.listarContas);
roteador.post("/contas", controladores.criarConta);
roteador.put("/contas/:numeroConta/usuario", controladores.atualizarConta);
roteador.delete("/contas/:numeroConta", controladores.deletarConta);
roteador.post("/transacoes/depositar", controladores.depositar);
roteador.post("/transacoes/sacar", controladores.sacar);
roteador.post("/transacoes/transferir", controladores.transferir);
roteador.get("/contas/saldo", controladores.saldo);
roteador.get("/contas/extrato", controladores.extrato);


module.exports = roteador;
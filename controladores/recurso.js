const dados = require("../src/bancodedados");
const { format } = require('date-fns');
const { depositos } = require("../src/bancodedados");

//Validações
function validarSenhar(senha) {
    const senha_banco = dados.banco.senha;

    if (senha === senha_banco) {
        return true;
    } else {
        return false;
    };
};

function validarDados(conta) {

    if (!conta.nome) {
        return "O campo 'nome' é obrigatório";
    };

    if (!conta.cpf) {
        return "O campo 'cpf' é obrigatório";
    }

    if (!conta.data_nascimento) {
        return "O campo 'data_nascimento' é obrigatório";
    };

    if (!conta.telefone) {
        return "O campo 'telefone' é obrigatório";
    };

    if (!conta.email) {
        return "O campo 'email' é obrigatório";
    }

    if (!conta.senha) {
        return "O campo 'senha' é obrigatório";
    };

    if (conta.cpf.length !== 11) {
        return "O campo 'cpf' deve conter 11 caracteres."
    };

    if (conta.cpf.includes(" ")) {
        return "O campo 'cpf' não pode conter espaços vazios."
    };

    if (conta.email.includes(" ")) {
        return "O campo 'email' não pode conter espaços vazios."
    };

    if (conta.telefone.includes(" ")) {
        return "O campo 'telefone' não pode conter espaços vazios."
    };

    if (conta.senha.includes(" ")) {
        return "O campo 'senha' não pode conter espaços vazios."
    };
};


function validarTransacoes(conta) {
    if (!conta.numero_conta) {
        return "O campo 'numero_conta' é obrigatório";
    };

    if (!conta.valor) {
        return "O campo 'valor' é obrigatório";
    };

    if (conta.valor <= 0) {
        return "O campo 'valor' deve conter um número maior que zero";
    };

    if (typeof conta.valor !== "number") {
        return "O campo 'valor' deve conter apenas números."
    };
};

function validarTransferir(conta) {
    if (!conta.numero_conta_origem) {
        return "O campo 'numero_conta_origem' é obrigatório";
    };

    if (!conta.numero_conta_destino) {
        return "O campo 'numero_conta_destino' é obrigatório";
    };

    if (!conta.valor) {
        return "O campo 'valor' é obrigatório";
    };

    if (!conta.senha) {
        return "O campo 'senha' é obrigatório";
    };


    if (conta.valor <= 0) {
        return "O campo 'valor' deve conter um número maior que zero";
    };

    if (typeof conta.valor !== "number") {
        return "O campo 'valor' deve conter apenas números.";
    };

    if (conta.numero_conta_origem === conta.numero_conta_destino) {
        return "Não é possível transferir para a mesma conta. Insira uma conta de destino diferente.";
    };
};





//REQUISIÇÕES
//GET - Listar contas:
function listarContas(req, res) {

    if (!req.query.senha_banco) {
        res.status(401);
        res.json({
            "mensagem": "É obrigatório o uso de senha."
        });
        return;
    };

    const senhaValida = validarSenhar(req.query.senha_banco);

    if (senhaValida === true) {
        res.status(200);
        res.json(dados.contas)
    } else if (senhaValida === false) {
        res.status(401);
        res.json({
            "mensagem": "A senha do banco informada é inválida!"
        });
    };
};


//POST - Criar conta:
let proxConta = 1;

function criarConta(req, res) {
    const erro = validarDados(req.body);

    if (erro) {
        res.status(400);
        res.json({ erro });
        return;
    };

    const nova_conta = {
        numero: proxConta.toString(),
        saldo: 0,
        usuario: {
            nome: req.body.nome,
            cpf: req.body.cpf,
            data_nascimento: format(new Date(req.body.data_nascimento), "yyyy-MM-dd"),
            telefone: req.body.telefone,
            email: req.body.email,
            senha: req.body.senha
        }
    };

    const conta = dados.contas.find((conta) => conta.usuario.cpf === req.body.cpf || conta.usuario.email === req.body.email);

    if (conta) {
        res.status(401);
        res.json({
            "mensagem": "Já existe uma conta com o cpf ou e-mail informado!"
        });
        return;
    };

    dados.contas.push(nova_conta);

    proxConta += 1;

    res.status(201);
    res.json('');
};



//PUT - Atualizar conta:
function atualizarConta(req, res) {

    const conta = dados.contas.find((conta) => conta.numero === req.params.numeroConta);

    if (!conta) {
        res.status(404);
        res.json({
            "mensagem": "Conta de número " + req.params.numeroConta + " não existe."
        });
        return;
    };

    const erro = validarDados(req.body);

    if (erro) {
        res.status(400);
        res.json({ erro });
        return;
    };


    const jaExisteCpf = dados.contas.find((itens) => itens.usuario.cpf === req.body.cpf);

    if (jaExisteCpf) {
        if (jaExisteCpf.numero !== req.params.numeroConta) {
            res.json({
                "mensagem": "Já existe uma outra conta com o cpf: " + req.body.cpf
            });
            return;
        };
    };


    const jaExisteEmail = dados.contas.find((itens) => itens.usuario.email === req.body.email);

    if (jaExisteEmail) {
        if (jaExisteEmail.numero !== req.params.numeroConta) {
            res.json({
                "mensagem": "Já existe uma outra conta com o email: " + req.body.email
            });
            return;
        };
    };


    if (req.body.cpf !== undefined) {
        conta.usuario.cpf = req.body.cpf;
    };

    if (req.body.email !== undefined) {
        conta.usuario.email = req.body.email;
    };

    if (req.body.nome !== undefined) {
        conta.usuario.nome = req.body.nome;
    };

    if (req.body.data_nascimento !== undefined) {
        conta.usuario.data_nascimento = req.body.data_nascimento;
    };

    if (req.body.telefone !== undefined) {
        conta.usuario.telefone = req.body.telefone;
    };

    if (req.body.senha !== undefined) {
        conta.usuario.senha = req.body.senha;
    };

    res.json('');
};


//DELETE - Deletar conta:
function deletarConta(req, res) {

    const conta = dados.contas.find((conta) => conta.numero === req.params.numeroConta);

    if (!conta) {
        res.status(404);
        res.json({ erro: "Conta de número " + req.params.numeroConta + " não existe." });
        return;
    };

    if (conta.saldo !== 0) {
        res.status(403);
        res.json({
            "mensagem": "A conta só pode ser removida se o saldo for zero!"
        });
        return;
    };

    const indice = dados.contas.indexOf(conta);

    dados.contas.splice(indice, 1);

    res.json('');
};






//TRANSAÇÕES
//POST - Depositar:
function depositar(req, res) {

    const conta = dados.contas.find((conta) => conta.numero === req.body.numero_conta);

    const erro = validarTransacoes(req.body);

    if (erro) {
        res.status(400);
        res.json({ erro });
        return;
    };


    if (conta) {
        conta.saldo += req.body.valor;
        res.json('');
    } else {
        res.status(404);
        res.json({ erro: "Conta de número " + req.body.numero_conta + " não existe." });
        return;
    };

    const extrato_depositos = {
        numero_conta: conta.numero,
        data: format(new Date(), "yyyy-MM-dd  HH:mm:ss"),
        valor: req.body.valor
    };

    dados.depositos.push(extrato_depositos);
};


//POST - Sacar:
function sacar(req, res) {

    const conta = dados.contas.find((conta) => conta.numero === req.body.numero_conta);

    if (!conta) {
        res.status(404);
        res.json({ erro: "Conta de número " + req.body.numero_conta + " não existe." });
        return;
    };

    const erro = validarTransacoes(req.body);

    if (erro) {
        res.status(400);
        res.json({ erro });
        return;
    };

    if (!req.body.senha) {
        res.status(400);
        res.json({
            "mensagem": "O campo 'senha' é obrigatório"
        });
        return;
    };

    if (req.body.senha !== conta.usuario.senha) {
        res.status(401);
        res.json({
            "mensagem": "Senha inválida."
        });
        return;
    };

    if (conta.saldo < req.body.valor) {
        res.status(400);
        res.json({
            "mensagem": "Não há saldo suficiente para realizar o saque."
        });
        return;
    };

    if (conta) {
        conta.saldo -= req.body.valor;
        res.json('');
    };

    const extrato_saques = {
        numero_conta: conta.numero,
        data: format(new Date(), "yyyy-MM-dd  HH:mm:ss"),
        valor: req.body.valor
    };

    dados.saques.push(extrato_saques);
};


//POST - Transferir:
function transferir(req, res) {

    const contaOrigem = dados.contas.find((conta) => conta.numero === req.body.numero_conta_origem);
    const contaDestino = dados.contas.find((conta) => conta.numero === req.body.numero_conta_destino);

    const erro = validarTransferir(req.body);

    if (erro) {
        res.status(400);
        res.json({ erro });
        return;
    };

    if (!contaOrigem) {
        res.status(404);
        res.json({ erro: "Conta de número " + req.body.numero_conta_origem + " não existe." });
        return;
    };

    if (!contaDestino) {
        res.status(404);
        res.json({ erro: "Conta de número " + req.body.numero_conta_destino + " não existe." });
        return;
    };


    if (req.body.senha !== contaOrigem.usuario.senha) {
        res.status(404);
        res.json({ "mensagem": "Senha inválida" });
        return;
    };

    if (contaOrigem.saldo < req.body.valor) {
        res.status(404);
        res.json({ "mensagem": "Não há saldo suficiente para realizar o saque." });
        return;
    };


    if (contaOrigem && contaDestino) {
        contaOrigem.saldo -= req.body.valor;
        contaDestino.saldo += req.body.valor;
        res.json('');
    };

    const extrato_transferencias = {
        numero_conta_origem: contaOrigem.numero,
        numero_conta_destino: contaDestino.numero,
        data: format(new Date(), "yyyy-MM-dd  HH:mm:ss"),
        valor: req.body.valor
    };

    dados.transferencias.push(extrato_transferencias);
};


//GET - saldo:
function saldo(req, res) {

    const numero_conta = req.query.numero_conta;
    const senha = req.query.senha;

    if (!numero_conta) {
        res.status(400);
        res.json({ "mensagem": "O campo 'numero_conta' é obrigatório." });
        return;
    };

    if (!senha) {
        res.status(401);
        res.json({ "mensagem": "O campo 'senha' é obrigatório." });
        return;
    };

    const conta = dados.contas.find((conta) => conta.numero === numero_conta);

    if (!conta) {
        res.status(404);
        res.json({ erro: "Conta de número " + numero_conta + " não existe." });
        return;
    };

    if (conta.usuario.senha !== senha) {
        res.status(401);
        res.json({ "mensagem": "Senha inválida." });
        return;
    } else {
        res.json({ "saldo": conta.saldo });
    };

};


//GET - Extrato:
function extrato(req, res) {

    const numero_conta = req.query.numero_conta;
    const senha = req.query.senha;

    if (!numero_conta) {
        res.status(400);
        res.json({ "mensagem": "O campo 'numero_conta' é obrigatório." });
        return;
    };

    if (!senha) {
        res.status(401);
        res.json({ "mensagem": "O campo 'senha' é obrigatório." });
        return;
    };

    const conta = dados.contas.find((conta) => conta.numero === numero_conta);

    if (!conta) {
        res.status(404);
        res.json({ erro: "Conta de número " + numero_conta + " não existe." });
        return;
    };

    if (conta.usuario.senha !== senha) {
        res.status(401);
        res.json({ "mensagem": "Senha inválida." });
        return;
    }

    const extratoDepositos = dados.depositos.filter((itens) => itens.numero_conta === numero_conta);
    const extratoSaques = dados.saques.filter((itens) => itens.numero_conta === numero_conta);
    const extratoOrigem = dados.transferencias.filter((itens) => itens.numero_conta_origem === numero_conta);
    const extratoDestino = dados.transferencias.filter((itens) => itens.numero_conta_destino === numero_conta)

    const extrato = {
        depositos: extratoDepositos,
        saques: extratoSaques,
        transferenciasEnviadas: extratoOrigem,
        transferenciasRecebidas: extratoDestino
    };

    res.json(extrato);
};



//Exportar:
module.exports = {
    listarContas,
    criarConta,
    atualizarConta,
    deletarConta,
    depositar,
    sacar,
    transferir,
    saldo,
    extrato
};
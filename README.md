# Simulação de um sistema bancário - API REST

Projeto de simulação de um sistema bancário usando uma API REST.

Esta RESTful API permite:

-   Criar conta bancária
-   Listar contas bancárias
-   Atualizar os dados do usuário da conta bancária
-   Excluir uma conta bancária
-   Depósitar em uma conta bancária
-   Sacar de uma conta bancária
-   Transferir valores entre contas bancárias
-   Consultar saldo da conta bancária
-   Emitir extrato bancário

**Sempre que a validação de uma requisição falhar, o sistema responde com código de erro e uma mensagem explicando o tipo de erro**

**Exemplo:**

```javascript
// Quando é informado um número de conta que não existe:
// HTTP Status 404
{
    "mensagem": "Conta bancária não encontada!"
}
```

## Persistências dos dados

Os dados são persistidos em memória, no objeto existente dentro do arquivo `bancodedados.js`. **Todas as transações e contas bancárias serão inseridas dentro deste objeto, seguindo a estrutura que já existe.**

### Estrutura do objeto no arquivo `bancodedados.js`

```javascript
{
    banco: {
        nome: "Cubos Bank",
        numero: "123",
        agencia: "0001",
        senha: "Cubos123Bank",
    },
    contas: [
        // array de contas bancárias
    ],
    saques: [
        // array de saques
    ],
    depositos: [
        // array de depósitos
    ],
    transferencias: [
        // array de transferências
    ],
}
```
## Caracteristicas dessa API

-   Essa API segue o padrão REST.
-   O código esta organizado delimitando as responsabilidades de cada arquivo adequadamente. Esses arquivos são:
    -   Um arquivo index.js
    -   Um arquivo de rotas
    -   Um pasta com controladores

-   OBS: Qualquer valor (dinheiro) deverá ser representado em centavos (Ex.: R$ 10,00 reais = 1000)


## Status Code

Abaixo, listamos os possíveis ***status code*** esperados como resposta da API.

Obs.: As mensagens descrevem apenas uma interpretação de cada mensagem de erro de acordo com o status. Portanto, você pode esperar mensagens diversificadas, porém que atendam as mesmas funcionalidades. Qualquer dúvida, contate esta tabela de acordo com o status que a API apresentar.

```javascript
// 200 (OK) = requisição bem sucedida
// 201 (Created) = requisição bem sucedida e algo foi criado
// 204 (No Content) = requisição bem sucedida, sem conteúdo no corpo da resposta
// 400 (Bad Request) = o servidor não entendeu a requisição pois está com uma sintaxe/formato inválido
// 401 (Unauthorized) = o usuário não está autenticado (logado)
// 403 (Forbidden) = o usuário não tem permissão de acessar o recurso solicitado
// 404 (Not Found) = o servidor não pode encontrar o recurso solicitado
// 500 (Internal Server Error) = falhas causadas pelo servidor
```

## Endpoints esperados

### Listar contas bancárias

#### `GET` `/contas?senha_banco=Cubos123Bank`

Esse endpoint lista todas as contas bancárias existentes.

-   Este endpoint faz uso de senha. Portanto é importante se atentar as seguintes informações:

    -   Verificar se a senha do banco foi informada (passado como query params na url)
    -   Verificar se a senha do banco está correta (verifique a senha no arquivo `bancodedados.js`)

-   **Requisição** - query params (respeitando este nome)

    -   senha_banco

-   **Resposta**
    -   listagem de todas as contas bancárias existentes

#### Exemplo de resposta

```javascript
// HTTP Status 200 / 201 / 204
// 2 contas encontradas
[
    {
        "numero": "1",
        "saldo": 0,
        "usuario": {
            "nome": "Foo Bar",
            "cpf": "00011122233",
            "data_nascimento": "2021-03-15",
            "telefone": "71999998888",
            "email": "foo@bar.com",
            "senha": "1234"
        }
    },
    {
        "numero": "2",
        "saldo": 1000,
        "usuario": {
            "nome": "Foo Bar 2",
            "cpf": "00011122234",
            "data_nascimento": "2021-03-15",
            "telefone": "71999998888",
            "email": "foo@bar2.com",
            "senha": "12345"
        }
    }
]

// nenhuma conta encontrada
[]
```
```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "A senha do banco informada é inválida!"
}
```

### Criar conta bancária

#### `POST` `/contas`

Esse endpoint criará uma conta bancária, onde será gerado um número único para identificação da conta (número da conta).

-   Por conta das validações pré estabelecidas no arquivo de controladores, se atente as seguintes obrigatoriedades:

    -   CPF deve ser um campo único.
    -   E-mail deve ser um campo único.
    -   Verificar se todos os campos foram informados (todos são obrigatórios)
    -   O saldo inicial da conta será sempre 0 (zero).

-   **Requisição** - O corpo (body) possuira um objeto com as seguintes propriedades (respeitando estes nomes):

    -   nome
    -   cpf
    -   data_nascimento
    -   telefone
    -   email
    -   senha

-   **Resposta**

    Em caso de **sucesso**, nada será enviado no conteúdo do corpo (body) da resposta.  
    Em caso de **falha na validação**, a resposta será um ***status code*** apropriado, e em seu corpo (body) possuirá um objeto com uma propriedade **mensagem** que possuirá como valor um texto explicando o motivo da falha.

#### Exemplo de Requisição

```javascript
// POST /contas
{
    "nome": "Foo Bar 2",
    "cpf": "00011122234",
    "data_nascimento": "2021-03-15",
    "telefone": "71999998888",
    "email": "foo@bar2.com",
    "senha": "12345"
}
```

#### Exemplo de Resposta

```javascript
// HTTP Status 200 / 201 / 204
// Sem conteúdo no corpo (body) da resposta
```
```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Já existe uma conta com o cpf ou e-mail informado!"
}
```

### Atualizar usuário da conta bancária

#### `PUT` `/contas/:numeroConta/usuario`

Esse endpoint atualizará apenas os dados do usuário de uma conta bancária.

-   Por conta das validações pré estabelecidas no arquivo de controladores, se atente as seguintes obrigatoriedades:

    -   Verificar se foi passado todos os campos no body da requisição
    -   Verificar se o numero da conta passado como parametro na URL é válida
    -   Se o CPF for informado, o sistema irá verificar se já existe outro registro com o mesmo CPF
    -   Se o E-mail for informado, o sistema irá verificar se já existe outro registro com o mesmo E-mail

-   **Requisição** - O corpo (body) possuirá um objeto com todas as seguintes propriedades (respeitando estes nomes):

    -   nome
    -   cpf
    -   data_nascimento
    -   telefone
    -   email
    -   senha

-   **Resposta**

    Em caso de **sucesso**, nada será enviado no conteúdo do corpo (body) da resposta.  
    Em caso de **falha na validação**, a resposta será um ***status code*** apropriado, e em seu corpo (body) possuirá um objeto com uma propriedade **mensagem** que possuirá como valor um texto explicando o motivo da falha.

#### Exemplo de Requisição
```javascript
// PUT /contas/:numeroConta/usuario
{
    "nome": "Foo Bar 3",
    "cpf": "99911122234",
    "data_nascimento": "2021-03-15",
    "telefone": "71999998888",
    "email": "foo@bar3.com",
    "senha": "12345"
{
```


#### Exemplo de Resposta

```javascript
// HTTP Status 200 / 201 / 204
// Sem conteúdo no corpo (body) da resposta
```
```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "O CPF informado já existe cadastrado!"
}
```

### Excluir Conta

#### `DELETE` `/contas/:numeroConta`

Esse endpoint excluirá uma conta bancária existente.

-   Por conta das validações pré estabelecidas no arquivo de controladores, se atente as seguintes obrigatoriedades:

    -   Verificar se o numero da conta passado como parametro na URL é válido
    -   O sistema só permitirá excluir uma conta bancária se o saldo for 0 (zero).

-   **Requisição**

    -   Numero da conta bancária (passado como parâmetro na rota)

-   **Resposta**

    Em caso de **sucesso**, nada será enviado no conteúdo do corpo (body) da resposta.  
    Em caso de **falha na validação**, a resposta será um ***status code*** apropriado, e em seu corpo (body) possuirá um objeto com uma propriedade **mensagem** que possuirá como valor um texto explicando o motivo da falha.

#### Exemplo de Resposta

```javascript
// HTTP Status 200 / 201 / 204
// Sem conteúdo no corpo (body) da resposta
```
```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "A conta só pode ser removida se o saldo for zero!"
}
```

### Depositar

#### `POST` `/transacoes/depositar`

Esse endpoint somará o valor do depósito ao saldo de uma conta válida e registrará essa transação.

-   Por conta das validações pré estabelecidas no arquivo de controladores, se atente as seguintes obrigatoriedades:

    -   Verificar se o numero da conta e o valor do deposito foram informados no body.
    -   Verificar se a conta bancária informada existe.
    -   O sistema não permitirá depósitos com valores negativos ou zerados.

-   **Requisição** - O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

    -   numero_conta
    -   valor

-   **Resposta**

    Em caso de **sucesso**, nada será enviado no conteúdo do corpo (body) da resposta.  
    Em caso de **falha na validação**, a resposta será um ***status code*** apropriado, e em seu corpo (body) possuirá um objeto com uma propriedade **mensagem** que possuirá como valor um texto explicando o motivo da falha.

#### Exemplo de Requisição
```javascript
// POST /transacoes/depositar
{
	"numero_conta": "1",
	"valor": 1900
}
```

#### Exemplo de Resposta

```javascript
// HTTP Status 200 / 201 / 204
// Sem conteúdo no corpo (body) da resposta
```
```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "O número da conta e o valor são obrigatórios!"
}
```

#### Exemplo do registro de um depósito

```javascript
{
    "data": "2021-08-10 23:40:35",
    "numero_conta": "1",
    "valor": 10000
}
```

### Sacar

#### `POST` `/transacoes/sacar`

Esse endpoint realizará o saque de um valor em uma determinada conta bancária e registrar essa transação.

-   Por conta das validações pré estabelecidas no arquivo de controladores, se atente as seguintes obrigatoriedades:

    -   Verificar se o numero da conta, o valor do saque e a senha foram informados no body.
    -   Verificar se a conta bancária informada existe.
    -   Verificar se a senha informada é uma senha válida para a conta informada.

-   **Requisição** - O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

    -   numero_conta
    -   valor
    -   senha

-   **Resposta**

    Em caso de **sucesso**, nada será enviado no conteúdo do corpo (body) da resposta.  
    Em caso de **falha na validação**, a resposta será um ***status code*** apropriado, e em seu corpo (body) possuirá um objeto com uma propriedade **mensagem** que possuirá como valor um texto explicando o motivo da falha.

#### Exemplo de Requisição
```javascript
// POST /transacoes/sacar
{
	"numero_conta": "1",
	"valor": 1900,
    "senha": "123456"
}
```
#### Exemplo de Resposta
```javascript
// HTTP Status 200 / 201 / 204
// Sem conteúdo no corpo (body) da resposta
```
```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "O valor não pode ser menor que zero!"
}
```

#### Exemplo do registro de um saque

```javascript
{
    "data": "2021-08-10 23:40:35",
    "numero_conta": "1",
    "valor": 10000
}
```

### Tranferir

#### `POST` `/transacoes/transferir`

Esse endpoint permitirá a transferência de recursos (dinheiro) de uma conta bancária para outra e registrar essa transação.

-   Por conta das validações pré estabelecidas no arquivo de controladores, se atente as seguintes obrigatoriedades:

    -   Verificar se o número da conta de origem, de destino, senha da conta de origem e valor da transferência foram informados no body.
   

-   **Requisição** - O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

    -   numero_conta_origem
    -   numero_conta_destino
    -   valor
    -   senha

-   **Resposta**

    Em caso de **sucesso**, nada será enviado no conteúdo do corpo (body) da resposta.  
    Em caso de **falha na validação**, a resposta será um ***status code*** apropriado, e em seu corpo (body) possuirá um objeto com uma propriedade **mensagem** que possuirá como valor um texto explicando o motivo da falha

#### Exemplo de Requisição
```javascript
// POST /transacoes/transferir
{
	"numero_conta_origem": "1",
	"numero_conta_destino": "2",
	"valor": 200,
	"senha": "123456"
}
```
#### Exemplo de Resposta

```javascript
// HTTP Status 200 / 201 / 204
// Sem conteúdo no corpo (body) da resposta
```
```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Saldo insuficiente!"
}
```

#### Exemplo do registro de uma transferência

```javascript
{
    "data": "2021-08-10 23:40:35",
    "numero_conta_origem": "1",
    "numero_conta_destino": "2",
    "valor": 10000
}
```

### Saldo

#### `GET` `/contas/saldo?numero_conta=123&senha=123`

Esse endpoint retornará o saldo de uma conta bancária.

-   Por conta das validações pré estabelecidas no arquivo de controladores, se atente as seguintes obrigatoriedades:

    -   Verificar se o numero da conta e a senha foram informadas (passado como query params na url).
 
-   **Requisição** - query params

    -   numero_conta
    -   senha

-   **Resposta**

    -   Saldo da conta

#### Exemplo de Resposta

```javascript
// HTTP Status 200 / 201 / 204
{
    "saldo": 13000
}
```
```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Conta bancária não encontada!"
}
```

### Extrato

#### `GET` `/contas/extrato?numero_conta=123&senha=123`

Esse endpoint listará as transações realizadas de uma conta específica.

-  Por conta das validações pré estabelecidas no arquivo de controladores, se atente as seguintes obrigatoriedades:

    -   Verificar se o numero da conta e a senha foram informadas (passado como query params na url).

-   **Requisição** - query params

    -   numero_conta
    -   senha

-   **Resposta**
    -   Relatório da conta

#### Exemplo de Resposta

```javascript
// HTTP Status 200 / 201 / 204
{
  "depositos": [
    {
      "data": "2021-08-18 20:46:03",
      "numero_conta": "1",
      "valor": 10000
    },
    {
      "data": "2021-08-18 20:46:06",
      "numero_conta": "1",
      "valor": 10000
    }
  ],
  "saques": [
    {
      "data": "2021-08-18 20:46:18",
      "numero_conta": "1",
      "valor": 1000
    }
  ],
  "transferenciasEnviadas": [
    {
      "data": "2021-08-18 20:47:10",
      "numero_conta_origem": "1",
      "numero_conta_destino": "2",
      "valor": 5000
    }
  ],
  "transferenciasRecebidas": [
    {
      "data": "2021-08-18 20:47:24",
      "numero_conta_origem": "2",
      "numero_conta_destino": "1",
      "valor": 2000
    },
    {
      "data": "2021-08-18 20:47:26",
      "numero_conta_origem": "2",
      "numero_conta_destino": "1",
      "valor": 2000
    }
  ]
}
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Conta bancária não encontada!"
}
```


###### tags: `back-end` `nodeJS` `API REST` `javascript`
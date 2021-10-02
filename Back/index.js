//CRUD DE FILMES - BACKEND

const express = require('express'); //importa o express
const app = express(); //inicializa o express
app.use(express.json()); //fala para o express utilizar um middleware e trabalhar com o json

const cors = require('cors'); //importa o cors. 
app.use(cors()); //manda o express usar as configs do cors.

//import do arquivo de rotas
const filmesRouter = require('../Back/routers/filmes.routes');
//inicialização da constante e, portanto, das rotas
app.use('/filmes', filmesRouter);

app.get('/', (req, res) => {
    res.send('Olá usuário! Seja bem-vindo!');
})

//definição da porta que vai rodar a aplicação
const port = 3000;

app.listen(port, () => {
    console.log(`O servidor está rodando na porta ${port}`);
})
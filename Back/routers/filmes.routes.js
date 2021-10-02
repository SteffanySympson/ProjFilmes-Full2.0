const express = require('express');
const router = express.Router();

const filmes = [ //pre cadastro de um filme pra gente testar o metodo get
    {
        id: Date.now(),
        imagem: "https://nossaciencia.com.br/wp-content/uploads/2019/05/gera%C3%A7%C3%A3o-matrix.png",
        titulo: "Matrix",
        nota: "10",
        genero: "Ficção Científica",
        sinopse: "Um jovem programador é atormentado por estranhos pesadelos nos quais sempre está conectado por cabos a um imenso sistema de computadores do futuro. À medida que o sonho se repete, ele começa a levantar dúvidas sobre a realidade. E quando encontra os misteriosos Morpheus e Trinity, ele descobre que é vítima do Matrix, um sistema inteligente e artificial que manipula a mente das pessoas e cria a ilusão de um mundo real enquanto usa os cérebros e corpos dos indivíduos para produzir energia."
    },
]

// Função [GET] /filmes = vai retornar a lista de filmes.
router.get('/', (req, res) => {
    //envia o array de vagas como resposta.
    res.send(filmes);
})

//requisição para buscar  filme pelo id.
//Função [GET] /filmes/id
router.get('/:id', (req, res) => {
    const idParams = req.params.id; //id é um parâmetro
    const index = filmes.findIndex(filme => filme.id == idParams);
    const filme = filmes[index];
    res.send(filme);
})

//Método [POST] /add - Cadastra um novo filme na lista
router.post('/add', (req, res) => {
    const filme = req.body;
    filme.id = Date.now();
    filmes.push(filme);
    res.status(201).send({
        message: 'Filmes cadastrado com sucesso!',
        data: filme
    });
})

//Método [PUT] - atualização - recebe um objeto e um ID do front e atualizaos dados do filme com esse id. 
router.put('/:id', (req, res) => {
    const filmeEdit = req.body;
    const id = req.params.id;
    let filmePre = filmes.find((filme) => filme.id == id); //o filme já existe então ele é um filme pré cadastrado, dentro de filmes vamps buscar um filme pelo id dele.

    filmePre.imagem = filmeEdit.imagem;
    filmePre.titulo = filmeEdit.titulo;
    filmePre.nota = filmeEdit.nota;
    filmePre.genero = filmeEdit.genero;
    filmePre.sinopse = filmeEdit.sinopse;

    res.send({
        message: `Filme ${filmePre.id} atualizado com sucesso!`,
        data: filmePre
    })
})

//Método [DELETE] - método para deletar um filme através do id dele
router.delete('/:id', (req, res) => {
    const id = req.params.id; //vamos salvar o id recebido pelo parâmetro em uma variável.
    const index = filmes.findIndex((filme) => filme.id == id);
    filmes.splice(index, 1);

    res.send({
        message: `Filme deletado com sucesso`,
    })
})

module.exports = router;
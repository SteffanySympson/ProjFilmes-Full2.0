const urlApi = 'http://localhost:3000/filmes'; //variável que armazena a porta onde a API ta rodando
const lista = document.getElementById('lista'); //O método getElementById () retorna o elemento que possui o atributo ID com o valor especificado. Este método é um dos métodos mais comuns no HTML DOM e é usado quase todas as vezes que você deseja manipular ou obter informações de um elemento em seu documento. Retorna nulo se nenhum elemento com o ID especificado existir. Um ID deve ser único em uma página. No entanto, se houver mais de um elemento com o ID especificado, o método getElementById () retornará o primeiro elemento no código-fonte.

let edicao = false; //vamos usar isso qnd o botão de edição for acionado.
let idEdicao = 0; //vai iniciar o idEdição em 0. vai ser usado tbm qnd o botão de editar for acionado.

//Montagem da requisição tipo GET que vai receber os filmes cadastrados. É uma função assíncrona, ou seja, não para tudo enquanto espera o servidor responder, as próximas requisições vão acontecendo enquanto esta aguarda a resposta.

const getFilmes = async () => {
    const response = await fetch(urlApi); // é esse pedaço aqui que faz a ligação do back com o front, a FETCH. Qnd não passa nenhuma configuração o Fetch faz um GET. Já tras o body.
    const data = await response.json(); // o data é um array de objetos com os cadastros no formato json. Transforma o body em json.
    console.log(data); //mostra td isso na tela. Um arrey com os objetos dentro, vagas, filmes, games, livros...

    data.map((filme) => {  //o map vai varrendo o array item por item e colocando na tela.
        //insertAdjacentHTML recebe uma string html ou xml, ou seja, faz um parse para um objeto, e insere numa posição específica, que pode ser beforebegin (Antes do elemento), afterbegin(Dentro do elemento, antes de seu primeiro filho (childNode)), beforeend (Dentro do elemento, após seu último filho (childNode)) ou afterend (Após o elemento.). DEPOIS DO INSERTADJACENT ESTAREMOS CRIANDO O CARD QUE VAI SER RENDERIZADO NA TELA A CADA INPUT DE INFORMAÇÕES DO USUÁRIO.
        lista.insertAdjacentHTML('beforeend',`
        <div class="main">
            <ul class="cards">
                <li class="cards_item">
                    <div class="card">
                        <div class="card_image"><img class="imgDoCard" src="${filme.imagem}"></div>
                        <div class="card_content">
                        <h2 class="card_title">${filme.titulo}</h2>
                        <p class="card_text">${filme.nota}</p>
                        <p class="card_text">${filme.genero}</p>
                        <p class="card_text">${filme.sinopse}</p>
                        
                        <button class="btn card_btn" onclick="putFilme(${filme.id})">Editar</button>
                        <button class="btn card_btn" onclick="deleteFilme(${filme.id})">Excluir</button>
                        </div>
                    </div>
                </li>
            </ul>
        </div>  `)
    })
}
getFilmes();

//Função genérica de submit, pode ser aplicadado POST e no PUT

const submitForm = async (evento) => {
    evento.preventDefault(); //esse comando vai previnir a página de atualizar a cada vez que o evento de submit acontecer toda vez que o botão for acionado. Quando a resposta do servidor ao usuário estiver lenta, para que a página não fique travada essa função vai evitar que a página inteira seja atualizada e atualize apenas oq estiver sendo submetido.
    
    //É necessário pegar os valores preenchidos pelo usuário através do formulário.
    //A LET vai buscar o input e o seu value.
    
    let imagem = document.getElementById('imagem');
    let titulo = document.getElementById('titulo');
    let nota = document.getElementById('nota');
    let genero = document.getElementById('genero');
    let sinopse = document.getElementById('sinopse');

    //adiciona os valores dos inputs no objeto filmes

    const filme = {
        imagem: imagem.value,
        titulo: titulo.value,
        nota: nota.value,
        genero: genero.value,
        sinopse: sinopse.value
    }

    //essa parte vai vai verificar se o botão de edição foi ou não acionado, ou seja, se está editando o card ou não, se não dispara o POST, se sim dispara o PUT.
    //o IF vai configurar a requisição antes que ela seja disparada.
    if(!edicao) { //SE
        const request = new Request(`${urlApi}/add`, { //usa a constante urlApi que foi definida globalmente (http://localhost:3000/filmes) e completa apenas com o /add pra definir que estamos realizando a adição de um novo filme.
            method: 'POST', //definição do método da equisição, POST.
            body: JSON.stringify(filme), //Coloca em formato json e rendezina no corpo/tela.
            headers: new Headers({ 
                'Content-Type': 'application/json'})
        })

        const response = await fetch(request);
        const result = await response.json();
        //essas constantes uma chamará a fetch (LEMBRANDO: devolve uma promessa de que algo será retornado, essa promessa é chamada de Promisse. Essa promessa pode tanto ser boa, ter retornado os dados, quanto ter falhado por algum motivo - como no caso da conexão com o servidor cair.), essa fetch é assincrona conforme as anteriores configurações. A função result vai pegar o resultado da Fetch e jogar no body em formato JSON.

        if(result) { //verifica se a API retornou alguma coisa, se tiver retornado, rendezina na página.
            getFilmes();
        }
    } else { //SENÃO
        //Aqui virá a configuração do request(requisição) do PUT. Vamos criar uma variável (idEdicao) para pegar o ID e enviar ele na requisição, ela vai ser atualizada com o id qnd clicar no botão editar.
        const request = new Request(`${urlApi}/${idEdicao}`, {
            method: 'PUT',
            body: JSON.stringify(filme),
            headers: new Headers({ 
                'Content-Type': 'application/json'})
        })
        const response = await fetch(request);
        const result = await response.json();

        if(result){
            getFilmes();
        }
    }

    //Função que limpa os campos do input, tira oq foi digitado e mantém o campo do input vazio.

    imagem.value = '';
    titulo.value = '';
    nota.value = '';
    genero.value = '';
    sinopse.value = '';

    //agora limpa a lista do html para poder ser usada de novo com os valores do getFilmes;
    lista.innerHTML = ''; //o innerHTML retorna todo o texto e o html que existem no elemento. Ele retorna todo o html existente, retornando também às tags, e não somente o texto.

} //fechamento da submitForm 

//função (de call back usando aeronfunction para buscar um elemento pelo ID dele e retorna o o objeto completo na tela. A função é assíncrona.
const getFilmesById = async (id) => {
    const response = await fetch(`${urlApi}/${id}`);
    return filme = response.json(); //retorna o filme em formato de json
}

//ao clicar no botão de editar essa função, putFilme, vai ser chamada, habilitando o modo de edição. Ela vai receber o objeto do filme, um filme individual, e de acordo com o ID vai preencher os campos no html com os valores.
const putFilme = async (id) => {
    edicao = true; //muda a constante global edição de false para true.
    idEdicao = id; //iguala a constante global idEdicao ao id do objeto.

    const filme = await getFilmesById(id); //recebe o objeto de acordo com o ID dele.

    //salva os elementos (daí o final EL no nome da constante) para poder ser manipulado.
    let imagemEl = document.getElementById('imagem');
    let tituloEl = document.getElementById('titulo');
    let notaEl = document.getElementById('nota');
    let generoEl = document.getElementById('genero');
    let sinopseEl = document.getElementById('sinopse'); 

    //vai preencher os campos do html de acordo com o que estava no objeto.
    imagemEl.value = filme.imagem;
    tituloEl.value = filme.titulo;
    notaEl.value = filme.nota;
    generoEl.value = filme.genero;
    sinopseEl.value = filme.sinopse;
}

//Função para Excluir um filme pelo ID dele.
const deleteFilme = async (id) => {
    const request = new Request(`${urlApi}/${id}`, {
        method: 'DELETE', //o método é o delete, como não vai aparecer mais nada na tela não precisa das outras configurações.
    })
    const response = await fetch(request);
    const data = await response.json();
    console.log(data.message);

    lista.innerHTML = '';
    getFilmes();
}

const app = require('express')();
//O http é um módulo interno do Node
//parametro app -> express é uma função que recebe (req, res) internamente.
// http = objeto servidor HTTP (instância de http.Server
const http = require('http').createServer(app);
//require('socket.io') carrega a biblioteca
//http é uma função que conecta ao servidor
const io = require('socket.io')(http);

/*
Estou utilizando o Express para estruturar a aplicação web, criando rotas e lidando com requisições HTTP.
Em seguida, crio um servidor HTTP nativo do Node passando a aplicação Express como parâmetro.
Por fim, conecto o Socket.IO a esse servidor para permitir comunicação em tempo real entre cliente e servidor via WebSocket.
*/


var usuarios = [];
var socketIds = [];


//quando rota for raiz renderizar index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


//on() chamado automaticamente quando um cliente se conecta ao servidor via socket.io
io.on('connection',(socket)=>{
    //servidor fica escutando um evento chamado new user, quando o evento for recebido chama callback
    socket.on('Novo Usuario',function(data){
        //pega o array usuarios e procure o valor de Data dentro dele, caso exista retorna o valor do seu index
        // se indexOf retornar -1, significa que nao existe o valor nesse array

        //se usuario existir
        if(usuarios.indexOf(data) != -1){
            socket.emit('Novo Usuario Retornado',{success: false});
        }else{
            //nao existir

            //adiciona valor recebido no evento ao array, push adiciona valor no final do array
            usuarios.push(data);
            //cada  conexao recebe um id
            socketIds.push(socket.id);
            //retorna evento com objt js valor true
            socket.emit('Novo Usuario Retornado',{success: true});
        };
    });

    
    //quando chegar um evento chamado chat message
    socket.on('chat message',(obj)=>{
        //se o nome do usuario existir no array usuarios E  se o index do usuario for igual ao index do socketIDs
        if(usuarios.indexOf(obj.nome) != -1 && usuarios.indexOf(obj.nome) == socketIds.indexOf(socket.id)){
            //retorna um evento com os dados enviado pelo usuario
            io.emit('chat message',obj);
        }else{
            console.log('Erro: Você não tem permissão para executar a ação.');
        };
    });


    // Quando o usuário desconecta
    socket.on('disconnect', () => {
        // Procura o índice do socket
        let id = socketIds.indexOf(socket.id);
        /*
        splice() é um método de array que serve para:

            remover elementos
            adicionar elementos
            substituir elementos

            Parametros:
            splice.(indice → posição onde começa, quantidade → quantos elementos vai remover)
        */
        socketIds.splice(id,1);
        usuarios.splice(id,1);
        console.log(socketIds);
        console.log(usuarios);
        console.log('user disconnected');
    });
});


//servidor escuta porta 3000
http.listen(3000, () => {
  console.log('listening on *:3000');
});


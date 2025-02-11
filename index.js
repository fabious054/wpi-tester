const express = require('express');
const app = express();

// Middleware para processar corpos de requisições no formato JSON ou URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.send('Olá, mundo!');
});

// Rota POST para receber dados
app.post('/', (req, res) => {
    // Log do corpo da requisição completo
    console.log('Corpo da requisição recebido:', JSON.stringify(req.body, null, 2));

    // Verifica se req.body.body existe e contém a propriedade message
    if (req.body.body && req.body.body.message) {
        console.log('Conteúdo de message:', req.body.body.message);

        // Verifica se messageContextInfo existe dentro de message
        if (req.body.body.message.messageContextInfo) {
            console.log('messageContextInfo:', req.body.body.message.messageContextInfo);
        } else {
            console.log('messageContextInfo não está presente em message.');
        }
    } else {
        console.log('message não está presente no corpo da requisição.');
    }

    // Resposta ao cliente
    res.send('Dados recebidos com sucesso!');
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
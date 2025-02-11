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
    // Log do corpo da requisição
    console.log('Corpo da requisição recebido:', req.body);

    // Resposta ao cliente
    res.send('Dados recebidos com sucesso!');
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
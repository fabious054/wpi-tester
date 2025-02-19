const express = require('express');
const Redis = require('ioredis');
const app = express();
require('dotenv').config();
const { createMessage } = require('../utils/messages');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const redis = new Redis(process.env.REDIS_URL);

app.get('/', async (req, res) => {
    console.log("🔍 HOST:", process.env.HOST);
    console.log("🔍 INSTANCE_ID:", process.env.INSTANCE_ID);
    console.log("🔍 AUTH_TOKEN:", process.env.AUTH_TOKEN ? "EXISTS" : "MISSING");

    //redis remove all keys
    await redis.flushall();

    const value = await redis.get('session:555496126100');
    console.log('Valor do Redis:', value);
    res.send('Olá, mundo!');
});

app.post('/', async (req, res) => {
    const data = req.body;
    if (!data) {
        return res.send('No datas available');
    }

    if (data.isGroup || data.fromMe) {
        return res.send('Received message is from a group or from me, ignoring...');
    }

    const { pushName: nameOfContact, id: numberFrom } = data.sender;
    const receivedMessage = data.msgContent.conversation;

    // if (numberFrom !== '555496126100') {
    //     console.log('Número não autorizado');
    //     return res.sendStatus(200);
    // }

    let session = await redis.get(`session:${numberFrom}`);
    session = session ? JSON.parse(session) : {
        step: 1,
        context: { motherName: nameOfContact },
        finished: false,
    };

    if (session.finished) {
        console.log('Session finished');
        return res.sendStatus(200);
    }

    if (session.step === 2) {
        session.context.daughterName = receivedMessage;
    } else if (session.step === 3) {
        const regex = /(\d{2}\/\d{2}\/\d{4})/g;
        const match = receivedMessage.match(regex);
        if (!match) {
            console.log('Data de nascimento não encontrada');
            return res.sendStatus(200);
        }

        const birthDate = match[0];
        const bornYear = birthDate.split('/')[2];
        session.context.birthDate = birthDate;
        session.context.bornYear = bornYear;

        const ageGroupMap = {
            '2023': 'A', '2024': 'A',
            '2021': 'B', '2022': 'B',
            '2019': 'C', '2020': 'C',
            '2017': 'D', '2018': 'D',
            '2015': 'E', '2016': 'E',
            '2013': 'E', '2014': 'E',
        };

        session.context.ageGroup = ageGroupMap[bornYear] || 'E';
    }

    const createdMessages = createMessage(session);
    const messages = createdMessages[0].messages;

    const batchSize = 1;
    let apiWorked = true;

    for (let i = 0; i < messages.length; i += batchSize) {
        const batch = messages.slice(i, i + batchSize);

        const sendMessagePromises = batch.map(msg => 
            // sendMessage(msg.content.text, numberFrom, msg.type)
        );

        const apiResults = await Promise.all(sendMessagePromises);

        if (!apiResults.every(result => result === 200)) {
            console.log('Erro ao enviar mensagem no lote', i);
            apiWorked = false;
            break;
        }

        console.log(`Lote ${i / batchSize + 1} enviado com sucesso.`);
    }

    if (apiWorked) {
        if (createdMessages[0].status === 200) {
            session.step++;
        } else if (createdMessages[0].status === 2000) {
            session.finished = true;
        }
    }

    await redis.set(`session:${numberFrom}`, JSON.stringify(session));
    return res.sendStatus(200);
});


async function sendMessage(txt, number,type) {
    if (!process.env.HOST || !process.env.INSTANCE_ID || !process.env.AUTH_TOKEN) {
        console.error('❌ Variáveis de ambiente ausentes.');
        return { error: "Configuração inválida." };
    }

    let body;
    let endpoint_url;

    if (type === 'text') {
        endpoint_url = 'send-text';
        body = JSON.stringify({
            phone: number,
            message: txt,
            delayMessage: 1,
        });
    }

    if(type === 'image'){
        endpoint_url = 'send-image';
        body = JSON.stringify({
            phone: number,
            image: txt,
            delayMessage: 1
        });
    }

    if(type === 'video'){
        endpoint_url = 'send-video';
        body = JSON.stringify({
            phone: number,
            video: txt,
            delayMessage: 1
        });
    }

    console.log('🔗 URL:', endpoint_url);
    console.log('📄 Corpo da requisição:', body);
    

    const url = `https://${process.env.HOST}/v1/message/${endpoint_url}?instanceId=${process.env.INSTANCE_ID}`;

    try {
        console.log(`📩 Enviando mensagem para ${number}: "${txt}"`);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.AUTH_TOKEN}`
            },
            body,
        });

        console.log('🚀 Resposta da API:', response.status, response.statusText);

        if (response.status !== 200) {
            throw new Error(`Erro na API: ${response.status} - ${response.statusText}`);
        }

        return response.status;

    } catch (error) {
        console.error('❌ Erro ao enviar mensagem:', error.message);
        return { error: error.message };
    }
}


//run the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
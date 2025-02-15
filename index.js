const express = require('express');
const Redis = require('ioredis');
const app = express();
require('dotenv').config();
const { kv } =  require('@vercel/kv');

const { createMessage } = require('./utils/messages');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const redis = new Redis(process.env.REDIS_URL);

app.get('/', async (req, res) => {
    await redis.set('hello', 'world');
    // const remove = await redis.del('session:555496126100');
    const value = await redis.get('session:555496126100');
    console.log('Valor do Redis:', value);
    res.send('Olá, mundo!');
});

app.post('/', async (req, res) => {
    const data = req.body;

    if (data.body && data.body.message) {
        const itsAGroupMsm = data.body.key.participant ? true : false;
        if (itsAGroupMsm){
            return res.send('Dados recebidos com sucesso!');
        }

        const message = data.body.message;
        const nameOfContact = data.body.pushName;
        let notFormatedNumber = data.body.key.remoteJid;
        const numberFrom = notFormatedNumber.match(/\d+/)[0];
        const receivedMessage = message.conversation;

        const timestamp = Date.now();     

        let session = await redis.get(`session:${numberFrom}`);

        if (!session) {
            session = {
                step: 1,
                context: {
                    motherName: nameOfContact,
                },
                finished: false,
                timestamp: timestamp
            }
            await redis.set(`session:${numberFrom}`, JSON.stringify(session));
        } else {
            session = JSON.parse(session); 
        }

        const timeDifferenceMs = timestamp - Number(session.timestamp);
        const timeDifferenceSeconds = timeDifferenceMs / 1000;

        const timeLimit = 5; // 5 seconds
        if (timeDifferenceSeconds < timeLimit) {
            console.log('Mensagem recebida muito rapidamente, ignorando...');
            return res.sendStatus(200);
        }

        session.timestamp = timestamp;
        await redis.set(`session:${numberFrom}`, JSON.stringify(session)); //
        

        if(session.finished){
            console.log('Session finished');
            return res.sendStatus(200);
        }
        
        if(session.step === 2){
            session.context.daughterName = receivedMessage;
        }
        if(session.step === 3){
            const regex = /(\d{2}\/\d{2}\/\d{4})/g;
            const match = receivedMessage.match(regex);
            if(match){
                session.context.birthDate = match[0];
                let bornYear = match[0].split('/')[2];
                session.context.bornYear = bornYear;
                if(bornYear === '2023' || bornYear === '2024'){
                    session.context.ageGroup = 'A';
                }
                else if(bornYear === '2021' || bornYear === '2022'){
                    session.context.ageGroup = 'B';
                }
                else if(bornYear === '2019' || bornYear === '2020'){
                    session.context.ageGroup = 'C';
                }
                else if(bornYear === '2017' || bornYear === '2018'){
                    session.context.ageGroup = 'D';
                }
                else if(bornYear === '2015' || bornYear === '2016'){
                    session.context.ageGroup = 'E';
                }
                else if(bornYear === '2013' || bornYear === '2014'){
                    session.context.ageGroup = 'E';
                }
                else{
                    session.context.ageGroup = 'E';
                }

            }else{
                console.log('Data de nascimento não encontrada');
                return res.sendStatus(200);
            }
        }

        const createdMessages = createMessage(session);
        
        createdMessages[0].messages.forEach((msg) => {
            let timeToWait = index * 5000;
            setTimeout(() => {
                sendMessage(msg.content.text, numberFrom);
            }
            , timeToWait);
        });

        if (createdMessages[0].status === 200) {
            session.step++;
        }
        if (createdMessages[0].status === 2000) {
            session.finished = true;
        }

        await redis.set(`session:${numberFrom}`, JSON.stringify(session));
        return res.sendStatus(200);
    
    }

    res.send('No datas available');
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});


async function sendMessage(txt, number) {
    let body = {
        "phoneNumber": number,
        "text": txt,
        "delayMessage": 1   
    };

    let url = `https://host01.serverapi.dev/message/send-text?connectionKey=w-api_BK3XGHUITI`;

    try {
        console.log(`Enviando mensagem para ${number}: "${txt}"`);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ktKO4qZSnyro5u8WSHnT0hpD7XCIMeVgv'
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        console.log("Resposta da API:", data);
        return data;
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
    }
}

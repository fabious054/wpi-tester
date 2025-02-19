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

    const remove = await redis.del('session:555496126100');
    const value = await redis.get('session:555496126100');
    console.log('Valor do Redis:', value);
    res.send('Olá, mundo!');
});

app.post('/', async (req, res) => {
    const data = req.body;
    console.log("Data recebida:", data);
    if (data) {
        if (data.isGroup) {
            return res.send('Received message is from a group, ignoring...');
        }

        if(data.fromMe){
            return res.send('Received message is from me, ignoring...');
        }

        const nameOfContact = data.sender.pushName;
        const numberFrom = data.sender.id
        const receivedMessage = data.msgContent.conversation;

        if(numberFrom !== '555496126100'){
            console.log('Número não autorizado');
            return res.sendStatus(200);
        }

        let session = await redis.get(`session:${numberFrom}`);

        if (!session) {
            session = {
                step: 1,
                context: {
                    motherName: nameOfContact,
                },
                finished: false,
            }
            await redis.set(`session:${numberFrom}`, JSON.stringify(session));
        } else {
            session = JSON.parse(session); 
        }

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
        let apiWorked = true;
        
        createdMessages[0].messages.forEach((msg,index) => {
            let apireturn = sendMessage(msg.content.text, numberFrom);
            if(apireturn.erro ){
                console.log('Erro ao enviar mensagem');
                apiWorked = false;
                return;
            }
        });

        if (apiWorked && createdMessages[0].status === 200) {
            session.step++;
        }
        if (apiWorked && createdMessages[0].status === 2000) {
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


function sendMessage(txt, number) {
    if (!process.env.HOST || !process.env.INSTANCE_ID || !process.env.AUTH_TOKEN) {
        console.error('❌ Variáveis de ambiente ausentes.');
        return { error: "Configuração inválida." };
    }

    const body = JSON.stringify({
        phone: number,
        message: txt,
        delayMessage: 1,
    });

    const url = `https://${process.env.HOST}/v1/message/send-text?instanceId=${process.env.INSTANCE_ID}`;

    try {
        console.log(`📩 Enviando mensagem para ${number}: "${txt}"`);

        const response = fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.AUTH_TOKEN}`
            },
            body,
        });

        console.log('🚀 Resposta da API:', response.status, response.statusText);

        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status} - ${response.statusText}`);
        }

        const data = response.json();
        console.log("✅ Resposta da API:", data);
        return data;

    } catch (error) {
        console.error('❌ Erro ao enviar mensagem:', error.message);
        return { error: error.message };
    }
}
const createTextMessage = (text) => ({
    type: 'text',
    content: { text: text }
});

// Helper para criar mensagens de vídeo
const createVideoMessage = (url) => ({
    type: 'video',
    content: { text: url }
});

const createImageMessage = (url) => ({
    type: 'image',
    content: { text: url }
});

const createMessage = (session) => {
    var allReturnMessages = [];

    switch (session.step) {
        case 1:
            allReturnMessages.push({
                status: 200,
                messages: [
                    createTextMessage(`🩰 Oi Mãelarina ${session.context.motherName}, tudo bem com você? Seja bem-vinda ao atendimento mágico do Reino Encantado do Ballet! 🏰✨\nVocê pode me dizer o nome completo da sua filha?`),
                ]
            });
            break;

        case 2:
            allReturnMessages.push({
                status: 200,
                messages: [
                    createTextMessage(`Preciso também, por gentileza, da data de nascimento dela. Assim consigo verificar se há disponibilidade de vagas em nossa escola para ela🏰`),
                ]
            });
            break;

        case 3:
            let ageGroup = session.context.ageGroup;
            switch (ageGroup) {
                case 'A':
                    allReturnMessages.push({
                        status: 200,
                        messages: [
                            createTextMessage(`Já pensou em um momento mágico para dançarem juntas e descobrirem o encantador Mundo do Ballet? 🩰 Temos um programa exclusivo para bebês, com duas turmas especialíssimas:\n\n
💖 Dance Comigo para Engatinhantes (6 meses a 1 ano)\n
💖 Dance Comigo para Andantes (1 a 2 anos)\n\n
Uma oportunidade única de combinar o desenvolvimento infantil com lindas memórias afetivas aqui no Reino Encantado do Ballet! 🏰\n\n
✨ Quer saber mais sobre como criamos essa experiência exclusiva e encantadora para mães e bebês❓
`)
                        ]
                    });
                    break;
                case 'B':
                case 'C':
                case 'D':
                    allReturnMessages.push({
                        status: 200,
                        messages: [
                            createTextMessage(`✨ A ${session.context.daughterName} vai amar fazer parte do nosso Reino Encantado do Ballet, um espaço que combina encanto, amor e qualidade pedagógica, reconhecido nacional e internacionalmente 🇧🇷🏆\n\n
Aqui estão alguns dos nossos diferenciais encantadores:\n
🎀 Ensino exclusivo de Ballet Infantil, reconhecido mundialmente 🇺🇸🇬🇧🇦🇺🇵🇹\n
👩‍🏫 Atendimento direto com a Prof. Flávia, uma especialista com 6 graduações, 4 formações internacionais e mais de 10 anos de experiência\n
🏰 Espaço temático e lúdico, projetado para estimular o desenvolvimento infantil com amor e criatividade\n
📚 Projetos pedagógicos inovadores, que promovem o aprendizado global e o desenvolvimento integral da sua filha\n
💖 Foco exclusivo em crianças e suas famílias, criando vínculos e memórias afetivas únicas\n
👮‍♀ Segurança e estacionamento, para que sua experiência aqui seja tranquila e mágica\n\n
Olha só esse vídeo encantador que preparamos para você❗
`),
                            createVideoMessage('https://fabious054.github.io/ballet-midias/videos/ballet-school-movie.mp4'),
                            createTextMessage(`Me conta, ${session.context.motherName}, como vocês conheceram o nosso Reino Encantado e o que você espera do Ballet para a ${session.context.daughterName}❓\n\n
Dessa forma, vamos entender melhor as necessidades da sua família e oferecer as soluções mais exclusivas e encantadoras que só o nosso Reino pode proporcionar. Mal posso esperar para saber mais sobre vocês! 🩰✨
                                `)
                        ]
                    });
                    break;
                case 'E':
                    allReturnMessages.push({
                        status: 2000,
                        messages: [
                            createTextMessage(`Obrigada por entrar em contato conosco e por considerar o Reino Encantado do Ballet para sua filha! 🏰🩰\n\nMas nossa escola é especializada em atender apenas crianças de até 8 anos, com atividades cuidadosamente desenvolvidas para essa faixa etária. Agradecemos seu interesse e desejamos muito sucesso na jornada da sua pequena na dança!\n\nCom carinho,\nEquipe Reino Encantado do Ballet`),
                        ]
                    });
                    break;
                default:
                    break;
            }
            break;

        case 4:
            switch (session.context.ageGroup) {
                case 'A':
                    allReturnMessages.push({
                        status: 200,
                        messages: [
                            createTextMessage(`✨ Por que o nosso Dance Comigo é exclusivo e encantador?\n\n
🩰 Método próprio de dança para bebês, que respeita o ritmo natural de cada criança, estimulando a motricidade, coordenação e percepção espacial de forma lúdica e afetiva\n
💖 Conexão profunda mãe e filha, criando memórias afetivas ao som da música e do movimento, com um ensino especializado que foca no desenvolvimento cognitivo, emocional e sensorial\n
🏰 Ambiente mágico e seguro, projetado para estimular conforto, criatividade e aprendizado\n
👩🏼‍🏫 Ensino exclusivo e atendimento especializado, com métodos reconhecidos internacionalmente, oferecido pela Prof. Flávia, com mais de 10 anos de experiência\n
📚 Projetos pedagógicos inovadores, que promovem o aprendizado desde cedo, respeitando cada fase do bebê\n
👮‍♀ Segurança e estacionamento, garantindo uma experiência tranquila e mágica para sua família\n\n
Olha só o vídeo encantador que preparamos para você❗`),
                            createVideoMessage('https://fabious054.github.io/ballet-midias/videos/ballet-school-movie.mp4'),
                            createTextMessage(`Me conta, ${session.context.motherName}, como vocês conheceram o nosso Reino Encantado e o que você espera do Ballet para a ${session.context.daughterName}❓\n\n
Dessa forma, vamos entender melhor as necessidades da sua família e oferecer as soluções mais exclusivas e encantadoras que só o nosso Reino pode proporcionar. Mal posso esperar para saber mais sobre vocês! 🩰✨
`)
                        ]
                    });
                break;

                case 'B':
                    allReturnMessages.push({
                        status: 200,
                        messages: [
                            createTextMessage(` Que bacana! Vocês vão adorar a experiência do nosso Reino Encantado do Ballet, é um verdadeiro Conto de Fadas 🧚‍♀💕\n\n
Vou te enviar a nossa planilha com os horários disponíveis para cada grupo. As turmas são divididas pelo ano de nascimento. O grupo dela é o de cor AZUL 🩵\n\n
Aqui estão algumas fotos das crianças da mesma idade dela, se divertindo e aprendendo nas aulas!\n\n
Qual dessas opções combina melhor com a rotina da sua família❓`),
                            createImageMessage('https://fabious054.github.io/ballet-midias/images/kid-blue.jpg'),
                            createImageMessage('https://fabious054.github.io/ballet-midias/images/teacher-and-kids-blue.jpg'),
                            createImageMessage('https://fabious054.github.io/ballet-midias/images/classes.jpg'),
                        ]
                    });
                break;

                case 'C':
                    allReturnMessages.push({
                        status: 200,
                        messages: [
                            createTextMessage(`Que bacana! Vocês vão adorar a experiência do nosso Reino Encantado do Ballet, é um verdadeiro Conto de Fadas 🧚‍♀💕\n\n
Vou te enviar a nossa planilha com os horários disponíveis para cada grupo. As turmas são divididas pelo ano de nascimento. O grupo dela é o de cor LILÁS 💜\n\n
Aqui estão algumas fotos das crianças da mesma idade dela, se divertindo e aprendendo nas aulas!\n\n
Qual dessas opções combina melhor com a rotina da sua família❓`),
                            createImageMessage('https://fabious054.github.io/ballet-midias/images/kid-lilac.jpg'),
                            createImageMessage('https://fabious054.github.io/ballet-midias/images/teacher-and-kids-lilac.jpg'),
                            createImageMessage('https://fabious054.github.io/ballet-midias/images/classes.jpg'),
                        ]
                    });
                break;
                case 'D':
                    allReturnMessages.push({
                        status: 200,
                        messages: [
                            createTextMessage(`Que bacana! Vocês vão adorar a experiência do nosso Reino Encantado do Ballet, é um verdadeiro Conto de Fadas 🧚‍♀💕\n\n
Vou te enviar a nossa planilha com os horários disponíveis para cada grupo. As turmas são divididas pelo ano de nascimento. O grupo dela é o de cor ROSA 🩷\n\n
Aqui estão algumas fotos das crianças da mesma idade dela, se divertindo e aprendendo nas aulas!\n\n
Qual dessas opções combina melhor com a rotina da sua família❓`),
                            createImageMessage('https://fabious054.github.io/ballet-midias/images/kid-pink.jpg'),
                            createImageMessage('https://fabious054.github.io/ballet-midias/images/teacher-and-kids-pink.jpg'),
                            createImageMessage('https://fabious054.github.io/ballet-midias/images/classes.jpg'),
                        ]
                    });
                break;
            }
            
        break;
        case 5:
            switch (session.context.ageGroup) {
                case 'A':
                    allReturnMessages.push({
                        status: 200,
                        messages: [
                            createTextMessage(`Que bacana! Vocês vão adorar a experiência do nosso Reino Encantado do Ballet, é um verdadeiro Conto de Fadas 🧚‍♀💕\n\nVou te enviar a nossa planilha com os horários disponíveis para cada grupo. As turmas são divididas pelo ano de nascimento. O grupo dela é o de cor AMARELO 💛\n\nAqui estão algumas fotos das crianças da mesma idade dela, se divertindo e aprendendo nas aulas!\n\nQual dessas opções combina melhor com a rotina da sua família❓`),
                            createImageMessage('../assets/images/table.jpg'),
                            createImageMessage('../assets/images/mother-with-children.jpg')
                        ]
                    });
                break;
                case 'B':
                case 'C':
                case 'D':
                    allReturnMessages.push({
                        status: 2000,
                        messages: [
                            createTextMessage(`Acabei de conferir aqui e as vagas para esse grupo estão quase esgotando! Temos apenas 2 vagas disponíveis ❌ e elas estão sendo preenchidas rapidamente.\n\nVou te enviar nossas condições exclusivas. Qual desses Planos você prefere❓`),
                            createImageMessage('../assets/images/planes.jpg'),
                        ]
                    });
                break;
            }
        break;
        
        case 6:
            switch(session.context.ageGroup) {
                case 'A':
                    allReturnMessages.push({
                        status: 2000,
                        messages: [
                            createTextMessage(`Acabei de conferir aqui e as vagas para esse grupo estão quase esgotando! Temos apenas 2 vagas disponíveis ❌ e elas estão sendo preenchidas rapidamente.\n\nVou te enviar nossas condições exclusivas. Qual desses Planos você prefere❓`),
                            createImageMessage('../assets/images/planes.jpg'),
                        ]
                    });
                break;
            }
        break;

        default:
            allReturnMessages.push({
                status: 400,
                messages: [createTextMessage('Invalid step.')]
            });
            break;
    }

    return allReturnMessages;
}

exports.createMessage = createMessage;
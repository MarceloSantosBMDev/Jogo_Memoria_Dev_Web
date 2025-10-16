document.addEventListener('DOMContentLoaded', () => {

    const botaodeStart = document.getElementById('start-game-btn');
    const botaoSelect = document.getElementById('select-game-btn');
    const setinha = document.querySelectorAll('.d-pad-btn');

    const TituloTela = document.getElementById('screen-main-title');
    const opcaoTela = document.getElementById('screen-option-display');
    const dicaTela = document.getElementById('screen-hint-text');

    const modo_de_jogo = [
        { name: 'Clássico', description: 'Jogue sem limite de tempo.' },
        { name: 'Contra o Tempo', description: 'Corra para encontrar todos os pares!' }
    ];
    const dificuldades = [
        { name: 'Iniciais', size: '4x4', gamePage: 'game-initial.html' },
        { name: 'Fortes', size: '6x6', gamePage: 'game-strong.html' },
        { name: 'Lendários', size: '8x8', gamePage: 'game-legendary.html' }
    ];

    let PassoAtual = "EscolherModo";
    let ModoEscolhido = 0;
    let dificuldade_escolhida = 0;

    function desenharNaTela() {
        opcaoTela.innerHTML = '';
        if (PassoAtual == "EscolherModo") {
            TituloTela.textContent = "Escolha o Modo";
            const ModoEscolhidoAtual = modo_de_jogo[ModoEscolhido];
            opcaoTela.innerHTML = `<p class="selectable-option">&lt; ${ModoEscolhidoAtual.name} &gt;</p>`;
            dicaTela.textContent = "Pressione Select para confirmar ou use as setas para mudar";
            botaoSelect.classList.remove('disabled');
            botaodeStart.classList.add('disabled');
        } else if (PassoAtual == "EscolherDificuldade") {
            TituloTela.textContent = "Escolher a Dificuldade";
            const dificuldadeAtual = dificuldades[dificuldade_escolhida];
            opcaoTela.innerHTML = `<p class="selectable-option">&lt; ${dificuldadeAtual.name} &gt;</p>`;
            dicaTela.textContent = `Tamanho do Jogo: ${dificuldadeAtual.size}`
            botaoSelect.classList.remove('disabled');
            botaodeStart.classList.add('disabled');
        } else if (PassoAtual == "ConfirmarJogo") {
            const ModoEscolhidoo = modo_de_jogo[ModoEscolhido];
            const dificuldadeEscolhida = dificuldades[dificuldade_escolhida];
            TituloTela.textContent = "Tudo Pronto?";
            opcaoTela.innerHTML = `
                <div class="summary-screen">
                    <p>Modo: <span>${ModoEscolhidoo.name}</span></p>
                    <p>Dificuldade: <span>${dificuldadeEscolhida.name}</span></p>
                </div>`;
            dicaTela.textContent = 'Pressione Start para jogar ou SELECT para voltar';
            botaoSelect.classList.remove('disabled');
            botaodeStart.classList.remove('disabled');
        }
    }

    // setinhas
    setinha.forEach(seta => {
        seta.addEventListener('click', () => {
            const direcao = seta.dataset.direction;
            

            if (PassoAtual == "EscolherModo") {
                if (direcao === 'right') ModoEscolhido = (ModoEscolhido + 1) % modo_de_jogo.length;
                if (direcao === 'left') ModoEscolhido = (ModoEscolhido - 1 + modo_de_jogo.length) % modo_de_jogo.length;
            
            } else if (PassoAtual == "EscolherDificuldade") {
                if (direcao === 'right') dificuldade_escolhida = (dificuldade_escolhida + 1) % dificuldades.length;
                if (direcao === 'left') dificuldade_escolhida = (dificuldade_escolhida - 1 + dificuldades.length) % dificuldades.length;
            }

            desenharNaTela();
        });
    });
    
    botaoSelect.addEventListener('click', () => {
        if (PassoAtual == "EscolherModo") {
            PassoAtual = "EscolherDificuldade";
        } else if (PassoAtual == "EscolherDificuldade") {
            PassoAtual = "ConfirmarJogo";
        } else if (PassoAtual == "ConfirmarJogo") {
            PassoAtual = "EscolherModo";
            ModoEscolhido = 0;
            dificuldade_escolhida = 0;
        }
        desenharNaTela();
    });

botaodeStart.addEventListener('click', () => {
        if (PassoAtual === "ConfirmarJogo") {
            const dificuldadeInfo = dificuldades[dificuldade_escolhida];
            alert(`Iniciando o jogo: ${modo_de_jogo[ModoEscolhido].name} - ${dificuldadeInfo.name}`);
            window.location.href = dificuldadeInfo.gamePage;
        }
    });
desenharNaTela();
});

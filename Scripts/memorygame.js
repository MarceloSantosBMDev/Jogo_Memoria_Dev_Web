const urlParams = new URLSearchParams(window.location.search);
const modoDificuldade = parseInt(urlParams.get("modo_dificuldade")) || 0;
const modoEscolha = parseInt(urlParams.get("modo_escolha")) || 0;

const config = {
  0: { tamanho: 2, pares: 2, tempo: 30, tempoVisualizacao: 3 },
  1: { tamanho: 4, pares: 8, tempo: 90, tempoVisualizacao: 5 },
  2: { tamanho: 6, pares: 18, tempo: 180, tempoVisualizacao: 8 },
  3: { tamanho: 8, pares: 32, tempo: 300, tempoVisualizacao: 12 },
};

const configuracao = config[modoDificuldade];

// Sprites
const imagensPokemonBase = [
  "../GameSprites/pokemon1.gif",
  "../GameSprites/pokemon2.gif",
  "../GameSprites/pokemon3.gif",
  "../GameSprites/pokemon4.gif",
  "../GameSprites/pokemon5.gif",
  "../GameSprites/pokemon6.gif",
  "../GameSprites/pokemon7.gif",
  "../GameSprites/pokemon8.gif",
  "../GameSprites/pokemon9.gif",
  "../GameSprites/pokemon10.gif",
  "../GameSprites/pokemon11.gif",
  "../GameSprites/pokemon12.gif",
  "../GameSprites/pokemon13.gif",
  "../GameSprites/pokemon14.gif",
  "../GameSprites/pokemon15.gif",
  "../GameSprites/pokemon16.gif",
  "../GameSprites/pokemon17.gif",
  "../GameSprites/pokemon18.gif",
  "../GameSprites/pokemon19.gif",
  "../GameSprites/pokemon20.gif",
  "../GameSprites/pokemon21.gif",
  "../GameSprites/pokemon22.gif",
  "../GameSprites/pokemon23.gif",
  "../GameSprites/pokemon24.gif",
  "../GameSprites/pokemon25.gif",
  "../GameSprites/pokemon26.gif",
  "../GameSprites/pokemon27.gif",
  "../GameSprites/pokemon28.gif",
  "../GameSprites/pokemon29.gif",
  "../GameSprites/pokemon30.gif",
  "../GameSprites/pokemon31.gif",
  "../GameSprites/pokemon32.gif",
];

// Placeholder
function gerarPlaceholderCarta(indice) {
  const cores = [
    "#f94144",
    "#f3722c",
    "#f8961e",
    "#f9844a",
    "#f9c74f",
    "#90be6d",
    "#43aa8b",
    "#577590",
    "#277da1",
    "#4d908e",
  ];
  const cor = cores[indice % cores.length];
  const texto = `P${indice + 1}`;
  const svg = `<?xml version="1.0" encoding="UTF-8"?>\
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">\
  <defs>\
    <linearGradient id="g${indice}" x1="0" y1="0" x2="1" y2="1">\
      <stop offset="0%" stop-color="${cor}"/>\
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.15"/>\
    </linearGradient>\
  </defs>\
  <circle cx="100" cy="100" r="100" fill="url(#g${indice})"/>\
  <circle cx="100" cy="100" r="64" fill="rgba(255,255,255,0.25)"/>\
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Poppins, Arial" font-size="48" font-weight="700" fill="#1f2430">${texto}</text>\
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

let cartas = [];
let cartasViradas = [];
let paresEncontrados = 0;
let jogadas = 0;
let tempoRestante = configuracao.tempo;
let timerInterval = null;
let jogoIniciado = false;
let jogoBloqueado = false;

const gameTable = document.querySelector(".game-table");
const gameTitle = document.querySelector(".game-title");
const gameDescription = document.querySelector(".game-description");

function exibirPopup(titulo, mensagem, tipo) {
  // Define as cores do header baseado no tipo
  const headerColors = {
    win: "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)",
    lose: "linear-gradient(135deg, #e53935 0%, #b71c1c 100%)",
    cheat: "linear-gradient(135deg, #ffb300 0%, #ff9800 100%)",
  };

  const overlay = document.createElement("div");
  overlay.className = "popup-overlay";

  const popup = document.createElement("div");
  popup.className = `popup-container ${tipo}`;

  // Aplica a cor do header dinamicamente
  const headerColor = headerColors[tipo] || headerColors.info;
  popup.style.setProperty("--header-color", headerColor);

  // Cria o elemento ::before dinamicamente usando um style inline
  const style = document.createElement("style");
  style.textContent = `
      .popup-container.${tipo}::before {
        background: ${headerColor};
      }
    `;
  document.head.appendChild(style);

  const titleEl = document.createElement("h3");
  titleEl.className = "popup-title";
  titleEl.textContent = titulo;

  const messageEl = document.createElement("p");
  messageEl.className = "popup-message";
  messageEl.innerHTML = mensagem;

  const closeBtn = document.createElement("button");
  closeBtn.className = "popup-button";
  closeBtn.textContent = "Fechar";
  closeBtn.onclick = () => {
    overlay.remove();
    style.remove(); // Remove o style quando fechar
  };

  popup.appendChild(titleEl);
  popup.appendChild(messageEl);
  popup.appendChild(closeBtn);
  overlay.appendChild(popup);
  document.body.appendChild(overlay);
}

// Inicializar o jogo
function inicializarJogo() {
  configurarInterface();
  criarCartas();
  renderizarTabuleiro();
  criarBotoesControle();
}

// Criar botões de controle (unificados)
function criarBotoesControle() {
  const containerBotoes = document.getElementById("container-botoes");

  // Limpar container
  containerBotoes.innerHTML = "";

  // Criar botão principal
  const btnPrincipal = document.createElement("button");
  btnPrincipal.id = "btn-principal";
  btnPrincipal.textContent = jogoIniciado ? "Reiniciar Jogo" : "Iniciar Jogo";
  btnPrincipal.className = "nav-link start";
  btnPrincipal.style.cssText = `
		cursor: url('../image/pointer.png') 8 8, pointer;
		margin: 10px 0;
		font-size: 1.2rem;
		padding: 15px 40px;
		background: ${jogoIniciado ? "#ff9800" : "#4caf50"};
		border-color: ${jogoIniciado ? "#f57c00" : "#2e7d32"};
	`;

  if (!jogoIniciado) {
    btnPrincipal.addEventListener("click", iniciarJogoComVisualizacao);
  } else {
    btnPrincipal.addEventListener("click", reiniciarJogo);
  }

  containerBotoes.appendChild(btnPrincipal);

  // Criar botão de leaderboard (sempre visível)
  const btnLeaderboard = document.createElement("a");
  btnLeaderboard.id = "btn-leaderboard";
  btnLeaderboard.href = "leaderboard.php";
  btnLeaderboard.textContent = "Leaderboard";
  btnLeaderboard.className = "nav-link leaderboard";
  btnLeaderboard.style.cssText = `
		cursor: url('../image/pointer.png') 8 8, pointer;
		margin: 10px 0;
		font-size: 1.2rem;
		padding: 15px 40px;
		display: inline-block;
		text-decoration: none;
	`;

  containerBotoes.appendChild(btnLeaderboard);
}

// Iniciar jogo com visualização das cartas
function iniciarJogoComVisualizacao() {
  const btnPrincipal = document.getElementById("btn-principal");
  const cheatButton = document.getElementById("cheat-button");

  if (btnPrincipal) {
    btnPrincipal.disabled = true;

    btnPrincipal.textContent = "Memorizando...";

    btnPrincipal.style.background = "#9e9e9e";
    btnPrincipal.style.borderColor = "#777777ff";
  }

  jogoBloqueado = true;

  // Mostrar todas as cartas temporariamente
  cartas.forEach((carta) => {
    carta.virada = true;
  });
  renderizarTabuleiro();

  // Contagem regressiva
  let tempoRestanteVisualizacao = configuracao.tempoVisualizacao;

  const intervaloContagem = setInterval(() => {
    tempoRestanteVisualizacao--;
    if (btnPrincipal) {
      btnPrincipal.textContent = `Memorizando... ${tempoRestanteVisualizacao}s`;
    }

    if (tempoRestanteVisualizacao <= 0) {
      clearInterval(intervaloContagem);

      // Esconder todas as cartas
      cartas.forEach((carta) => {
        carta.virada = false;
      });
      renderizarTabuleiro();

      // Atualizar botão para "Reiniciar Jogo"
      if (btnPrincipal) {
        btnPrincipal.disabled = false;
        cheatButton.disabled = false;

        btnPrincipal.textContent = "Reiniciar Jogo";
        cheatButton.textContent = "Trapacear";

        btnPrincipal.style.background = "#ff9800";
        btnPrincipal.style.borderColor = "#f57c00";
        cheatButton.style.background = "";
        cheatButton.style.borderColor = "";

        btnPrincipal.removeEventListener("click", iniciarJogoComVisualizacao);
        btnPrincipal.addEventListener("click", reiniciarJogo);
      }

      // Liberar jogo
      jogoBloqueado = false;
      jogoIniciado = true;

      // Iniciar timer se for modo contra o tempo
      if (modoEscolha === 1) {
        iniciarTimer();
      }
    }
  }, 1000);
}

// Configurar interface baseada no modo
function configurarInterface() {
  const modoTexto = modoEscolha === 0 ? "Clássico" : "Contra o Tempo";
  const dificuldadeTexto = [
    "Iniciante (2x2)",
    "Fácil (4x4)",
    "Médio (6x6)",
    "Difícil (8x8)",
  ][modoDificuldade];

  gameTitle.textContent = `Memory Game - ${modoTexto}`;

  let descricao = `Modo: ${modoTexto} | Dificuldade: ${dificuldadeTexto}`;

  if (modoEscolha === 1) {
    descricao += ` | Tempo: <span id="timer">${formatarTempo(
      tempoRestante,
    )}</span>`;
  } else {
    descricao += ` | Jogadas: <span id="jogadas">0</span>`;
  }

  gameDescription.innerHTML = descricao;

  // Aplicar classe do grid baseada no tamanho
  gameTable.className = `game-table grid-${configuracao.tamanho}`;
}

function criarCartas() {
  const totalParesNecessarios = configuracao.pares;

  const imagensSelecionadas = imagensPokemonBase.slice(
    0,
    Math.min(imagensPokemonBase.length, totalParesNecessarios),
  );

  const faltantes = totalParesNecessarios - imagensSelecionadas.length;
  for (let i = 0; i < faltantes; i++) {
    imagensSelecionadas.push(gerarPlaceholderCarta(i));
  }

  const paresDeCartas = [...imagensSelecionadas, ...imagensSelecionadas];

  cartas = paresDeCartas
    .map((imagem, index) => ({
      id: index,
      imagem,
      virada: false,
      encontrada: false,
    }))
    .sort(() => Math.random() - 0.5);
}

// Renderizar tabuleiro de acordo com tamanho
function renderizarTabuleiro() {
  gameTable.innerHTML = "";

  cartas.forEach((carta, index) => {
    const cell = document.createElement("div");
    cell.className = "game-cell";
    cell.dataset.index = index;

    if (carta.encontrada) {
      cell.classList.add("matched");
    }

    if (carta.virada || (cheatVisualizacaoAtiva && !carta.encontrada)) {
      cell.classList.add("flipped");
    }

    if (cheatVisualizacaoAtiva && !carta.virada && !carta.encontrada) {
      cell.classList.add("cheat-mode");
    }

    if (carta.virada || carta.encontrada || cheatVisualizacaoAtiva) {
      const img = document.createElement("img");
      img.src = carta.imagem;
      img.className = "card-image";
      img.alt = "Carta";
      cell.appendChild(img);
    }

    cell.addEventListener("click", () => virarCarta(index));
    gameTable.appendChild(cell);
  });
}

function virarCarta(index) {
  if (!jogoIniciado) return;
  if (jogoBloqueado) return;

  const carta = cartas[index];

  if (carta.virada || carta.encontrada) return;

  if (cartasViradas.length >= 2) return;

  carta.virada = true;
  cartasViradas.push(index);
  renderizarTabuleiro();

  if (cartasViradas.length === 2) {
    jogoBloqueado = true;
    verificarPar();
  }
}

function verificarPar() {
  const [index1, index2] = cartasViradas;
  const carta1 = cartas[index1];
  const carta2 = cartas[index2];

  if (modoEscolha === 0) {
    jogadas++;
    document.getElementById("jogadas").textContent = jogadas;
  }

  setTimeout(() => {
    if (carta1.imagem === carta2.imagem) {
      // Par encontrado
      carta1.encontrada = true;
      carta2.encontrada = true;
      paresEncontrados++;

      // Verificar vitória
      if (paresEncontrados === configuracao.pares) {
        vitoria();
      }
    } else {
      // Não é par, desvirar cartas
      carta1.virada = false;
      carta2.virada = false;
    }

    cartasViradas = [];
    jogoBloqueado = false;
    renderizarTabuleiro();
  }, 800);
}

// Timer para modo contra o tempo
function iniciarTimer() {
  timerInterval = setInterval(() => {
    tempoRestante--;
    const timerElement = document.getElementById("timer");
    if (timerElement) {
      timerElement.textContent = formatarTempo(tempoRestante);
    }

    if (tempoRestante <= 0) {
      derrota();
    }
  }, 1000);
}

function formatarTempo(segundos) {
  const minutos = Math.floor(segundos / 60);
  const segs = segundos % 60;
  return `${minutos.toString().padStart(2, "0")}:${segs
    .toString()
    .padStart(2, "0")}`;
}
async function salvarResultadoNoBanco(dadosJogo) {
  try {
    const user_id = typeof currentUserId !== "undefined" ? currentUserId : null;

    if (!user_id) {
      throw new Error("ID do usuário não disponível");
    }

    const dadosComUser = {
      ...dadosJogo,
      user_id: user_id,
    };

    console.log("Enviando dados para servidor:", dadosComUser);

    const response = await fetch("../PHP/save_game.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dadosComUser),
    });

    console.log("Resposta recebida, status:", response.status);

    const textoResposta = await response.text();
    console.log("Resposta bruta:", textoResposta);

    let resultado;
    resultado = JSON.parse(textoResposta);

    console.log("Resposta do servidor:", resultado);

    if (resultado.status === "success") {
      console.log("Jogo salvo com sucesso! ID:", resultado.insert_id);
      return true;
    } else {
      console.error("Falha ao salvar o jogo:", resultado.message);
      alert("Erro ao salvar resultado: " + resultado.message);
      return false;
    }
  } catch (error) {
    console.error("Erro completo ao tentar salvar:", error);
    alert("Erro: " + error.message);
    return false;
  }
}

async function vitoria() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  jogoBloqueado = true;

  let mensagem = "🎉 Parabéns! Você venceu! 🎉\n\n";
  let moves = null;
  let time = null;

  const gameMode = modoEscolha === 0 ? "classico" : "tempo";
  const difficulty = ["2x2", "4x4", "6x6", "8x8"][modoDificuldade];

  if (modoEscolha === 0) {
    moves = jogadas;
    mensagem += `Jogadas: ${jogadas}`;
  } else {
    const tempoGasto = configuracao.tempo - tempoRestante;
    time = tempoGasto;
    mensagem += `Tempo: ${formatarTempo(tempoGasto)}`;
  }

  const dadosParaSalvar = {
    game_mode: gameMode,
    difficulty: difficulty,
    moves: moves,
    time_seconds: time,
    completed: true,
  };

  const salvou = await salvarResultadoNoBanco(dadosParaSalvar);

  if (salvou) {
    setTimeout(() => {
      alert(mensagem);
    }, 500);
  } else {
    setTimeout(() => {
      alert(mensagem + "\n\n(Resultado não foi salvo)");
    }, 500);
  }
}
// Vitória
async function vitoria() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  jogoBloqueado = true;

  let mensagem = "🎉 Parabéns! Você venceu! 🎉\n\n";
  let moves = null;
  let time = null;

  const gameMode = modoEscolha === 0 ? "classico" : "tempo";
  const difficulty = ["2x2", "4x4", "6x6", "8x8"][modoDificuldade];

  if (modoEscolha === 0) {
    moves = jogadas;
    mensagem += `Jogadas: ${jogadas}`;
  } else {
    const tempoGasto = configuracao.tempo - tempoRestante;
    time = tempoGasto;
    mensagem += `Tempo: ${formatarTempo(tempoGasto)}`;
  }

  const dadosParaSalvar = {
    game_mode: gameMode,
    difficulty: difficulty,
    moves: moves,
    time_seconds: time,
    completed: true,
  };

  salvarResultadoNoBanco(dadosParaSalvar);

  setTimeout(() => {
    exibirPopup(
      "Vitória!",
      modoEscolha === 0
        ? `Você venceu o modo clássico com <b>${jogadas}</b> jogadas!`
        : `Você venceu o modo contra o tempo em <b>${formatarTempo(configuracao.tempo - tempoRestante)}</b>!`,
      "win",
    );
  }, 500);
}

function derrota() {
  clearInterval(timerInterval);
  jogoBloqueado = true;

  const gameMode = "tempo";
  const difficulty = ["2x2", "4x4", "6x6", "8x8"][modoDificuldade];
  const tempoGasto = configuracao.tempo;

  const dadosParaSalvar = {
    game_mode: gameMode,
    difficulty: difficulty,
    moves: null,
    time_seconds: tempoGasto,
    completed: false,
  };

  salvarResultadoNoBanco(dadosParaSalvar);

  setTimeout(() => {
    exibirPopup(
      "Derrota!",
      "O tempo acabou! Tente novamente e melhore sua memória.",
      "lose",
    );
  }, 500);
}

// Reiniciar jogo
function reiniciarJogo() {
  const cheatButton = document.getElementById("cheat-button");
  cartas = [];
  cartasViradas = [];
  paresEncontrados = 0;
  jogadas = 0;
  tempoRestante = configuracao.tempo;
  jogoIniciado = false;
  jogoBloqueado = false;

  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  reiniciarTrapaca();
  inicializarJogo();
}

// Modo trapaça
let cheat_mode = 0;
let contador_trapaca = 0;
let cheatVisualizacaoAtiva = false;

// Contador para ativar o modo trapaça
function pressionarBotao() {
  contador_trapaca++;

  if (contador_trapaca >= 3) {
    ativarModoTrapaca();
  }
}

// Ativa o modo após 3 apertos no botão
function ativarModoTrapaca() {
  const cheatButton = document.getElementById("cheat-button");

  if (cheatButton) {
    cheatButton.textContent = "VISUALIZAR";
    cheatButton.style.background = "#4caf50";
    cheatButton.onclick = alternarVisualizacaoTrapaca;
  }

  cheat_mode = 1;
  exibirPopup(
    "Trapaça",
    "Você desbloqueou o modo de trapaça! Clique em <b>VISUALIZAR</b> para ver todas as cartas.",
    "cheat",
  );
}

// Alterna a visualização das cartas para o modo trapaça
function alternarVisualizacaoTrapaca() {
  const cheatButton = document.getElementById("cheat-button");

  cheatVisualizacaoAtiva = !cheatVisualizacaoAtiva;

  if (cheatButton) {
    cheatButton.textContent = cheatVisualizacaoAtiva
      ? "ESCONDER"
      : "VISUALIZAR";
    cheatButton.style.background = cheatVisualizacaoAtiva
      ? "#f44336"
      : "#4caf50";
  }

  renderizarTabuleiro();
}

function reiniciarTrapaca() {
  const cheatButton = document.getElementById("cheat-button");
  if (cheatVisualizacaoAtiva) {
    cheatVisualizacaoAtiva = false;
    renderizarTabuleiro();
  }

  cheat_mode = 0;
  contador_trapaca = 0;

  if (cheatButton) {
    cheatButton.disabled = true;
    cheatButton.onclick = pressionarBotao;
    cheatButton.textContent = "Trapaça";
    cheatButton.style.background = "#9e9e9e";
    cheatButton.style.borderColor = "#777777ff";
  }
}

// Iniciar quando a página carregar
window.addEventListener("DOMContentLoaded", () => {
  inicializarJogo();

  const cheatButton = document.getElementById("cheat-button");

  if (cheatButton) {
    cheatButton.onclick = pressionarBotao;
    cheatButton.disabled = true;
    cheatButton.style.background = "#9e9e9e";
    cheatButton.style.borderColor = "#777777ff";
  }
});

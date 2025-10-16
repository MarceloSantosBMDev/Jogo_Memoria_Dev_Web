const urlParams = new URLSearchParams(window.location.search);
const modoDificuldade = parseInt(urlParams.get("modo_dificuldade")) || 0;
const modoEscolha = parseInt(urlParams.get("modo_escolha")) || 0;

const config = {
	0: { tamanho: 2, pares: 2, tempo: 30, tempoVisualizacao: 3 }, // 2x2 = 4 cartas (2 pares)
	1: { tamanho: 4, pares: 8, tempo: 90, tempoVisualizacao: 5 }, // 4x4 = 16 cartas (8 pares)
	2: { tamanho: 6, pares: 18, tempo: 180, tempoVisualizacao: 8 }, // 6x6 = 36 cartas (18 pares)
	3: { tamanho: 8, pares: 32, tempo: 300, tempoVisualizacao: 12 }, // 8x8 = 64 cartas (32 pares)
};

const configuracao = config[modoDificuldade];

// Sprites
const imagensPokemonBase = [
	"../pokemons/charizard.gif",
	"../pokemons/flareon.gif",
	"../pokemons/glaceon.gif",
	"../pokemons/lugia.gif",
	"../pokemons/mew-runing.gif",
	"../pokemons/umbreon.gif",
	"../pokemons/loading.gif",
	"../pokemons/loadingmew.gif",
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
	btnPrincipal.className = "nav-link";
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
	btnLeaderboard.href = "leaderboard.html";
	btnLeaderboard.textContent = "Leaderboard";
	btnLeaderboard.className = "nav-link";
	btnLeaderboard.style.cssText = `
		cursor: url('../image/pointer.png') 8 8, pointer;
		margin: 10px 0;
		font-size: 1.2rem;
		padding: 15px 40px;
		background: #2196f3;
		border-color: #1976d2;
		display: inline-block;
		text-decoration: none;
	`;

	containerBotoes.appendChild(btnLeaderboard);
}

// Iniciar jogo com visualização das cartas
function iniciarJogoComVisualizacao() {
	const btnPrincipal = document.getElementById("btn-principal");
	if (btnPrincipal) {
		btnPrincipal.disabled = true;
		btnPrincipal.textContent = "Memorizando...";
		btnPrincipal.style.background = "#9e9e9e";
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
				btnPrincipal.textContent = "Reiniciar Jogo";
				btnPrincipal.style.background = "#ff9800";
				btnPrincipal.style.borderColor = "#f57c00";
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
		if (carta.virada) {
			cell.classList.add("flipped");
		}

		if (carta.virada || carta.encontrada) {
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

// Vitória
function vitoria() {
	if (timerInterval) {
		clearInterval(timerInterval);
	}

	jogoBloqueado = true;

	let mensagem = "🎉 Parabéns! Você venceu! 🎉\n\n";

	if (modoEscolha === 0) {
		mensagem += `Jogadas: ${jogadas}`;
	} else {
		const tempoGasto = configuracao.tempo - tempoRestante;
		mensagem += `Tempo: ${formatarTempo(tempoGasto)}`;
	}

	setTimeout(() => {
		alert(mensagem);
	}, 500);
}

// Derrota (apenas no modo contra o tempo)
function derrota() {
	clearInterval(timerInterval);
	jogoBloqueado = true;

	setTimeout(() => {
		alert("⏰ Tempo esgotado! Você perdeu! ⏰");
	}, 500);
}

// Reiniciar jogo
function reiniciarJogo() {
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

	inicializarJogo();
}

// Iniciar quando a página carregar
window.addEventListener("DOMContentLoaded", () => {
	inicializarJogo();
});

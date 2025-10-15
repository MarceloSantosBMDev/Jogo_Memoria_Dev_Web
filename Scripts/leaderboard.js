// Dados de exemplo da leaderboard organizados por modo e tamanho
const leaderboardData = {
  classico: {
    "2x2": [
      { username: "AshKetchum", moves: 12 },
      { username: "MistyWater", moves: 14 },
      { username: "BrockRock", moves: 16 },
      { username: "GaryOak", moves: 18 },
      { username: "ProfessorOak", moves: 20 },
    ],
    "4x4": [
      { username: "Pikachu", moves: 45 },
      { username: "Charizard", moves: 48 },
      { username: "Eevee", moves: 52 },
      { username: "Mewtwo", moves: 55 },
      { username: "TeamRocket", moves: 60 },
    ],
    "8x8": [
      { username: "AshKetchum", moves: 180 },
      { username: "MistyWater", moves: 195 },
      { username: "BrockRock", moves: 210 },
      { username: "GaryOak", moves: 225 },
      { username: "Pikachu", moves: 240 },
    ],
  },
  tempo: {
    "2x2": [
      { username: "GaryOak", time: 15 },
      { username: "AshKetchum", time: 18 },
      { username: "MistyWater", time: 22 },
      { username: "BrockRock", time: 25 },
      { username: "Pikachu", time: 28 },
    ],
    "4x4": [
      { username: "Charizard", time: 95 },
      { username: "Eevee", time: 102 },
      { username: "Mewtwo", time: 110 },
      { username: "TeamRocket", time: 125 },
      { username: "AshKetchum", time: 135 },
    ],
    "8x8": [
      { username: "MistyWater", time: 420 },
      { username: "BrockRock", time: 445 },
      { username: "GaryOak", time: 480 },
      { username: "ProfessorOak", time: 510 },
      { username: "Charizard", time: 540 },
    ],
  },
};

// Estado atual
let currentMode = "classico";
let currentSize = "2x2";

// Função para obter a inicial do nome
function getInitial(username) {
  return username.charAt(0).toUpperCase();
}

// Função para formatar tempo em minutos:segundos
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Função para criar badge de rank
function createRankBadge(rank) {
  let badgeClass = "default";
  let badgeContent = rank;

  if (rank === 1) {
    badgeClass = "gold";
    badgeContent = "🥇";
  } else if (rank === 2) {
    badgeClass = "silver";
    badgeContent = "🥈";
  } else if (rank === 3) {
    badgeClass = "bronze";
    badgeContent = "🥉";
  }

  return `<div class="rank-badge ${badgeClass}">${badgeContent}</div>`;
}

// Função para criar item da leaderboard
function createLeaderboardItem(player, rank) {
  const rankClass = rank <= 3 ? `rank-${rank}` : "";

  let metricValue;
  let metricIcon;

  if (currentMode === "classico") {
    metricValue = player.moves;
    metricIcon = "🎯";
  } else {
    metricValue = formatTime(player.time);
    metricIcon = "⏱️";
  }

  return `
    <div class="leaderboard-item ${rankClass}">
      <div class="rank-column">
        ${createRankBadge(rank)}
      </div>
      
      <div class="username-column">
        <div class="user-avatar">${getInitial(player.username)}</div>
        <span>${player.username}</span>
      </div>
      
      <div class="score-column">
        <div class="score-badge">
          <span class="score-icon">${metricIcon}</span>${metricValue}
        </div>
      </div>
    </div>
  `;
}

// Função para renderizar a leaderboard
function renderLeaderboard() {
  const leaderboardList = document.getElementById("leaderboard-list");
  const metricHeader = document.getElementById("metric-header");

  if (!leaderboardList) {
    console.error("Elemento leaderboard-list não encontrado!");
    return;
  }

  // Atualizar header da métrica
  if (metricHeader) {
    metricHeader.textContent =
      currentMode === "classico" ? "Movimentos" : "Tempo";
  }

  // Obter dados do modo e tamanho atual
  const currentData = leaderboardData[currentMode]?.[currentSize] || [];

  // Ordenar dados
  let sortedData;
  if (currentMode === "classico") {
    // Menor número de movimentos é melhor
    sortedData = [...currentData].sort((a, b) => a.moves - b.moves);
  } else {
    // Menor tempo é melhor
    sortedData = [...currentData].sort((a, b) => a.time - b.time);
  }

  // Verificar se há dados
  if (sortedData.length === 0) {
    leaderboardList.innerHTML = `
      <div class="leaderboard-empty">
        <p>Nenhum jogador ranqueado ainda.</p>
        <p>Seja o primeiro a jogar!</p>
      </div>
    `;
    return;
  }

  // Gerar HTML para cada jogador
  const leaderboardHTML = sortedData
    .map((player, index) => createLeaderboardItem(player, index + 1))
    .join("");

  leaderboardList.innerHTML = leaderboardHTML;
}

// Função para adicionar animação de entrada
function addEntryAnimation() {
  const items = document.querySelectorAll(".leaderboard-item");

  items.forEach((item, index) => {
    item.style.opacity = "0";
    item.style.transform = "translateX(-20px)";

    setTimeout(() => {
      item.style.transition = "all 0.4s ease";
      item.style.opacity = "1";
      item.style.transform = "translateX(0)";
    }, index * 60);
  });
}

// Função para trocar modo
function switchMode(mode) {
  currentMode = mode;

  // Atualizar botões ativos
  document.querySelectorAll(".mode-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  document.querySelector(`[data-mode="${mode}"]`).classList.add("active");

  // Re-renderizar
  renderLeaderboard();
  addEntryAnimation();
}

// Função para trocar tamanho
function switchSize(size) {
  currentSize = size;

  // Atualizar botões ativos
  document.querySelectorAll(".size-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  document.querySelector(`[data-size="${size}"]`).classList.add("active");

  // Re-renderizar
  renderLeaderboard();
  addEntryAnimation();
}

// Função para atualizar a leaderboard (pode ser chamada após um jogo)
function updateLeaderboard(username, value, mode, size) {
  if (!leaderboardData[mode] || !leaderboardData[mode][size]) {
    console.error("Modo ou tamanho inválido");
    return;
  }

  const data = leaderboardData[mode][size];
  const key = mode === "classico" ? "moves" : "time";

  // Verificar se o jogador já existe
  const existingPlayer = data.find((p) => p.username === username);

  if (existingPlayer) {
    // Atualizar valor se for melhor (menor)
    if (value < existingPlayer[key]) {
      existingPlayer[key] = value;
    }
  } else {
    // Adicionar novo jogador
    const newPlayer = { username };
    newPlayer[key] = value;
    data.push(newPlayer);
  }

  // Se for o modo/tamanho atual, re-renderizar
  if (mode === currentMode && size === currentSize) {
    renderLeaderboard();
    addEntryAnimation();
  }
}

// Inicializar quando a página carregar
window.addEventListener("DOMContentLoaded", () => {
  // Adicionar event listeners aos botões
  document.querySelectorAll(".mode-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      switchMode(btn.dataset.mode);
    });
  });

  document.querySelectorAll(".size-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      switchSize(btn.dataset.size);
    });
  });

  // Renderizar leaderboard inicial
  renderLeaderboard();

  // Adicionar animação de entrada após renderização
  setTimeout(() => {
    addEntryAnimation();
  }, 100);
});

// Exportar funções para uso externo
window.updateLeaderboard = updateLeaderboard;
window.switchMode = switchMode;
window.switchSize = switchSize;

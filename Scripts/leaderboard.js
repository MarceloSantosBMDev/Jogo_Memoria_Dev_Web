class Leaderboard {
  constructor() {
    this.currentMode = "classico";
    this.currentSize = "8x8";
    this.init();
  }

  init() {
    this.bindEvents();
    this.loadLeaderboard();
  }

  bindEvents() {
    document.querySelectorAll(".mode-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.setActiveMode(e.target);
      });
    });

    document.querySelectorAll(".size-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.setActiveSize(e.target);
      });
    });
  }

  setActiveMode(button) {
    document.querySelectorAll(".mode-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    button.classList.add("active");
    this.currentMode = button.dataset.mode;
    this.updateMetricHeader();
    this.loadLeaderboard();
  }

  setActiveSize(button) {
    document.querySelectorAll(".size-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    button.classList.add("active");
    this.currentSize = button.dataset.size;
    this.loadLeaderboard();
  }

  updateMetricHeader() {
    const header = document.getElementById("metric-header");
    header.textContent =
      this.currentMode === "classico" ? "Movimentos" : "Tempo";
  }

  async loadLeaderboard() {
    const leaderboardList = document.getElementById("leaderboard-list");
    leaderboardList.innerHTML =
      '<div class="loading">Carregando rankings...</div>';

    try {
      const response = await fetch("../PHP/get_leaderboard.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: this.currentMode,
          size: this.currentSize,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        this.displayLeaderboard(data.leaderboard);
      } else {
        leaderboardList.innerHTML =
          '<div class="no-data">Erro ao carregar rankings.</div>';
      }
    } catch (error) {
      leaderboardList.innerHTML = '<div class="no-data">Erro de conexão.</div>';
    }
  }

  displayLeaderboard(leaderboard) {
    const leaderboardList = document.getElementById("leaderboard-list");

    if (leaderboard.length === 0) {
      leaderboardList.innerHTML =
        '<div class="leaderboard-empty">Nenhum jogador ranqueado ainda.<br>Seja o primeiro a jogar!</div>';
      return;
    }

    let html = "";

    leaderboard.forEach((entry, index) => {
      const position = index + 1;
      const metricValue =
        this.currentMode === "classico"
          ? entry.best_score
          : this.formatTime(entry.best_score);

      html += this.createLeaderboardItem(entry, position, metricValue);
    });

    const missing = 10 - leaderboard.length;

    for (let i = 0; i < missing; i++) {
      html += `
            <div class="leaderboard-item ghost-slot">
                <div class="rank-column">
                    <div class="rank-badge ghost-badge">—</div>
                </div>

                <div class="username-column ghost-text">
                    <div class="user-avatar ghost-avatar">?</div>
                    <span>—</span>
                </div>

                <div class="score-column ghost-text">
                    <div class="score-badge ghost-score">—</div>
                </div>
            </div>
        `;
    }

    leaderboardList.innerHTML = html;
    this.addEntryAnimation();
  }

  createLeaderboardItem(player, rank, metricValue) {
    const rankClass = rank <= 3 ? `rank-${rank}` : "";
    const metricIcon = this.currentMode === "classico" ? "🔄" : "⏱️";

    return `
            <div class="leaderboard-item ${rankClass}">
                <div class="rank-column">
                    ${this.createRankBadge(rank)}
                </div>
                
                <div class="username-column">
                    <div class="user-avatar">${this.getInitial(player.username)}</div>
                    <span>${this.escapeHtml(player.username)}</span>
                </div>
                
                <div class="score-column">
                    <div class="score-badge">
                        <span class="score-icon">${metricIcon}</span>${metricValue}
                    </div>
                </div>
            </div>
        `;
  }

  createRankBadge(rank) {
    let badgeClass = "default";
    let badgeContent = rank;

    if (rank === 1) {
      badgeClass = "gold";
      badgeContent = `<img src="https://em-content.zobj.net/source/apple/354/1st-place-medal_1f947.png" alt="Gold Medal" style="width: 28px; height: 28px;">`;
    } else if (rank === 2) {
      badgeClass = "silver";
      badgeContent = `<img src="https://em-content.zobj.net/source/apple/354/2nd-place-medal_1f948.png" alt="Silver Medal" style="width: 28px; height: 28px;">`;
    } else if (rank === 3) {
      badgeClass = "bronze";
      badgeContent = `<img src="https://em-content.zobj.net/source/apple/354/3rd-place-medal_1f949.png" alt="Bronze Medal" style="width: 28px; height: 28px;">`;
    }

    return `<div class="rank-badge ${badgeClass}">${badgeContent}</div>`;
  }

  getInitial(username) {
    return username.charAt(0).toUpperCase();
  }

  formatTime(seconds) {
    if (!seconds) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  addEntryAnimation() {
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
}

document.addEventListener("DOMContentLoaded", () => {
  new Leaderboard();
});

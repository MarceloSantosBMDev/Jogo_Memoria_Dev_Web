document.addEventListener("DOMContentLoaded", () => {
  const botaodeStart = document.getElementById("start-game-btn");
  const botaoSelect = document.getElementById("select-game-btn");
  const setinha = document.querySelectorAll(".d-pad-btn");

  const TituloTela = document.getElementById("screen-main-title");
  const opcaoTela = document.getElementById("screen-option-display");
  const dicaTela = document.getElementById("screen-hint-text");

  const modo_de_jogo = [
    { name: "Clássico", description: "Jogue sem limite de tempo." },
    {
      name: "Contra o Tempo",
      description: "Corra para encontrar todos os pares!",
    },
  ];

  const dificuldades = [
    { name: "Iniciais", size: "2x2", gamePage: "Pages/gameboard.php" },
    { name: "Raros", size: "4x4", gamePage: "Pages/gameboard.php" },
    { name: "Lendários", size: "6x6", gamePage: "Pages/gameboard.php" },
    { name: "Míticos", size: "8x8", gamePage: "Pages/gameboard.php" },
  ];

  let PassoAtual = "EscolherModo";
  let ModoEscolhido = 0; // índice do modo_de_jogo
  let dificuldade_escolhida = 0; // índice da dificuldade

  function desenharNaTela() {
    opcaoTela.innerHTML = "";

    if (PassoAtual === "EscolherModo") {
      TituloTela.textContent = "Escolha o Modo";
      const ModoAtual = modo_de_jogo[ModoEscolhido];

      opcaoTela.innerHTML = `<p class="selectable-option">&lt; ${ModoAtual.name} &gt;</p>`;
      dicaTela.textContent =
        "Pressione SELECT para confirmar ou use as setas para mudar";
      botaoSelect.classList.remove("disabled");
      botaodeStart.classList.add("disabled");
    } else if (PassoAtual === "EscolherDificuldade") {
      TituloTela.textContent = "Escolha a Dificuldade";
      const dificuldadeAtual = dificuldades[dificuldade_escolhida];

      opcaoTela.innerHTML = `<p class="selectable-option">&lt; ${dificuldadeAtual.name} &gt;</p>`;
      dicaTela.textContent = `Tamanho do Jogo: ${dificuldadeAtual.size}`;
      botaoSelect.classList.remove("disabled");
      botaodeStart.classList.add("disabled");
    } else if (PassoAtual === "ConfirmarJogo") {
      const modo = modo_de_jogo[ModoEscolhido];
      const dificuldade = dificuldades[dificuldade_escolhida];

      TituloTela.textContent = "Tudo Pronto?";
      opcaoTela.innerHTML = `
				<div class="summary-screen">
					<p>Modo: <span>${modo.name}</span></p>
					<p>Dificuldade: <span>${dificuldade.name}</span></p>
				</div>`;
      dicaTela.textContent = "Pressione START para jogar ou SELECT para voltar";
      botaoSelect.classList.remove("disabled");
      botaodeStart.classList.remove("disabled");
    }
  }

  // Setas
  setinha.forEach((seta) => {
    seta.addEventListener("click", () => {
      const direcao = seta.dataset.direction;

      if (PassoAtual === "EscolherModo") {
        if (direcao === "right")
          ModoEscolhido = (ModoEscolhido + 1) % modo_de_jogo.length;

        if (direcao === "left")
          ModoEscolhido =
            (ModoEscolhido - 1 + modo_de_jogo.length) % modo_de_jogo.length;
      } else if (PassoAtual === "EscolherDificuldade") {
        if (direcao === "right")
          dificuldade_escolhida =
            (dificuldade_escolhida + 1) % dificuldades.length;

        if (direcao === "left")
          dificuldade_escolhida =
            (dificuldade_escolhida - 1 + dificuldades.length) %
            dificuldades.length;
      }

      desenharNaTela();
    });
  });

  // Botão SELECT
  botaoSelect.addEventListener("click", () => {
    if (PassoAtual === "EscolherModo") {
      PassoAtual = "EscolherDificuldade";
    } else if (PassoAtual === "EscolherDificuldade") {
      PassoAtual = "ConfirmarJogo";
    } else if (PassoAtual === "ConfirmarJogo") {
      PassoAtual = "EscolherModo";
      ModoEscolhido = 0;
      dificuldade_escolhida = 0;
    }
    desenharNaTela();
  });

  // Botão START
  botaodeStart.addEventListener("click", () => {
    if (PassoAtual === "ConfirmarJogo") {
      const dificuldadeInfo = dificuldades[dificuldade_escolhida];
      const urlDestino = `${dificuldadeInfo.gamePage}?modo_dificuldade=${dificuldade_escolhida}&modo_escolha=${ModoEscolhido}`;

      const superior = document.querySelector(".pokeball-superior");
      const inferior = document.querySelector(".pokeball-inferior");
      const centro = document.querySelector(".pokeball-centro");
      const botao = document.querySelector(".pokeball-botao");

      let classePokebola = "";

      if (ModoEscolhido === 1) {
        classePokebola = "timerball";
      } else {
        switch (dificuldade_escolhida) {
          case 0:
            classePokebola = "pokeball";
            break;
          case 1:
            classePokebola = "greatball";
            break;
          case 2:
            classePokebola = "ultraball";
            break;
          case 3:
            classePokebola = "masterball";
            break;
          default:
            return;
        }
      }

      if (classePokebola) {
        superior.classList.add(classePokebola);
        inferior.classList.add(classePokebola);
        centro.classList.add(classePokebola);
        botao.classList.add(classePokebola);
      }

      if (window.pageTransition) {
        window.pageTransition.navigateTo(urlDestino);
      } else {
        window.location.href = urlDestino;
      }
    }
  });

  desenharNaTela();
});

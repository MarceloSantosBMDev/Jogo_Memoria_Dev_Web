class PageTransition {
  constructor() {
    this.transitionElement = null;
    this.superior = null;
    this.inferior = null;
    this.centro = null;
    this.botao = null;
    this.init();
  }

  init() {
    this.criarElementosTransicao();

    this.aplicarEstiloPokebola();

    this.colocarLinkListener();

    this.animarTransicao();
  }

  // coloca os elementos da transicao na pagina
  criarElementosTransicao() {
    const container = document.createElement("div");
    container.className = "page-transition";

    const superior = document.createElement("div");
    superior.className = "pokeball-superior";

    const inferior = document.createElement("div");
    inferior.className = "pokeball-inferior";

    const centro = document.createElement("div");
    centro.className = "pokeball-centro";

    const botao = document.createElement("div");
    botao.className = "pokeball-botao";

    centro.appendChild(botao);
    container.appendChild(superior);
    container.appendChild(inferior);
    container.appendChild(centro);

    document.body.appendChild(container);

    this.transitionElement = container;
    this.superior = superior;
    this.inferior = inferior;
    this.centro = centro;
    this.botao = botao;
  }

  aplicarEstiloPokebola() {
    const urlParams = new URLSearchParams(window.location.search);

    const modoEscolhido = parseInt(urlParams.get("modo_escolha")) || 0;
    const modoDificuldade = parseInt(urlParams.get("modo_dificuldade")) || 0;

    let classePokebola = "";

    if (modoEscolhido === 1) {
      classePokebola = "timerball";
    } else {
      switch (modoDificuldade) {
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
      this.superior.classList.add(classePokebola);
      this.inferior.classList.add(classePokebola);
      this.centro.classList.add(classePokebola);
      this.botao.classList.add(classePokebola);
    }
  }

  // coloca os direcionamentos de link para os 'a' e 'button'
  colocarLinkListener() {
    const links = document.querySelectorAll(".page-link, .transition-link");

    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        const targetUrl =
          link.getAttribute("href") || link.getAttribute("data-href");
        if (targetUrl) {
          e.preventDefault();
          this.navigateTo(targetUrl);
        }
      });
    });
  }

  //animacao
  animarTransicao() {
    const shouldAnimate = sessionStorage.getItem("pageTransition");

    // confere se nao eh refresh
    if (shouldAnimate === "true") {
      sessionStorage.removeItem("pageTransition");

      this.transitionElement.classList.add("closing");
      document.body.classList.add("transitioning");

      setTimeout(() => {
        this.transitionElement.classList.remove("closing");
        this.transitionElement.classList.add("opening");

        setTimeout(() => {
          document.body.classList.remove("transitioning");
          this.transitionElement.classList.remove("opening");
        }, 600);
      }, 50);
    }
  }

  // redireciona para o URL
  navigateTo(url) {
    if (document.body.classList.contains("transitioning")) {
      return;
    }

    sessionStorage.setItem("pageTransition", "true");

    document.body.classList.add("transitioning");
    this.transitionElement.classList.add("closing");

    setTimeout(() => {
      window.location.href = url;
    }, 1300);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.pageTransition = new PageTransition();
  });
} else {
  window.pageTransition = new PageTransition();
}

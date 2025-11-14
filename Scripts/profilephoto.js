const shinyDittoURL = "../pokemons/dittoshiny.gif";
const normalDittoURL = "../pokemons/ditto.gif";

function mudarImagem() {
  const imagem = document.getElementById("ImagemAlterada");

  if (imagem.src.includes("dittoshiny.gif")) {
    imagem.src = normalDittoURL;
    imagem.alt = "Ditto Normal";
  } else {
    imagem.src = shinyDittoURL;
    imagem.alt = "Ditto Shiny";
  }
}

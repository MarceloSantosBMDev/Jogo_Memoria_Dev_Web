function abrirHistoricoCompleto() {
  document.getElementById("historyPopup").style.display = "flex";
  document.body.style.overflow = "hidden";
}

function fecharHistoricoCompleto() {
  document.getElementById("historyPopup").style.display = "none";
  document.body.style.overflow = "auto";
}

document.addEventListener("DOMContentLoaded", function () {
  const popup = document.getElementById("historyPopup");
  if (popup) {
    popup.addEventListener("click", function (e) {
      if (e.target === this) {
        fecharHistoricoCompleto();
      }
    });
  }

  // Fechar com ESC
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      fecharHistoricoCompleto();
    }
  });
});

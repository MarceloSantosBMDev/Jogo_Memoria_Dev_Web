(function () {
	"use strict";

	// Função para verificar se está logado
	function isLogged() {
		return sessionStorage.getItem("logged") === "1";
	}

	// Função para fazer login
	function login() {
		sessionStorage.setItem("logged", "1");
		updateHeader();
	}

	// Função para fazer logout
	function logout() {
		sessionStorage.setItem("logged", "0");
		sessionStorage.removeItem("logged");
		updateHeader();

		window.location.href = getBasePath() + "Pages/login.html";
	}

	function getBasePath() {
		const path = window.location.pathname;
		if (path.includes("/Pages/")) {
			return "../";
		}
		return "./";
	}

	// Atualiza o Header
	function updateHeader() {
		const nav = document.querySelector(".nav");
		if (!nav) return;

		const basePath = getBasePath();

		if (isLogged()) {
			nav.innerHTML = `
                <a href="${basePath}index.html" class="nav-link" style="cursor: url('${basePath}image/pointer.png') 8 8, pointer;">Home</a>
                <a href="${basePath}Pages/perfil.html" class="nav-link" style="cursor: url('${basePath}image/pointer.png') 8 8, pointer;">Perfil</a>
                <a href="#" id="logout-btn" class="nav-link" style="cursor: url('${basePath}image/pointer.png') 8 8, pointer;">Log off</a>
            `;

			const logoutBtn = document.getElementById("logout-btn");
			if (logoutBtn) {
				logoutBtn.addEventListener("click", function (e) {
					e.preventDefault();
					logout();
				});
			}
		} else {
			nav.innerHTML = `
                <a href="${basePath}index.html" class="nav-link" style="cursor: url('${basePath}image/pointer.png') 8 8, pointer;">Home</a>
                <a href="${basePath}Pages/login.html" class="nav-link" style="cursor: url('${basePath}image/pointer.png') 8 8, pointer;">Login</a>
                <a href="${basePath}Pages/register.html" class="nav-link" style="cursor: url('${basePath}image/pointer.png') 8 8, pointer;">Register</a>
            `;
		}
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", updateHeader);
	} else {
		updateHeader();
	}

	window.authSystem = {
		login: login,
		logout: logout,
		isLogged: isLogged,
		updateHeader: updateHeader,
	};
})();

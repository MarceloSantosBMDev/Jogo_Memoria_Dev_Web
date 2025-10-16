(function () {
	"use strict";

	document.addEventListener("DOMContentLoaded", function () {
		const loginForm = document.querySelector('form[action="login"]');

		if (!loginForm) return;

		loginForm.addEventListener("submit", function (e) {
			e.preventDefault();

			// Fazer login
			if (window.authSystem) {
				window.authSystem.login();

				window.location.href = "../index.html";
			}
		});
	});
})();

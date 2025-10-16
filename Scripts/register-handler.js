(function () {
	"use strict";

	document.addEventListener("DOMContentLoaded", function () {
		const registerForm = document.querySelector('form[action="login"]');

		if (!registerForm) return;

		registerForm.addEventListener("submit", function (e) {
			e.preventDefault();

			// Fazer login após registro
			if (window.authSystem) {
				window.authSystem.login();

				window.location.href = "../index.html";
			}
		});
	});
})();

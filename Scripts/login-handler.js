(function () {
	"use strict";

	// Exibir erro customizado
	function showError(field, message) {
		const existingError = field.parentNode.querySelector(".error-message");
		if (existingError) existingError.remove();

		field.classList.add("input-error");

		const errorElement = document.createElement("span");
		errorElement.className = "error-message";
		errorElement.textContent = message;
		field.parentNode.appendChild(errorElement);
	}

	// Limpar erro
	function clearError(field) {
		field.classList.remove("input-error");
		const errorElement = field.parentNode.querySelector(".error-message");
		if (errorElement) errorElement.remove();
	}

	function validateLoginForm(form) {
		let isValid = true;
		const requiredFields = form.querySelectorAll("[required]");

		form.querySelectorAll(".error-message").forEach((el) => el.remove());
		form
			.querySelectorAll(".input-error")
			.forEach((el) => el.classList.remove("input-error"));

		requiredFields.forEach((field) => {
			let error = "";
			const value = field.value.trim();

			if (!value) {
				error = "Este campo é obrigatório.";
			} else {
				switch (field.name) {
					case "username":
						if (value.length < 3)
							error = "Usuário deve ter no mínimo 3 caracteres.";
						break;

					case "password":
						if (value.length < 6)
							error = "A senha deve ter no mínimo 6 caracteres.";
						break;
				}
			}

			if (error) {
				isValid = false;
				showError(field, error);
			}
		});

		return isValid;
	}

	document.addEventListener("DOMContentLoaded", function () {
		const loginForm = document.getElementById("loginForm");
		if (!loginForm) return;

		loginForm.setAttribute("novalidate", true);

		const allInputs = loginForm.querySelectorAll("input[required]");
		allInputs.forEach((input) => {
			input.addEventListener("focus", () => clearError(input));
			input.addEventListener("input", () => clearError(input));
		});

		// Validação no submit
		loginForm.addEventListener("submit", function (e) {
			e.preventDefault();

			if (!validateLoginForm(loginForm)) {
				const firstErrorField = loginForm.querySelector(".input-error");
				if (firstErrorField) {
					firstErrorField.focus();
					firstErrorField.scrollIntoView({
						behavior: "smooth",
						block: "center",
					});
				}
				return;
			}

			if (window.authSystem) {
				window.authSystem.login();
				window.location.href = "../index.html";
			}
		});
	});
})();

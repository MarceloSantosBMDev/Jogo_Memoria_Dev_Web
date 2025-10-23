(function () {
	"use strict";

	//validação CPF
	function validarCPF(cpf) {
		cpf = cpf.replace(/[^\d]+/g, "");

		if (cpf.length !== 11) return false;

		if (/^(\d)\1{10}$/.test(cpf)) return false;

		let soma = 0;
		let resto;

		for (let i = 1; i <= 9; i++) {
			soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
		}
		resto = (soma * 10) % 11;
		if (resto === 10 || resto === 11) resto = 0;
		if (resto !== parseInt(cpf.substring(9, 10))) return false;

		soma = 0;
		for (let i = 1; i <= 10; i++) {
			soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
		}
		resto = (soma * 10) % 11;

		if (resto === 10 || resto === 11) resto = 0;
		if (resto !== parseInt(cpf.substring(10, 11))) return false;

		return true;
	}

	// Função para exibir erro customizado
	function showError(field, message) {
		// Remove erro anterior se existir
		const existingError = field.parentNode.querySelector(".error-message");
		if (existingError) {
			existingError.remove();
		}

		// Adiciona classe de erro no campo
		field.classList.add("input-error");

		// Cria e adiciona mensagem de erro
		const errorElement = document.createElement("span");
		errorElement.className = "error-message";
		errorElement.textContent = message;
		field.parentNode.appendChild(errorElement);
	}

	// Função para limpar erro
	function clearError(field) {
		field.classList.remove("input-error");
		const errorElement = field.parentNode.querySelector(".error-message");
		if (errorElement) {
			errorElement.remove();
		}
	}

	// validação formulário
	function validateForm(form) {
		let isValid = true;
		const requiredFields = form.querySelectorAll("[required]");

		// Limpa todos os erros anteriores
		form.querySelectorAll(".error-message").forEach((el) => el.remove());
		form
			.querySelectorAll(".input-error")
			.forEach((el) => el.classList.remove("input-error"));

		requiredFields.forEach((field) => {
			let error = "";
			const fieldValue = field.value.trim();

			if (!fieldValue) {
				error = "Este campo é obrigatório.";
			} else {
				switch (field.name) {
					case "Nome":
						if (
							fieldValue.split(" ").filter((word) => word.length > 0).length < 2
						) {
							error = "Insira nome e sobrenome.";
						}
						break;

					case "Email":
						const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
						if (!emailRegex.test(fieldValue)) {
							error = "Insira um formato de email válido.";
						}
						break;

					case "username":
						if (fieldValue.length < 3) {
							error = "Usuário deve ter no mínimo 3 caracteres.";
						}
						break;

					case "password":
						if (fieldValue.length < 6) {
							error = "A senha deve ter no mínimo 6 caracteres.";
						}
						break;

					case "CPF":
						if (fieldValue.length < 14 || !validarCPF(fieldValue)) {
							error = "O CPF inserido é inválido.";
						}
						break;

					case "data":
						const dataRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
						if (!dataRegex.test(fieldValue)) {
							error = "Formato: DD/MM/AAAA.";
						} else {
							const parts = fieldValue.match(dataRegex);
							const day = parseInt(parts[1], 10);
							const month = parseInt(parts[2], 10) - 1;
							const year = parseInt(parts[3], 10);

							const birthDate = new Date(year, month, day);
							const today = new Date();
							const minAgeDate = new Date();
							minAgeDate.setFullYear(today.getFullYear() - 13);

							if (birthDate > minAgeDate) {
								error = "Você deve ter pelo menos 13 anos.";
							}
						}
						break;

					case "Telefone":
						if (fieldValue.replace(/\D/g, "").length < 10) {
							error = "Telefone inválido (mínimo 10 dígitos).";
						}
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
		const registerForm = document.getElementById("registerForm");
		const cpfInput = document.querySelector('input[name="CPF"]');
		const dataInput = document.querySelector('input[name="data"]');
		const telefoneInput = document.querySelector('input[name="Telefone"]');

		if (!registerForm) return;

		// Máscara CPF
		if (cpfInput) {
			cpfInput.addEventListener("input", function (e) {
				let v = e.target.value.replace(/\D/g, "");
				if (v.length <= 11) {
					v = v.replace(/(\d{3})(\d)/, "$1.$2");
					v = v.replace(/(\d{3})(\d)/, "$1.$2");
					v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
				}
				e.target.value = v;
			});

			// Limpa erro ao digitar
			cpfInput.addEventListener("input", () => clearError(cpfInput));
		}

		// Máscara Data
		if (dataInput) {
			dataInput.maxLength = 10;
			dataInput.addEventListener("input", function (e) {
				let v = e.target.value.replace(/\D/g, "");
				v = v.replace(/(\d{2})(\d)/, "$1/$2");
				v = v.replace(/(\d{2})(\d)/, "$1/$2");
				e.target.value = v;
			});

			dataInput.addEventListener("input", () => clearError(dataInput));
		}

		// Máscara Telefone
		if (telefoneInput) {
			telefoneInput.maxLength = 15;
			telefoneInput.addEventListener("input", function (e) {
				let v = e.target.value.replace(/\D/g, "");
				v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
				v = v.replace(/(\d)(\d{4})$/, "$1-$2");
				e.target.value = v;
			});

			telefoneInput.addEventListener("input", () => clearError(telefoneInput));
		}

		// Limpa erros ao focar nos campos
		const allInputs = registerForm.querySelectorAll("input[required]");
		allInputs.forEach((input) => {
			input.addEventListener("focus", () => clearError(input));
		});

		// Validação no submit
		registerForm.addEventListener("submit", function (e) {
			e.preventDefault();

			if (!validateForm(registerForm)) {
				const firstErrorField = registerForm.querySelector(".input-error");
				if (firstErrorField) {
					firstErrorField.focus();
					firstErrorField.scrollIntoView({
						behavior: "smooth",
						block: "center",
					});
				}
				return;
			}

			// Se passou na validação
			if (window.authSystem) {
				window.authSystem.login();
				window.location.href = "../index.html";
			}
		});
	});
})();

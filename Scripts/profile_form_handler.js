(function () {
  "use strict";

  // Função para mostrar erro em linha
  function showError(field, message) {
    const existingError = field.parentNode.querySelector(".error-message");
    if (existingError) existingError.remove();

    field.classList.add("input-error");
    const errorElement = document.createElement("span");
    errorElement.className = "error-message";
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
  }

  // Função para limpar erro
  function clearError(field) {
    field.classList.remove("input-error");
    const errorElement = field.parentNode.querySelector(".error-message");
    if (errorElement) errorElement.remove();
  }

  // Função para limpar todos os erros
  function clearAllErrors(form) {
    form.querySelectorAll(".error-message").forEach((el) => el.remove());
    form
      .querySelectorAll(".input-error")
      .forEach((el) => el.classList.remove("input-error"));
  }

  // Função para focar no primeiro erro
  function focusFirstError(form) {
    const firstError = form.querySelector(".input-error");
    if (firstError) {
      firstError.focus();
      firstError.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  // Máscara de telefone
  function maskPhone(value) {
    value = value.replace(/\D/g, "").slice(0, 11);
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
    value = value.replace(/(\d)(\d{4})$/, "$1-$2");
    return value;
  }

  // Validadores
  const validators = {
    full_name: (value) => {
      if (!value) return "O nome não pode ficar vazio.";

      const partes = value
        .trim()
        .split(" ")
        .filter((p) => p.length > 0);
      if (partes.length < 2) {
        return "Insira nome e sobrenome completos.";
      }

      if (value.length < 5) {
        return "O nome deve ter pelo menos 5 caracteres.";
      }

      if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) {
        return "O nome deve conter apenas letras.";
      }

      return "";
    },

    email: (value) => {
      if (!value) return "O e-mail não pode ficar vazio.";

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return "Informe um formato de e-mail válido (exemplo@dominio.com).";
      }

      if (value.length > 255) {
        return "O e-mail é muito longo (máximo 255 caracteres).";
      }

      return "";
    },

    phone: (value) => {
      if (!value) return "O telefone não pode ficar vazio.";

      const digitos = value.replace(/\D/g, "");
      const tamanho = digitos.length;

      if (tamanho < 10 || tamanho > 11) {
        return "Telefone inválido. Deve ter 10 ou 11 dígitos com DDD.";
      }

      // Valida DDD (primeiros 2 dígitos entre 11 e 99)
      const ddd = parseInt(digitos.substr(0, 2));
      if (ddd < 11 || ddd > 99) {
        return "DDD inválido.";
      }

      // Verifica se não é uma sequência repetida
      if (/^(\d)\1+$/.test(digitos)) {
        return "Telefone inválido.";
      }

      return "";
    },
  };

  // Função para validar formulário
  function validateForm(form) {
    clearAllErrors(form);
    let isValid = true;

    form.querySelectorAll("[required]").forEach((field) => {
      const validator = validators[field.name];
      if (!validator) return;

      const error = validator(field.value.trim());
      if (error) {
        isValid = false;
        showError(field, error);
      }
    });

    return isValid;
  }

  // Inicialização quando o DOM carregar
  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("profileForm");
    if (!form) return;

    const phoneInput = document.getElementById("phone");

    // Aplicar máscara no telefone
    if (phoneInput) {
      phoneInput.addEventListener("input", (e) => {
        e.target.value = maskPhone(e.target.value);
      });

      // Limpar erro ao digitar
      phoneInput.addEventListener("input", () => clearError(phoneInput));
    }

    // Limpar erros dos outros campos ao digitar
    const nameInput = document.getElementById("profile-name");
    const emailInput = document.getElementById("email");

    if (nameInput) {
      nameInput.addEventListener("input", () => clearError(nameInput));
    }

    if (emailInput) {
      emailInput.addEventListener("input", () => clearError(emailInput));
    }

    // Validação no submit
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Remove o foco do campo ativo
      document.activeElement?.blur();

      if (!validateForm(form)) {
        focusFirstError(form);
        return;
      }

      // Se a validação passou, submete o formulário
      form.submit();
    });
  });
})();

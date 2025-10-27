(function () {
  "use strict";

  function showError(field, message) {
    const existingError = field.parentNode.querySelector(".error-message");
    if (existingError) existingError.remove();

    field.classList.add("input-error");
    const errorElement = document.createElement("span");
    errorElement.className = "error-message";
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
  }

  function clearError(field) {
    field.classList.remove("input-error");
    const errorElement = field.parentNode.querySelector(".error-message");
    if (errorElement) errorElement.remove();
  }

  function clearAllErrors(form) {
    form.querySelectorAll(".error-message").forEach((el) => el.remove());
    form
      .querySelectorAll(".input-error")
      .forEach((el) => el.classList.remove("input-error"));
  }

  function focusFirstError(form) {
    const firstError = form.querySelector(".input-error");
    if (firstError) {
      firstError.focus();
      firstError.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, "");
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    for (let t = 9; t < 11; t++) {
      let soma = 0;
      for (let i = 0; i < t; i++) {
        soma += parseInt(cpf[i]) * (t + 1 - i);
      }
      const resto = (soma * 10) % 11;
      if ((resto === 10 ? 0 : resto) !== parseInt(cpf[t])) return false;
    }
    return true;
  }

  // Validações de cada campo
  const validators = {
    username: (value) => {
      if (!value) {
        return "Este campo é obrigatório.";
      }

      if (value.length < 3) {
        return "Usuário deve ter no mínimo 3 caracteres.";
      }
      return "";
    },

    password: (value) => {
      if (!value) {
        return "Este campo é obrigatório.";
      }

      if (value.length < 6) {
        return "A senha deve ter no mínimo 6 caracteres.";
      }
      return "";
    },

    Nome: (value) => {
      if (!value) {
        return "Este campo é obrigatório.";
      }

      if (value.split(" ").filter((w) => w.length > 0).length < 2) {
        return "Insira nome e sobrenome.";
      }
      return "";
    },

    Email: (value) => {
      if (!value) {
        return "Este campo é obrigatório.";
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return "Insira um formato de email válido.";
      }
      return "";
    },

    CPF: (value) => {
      if (!value) {
        return "Este campo é obrigatório.";
      }

      if (!validarCPF(value)) return "O CPF inserido é inválido.";
      return "";
    },

    data: (value) => {
      if (!value) {
        return "Este campo é obrigatório.";
      }

      const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;

      if (!regex.test(value)) return "Formato: DD/MM/AAAA.";

      const [, day, month, year] = value.match(regex);
      const birthDate = new Date(year, month - 1, day);
      const minAgeDate = new Date();
      minAgeDate.setFullYear(minAgeDate.getFullYear() - 13);

      if (birthDate > minAgeDate) {
        return "Você deve ter pelo menos 13 anos.";
      }
      return "";
    },

    Telefone: (value) => {
      if (!value) {
        return "Este campo é obrigatório.";
      }

      if (value.replace(/\D/g, "").length < 10) {
        return "Telefone inválido (mínimo 10 dígitos).";
      }
      return "";
    },
  };

  // Validação do formulário
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

  // Máscaras de dados
  const masks = {
    CPF: (v) => {
      v = v.replace(/\D/g, "").slice(0, 11);
      v = v.replace(/(\d{3})(\d)/, "$1.$2");
      v = v.replace(/(\d{3})(\d)/, "$1.$2");
      v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      return v;
    },

    data: (v) => {
      v = v.replace(/\D/g, "").slice(0, 8);
      v = v.replace(/(\d{2})(\d)/, "$1/$2");
      v = v.replace(/(\d{2})(\d)/, "$1/$2");
      return v;
    },

    Telefone: (v) => {
      v = v.replace(/\D/g, "").slice(0, 11);
      v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
      v = v.replace(/(\d)(\d{4})$/, "$1-$2");
      return v;
    },
  };

  function applyMask(input) {
    const mask = masks[input.name];
    if (mask) {
      input.addEventListener("input", (e) => {
        e.target.value = mask(e.target.value);
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    const forms = [
      document.getElementById("loginForm"),
      document.getElementById("registerForm"),
    ].filter(Boolean);

    forms.forEach((form) => {
      form.setAttribute("novalidate", true);

      // Aplica máscaras e limpa erros ao digitar
      form.querySelectorAll("input[required]").forEach((input) => {
        applyMask(input);
        input.addEventListener("input", () => clearError(input));
      });

      // Handler de submit
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        document.activeElement?.blur();

        if (!validateForm(form)) {
          focusFirstError(form);
          return;
        }

        if (window.authSystem) {
          window.authSystem.login();
          window.location.href = "../index.html";
        }
      });
    });
  });
})();

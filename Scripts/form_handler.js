(function () {
  "use strict";

  function exibirPopup(titulo, mensagem, tipo) {
    // Define as cores do header baseado no tipo
    const headerColors = {
      success: "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)",
      error: "linear-gradient(135deg, #e53935 0%, #b71c1c 100%)",
      warning: "linear-gradient(135deg, #ffb300 0%, #ff9800 100%)",
      info: "linear-gradient(135deg, #2196f3 0%, #1565c0 100%)"
    };

    const overlay = document.createElement("div");
    overlay.className = "popup-overlay";

    const popup = document.createElement("div");
    popup.className = `popup-container ${tipo}`;

    // Aplica a cor do header dinamicamente
    const headerColor = headerColors[tipo] || headerColors.info;
    popup.style.setProperty("--header-color", headerColor);

    // Cria o elemento ::before dinamicamente usando um style inline
    const style = document.createElement("style");
    style.textContent = `
      .popup-container.${tipo}::before {
        background: ${headerColor};
      }
    `;
    document.head.appendChild(style);

    const titleEl = document.createElement("h3");
    titleEl.className = "popup-title";
    titleEl.textContent = titulo;

    const messageEl = document.createElement("p");
    messageEl.className = "popup-message";
    messageEl.innerHTML = mensagem;

    const closeBtn = document.createElement("button");
    closeBtn.className = "popup-button";
    closeBtn.textContent = "Fechar";
    closeBtn.onclick = () => {
      overlay.remove();
      style.remove(); // Remove o style quando fechar
    };

    popup.appendChild(titleEl);
    popup.appendChild(messageEl);
    popup.appendChild(closeBtn);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
  }

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

  const validators = {
    username: (value) => {
      if (!value) return "Este campo é obrigatório.";
      if (value.length < 3) return "Usuário deve ter no mínimo 3 caracteres.";
      return "";
    },
    password: (value) => {
      if (!value) return "Este campo é obrigatório.";
      if (value.length < 6) return "A senha deve ter no mínimo 6 caracteres.";
      return "";
    },
    Nome: (value) => {
      if (!value) return "Este campo é obrigatório.";
      if (value.split(" ").filter((w) => w.length > 0).length < 2) {
        return "Insira nome e sobrenome.";
      }
      return "";
    },
    Email: (value) => {
      if (!value) return "Este campo é obrigatório.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return "Insira um formato de email válido.";
      }
      return "";
    },
    CPF: (value) => {
      if (!value) return "Este campo é obrigatório.";
      if (!validarCPF(value)) return "O CPF inserido é inválido.";
      return "";
    },
    data: (value) => {
      if (!value) return "Este campo é obrigatório.";
      const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      if (!regex.test(value)) return "Formato: DD/MM/AAAA.";
      const [, day, month, year] = value.match(regex);
      const birthDate = new Date(year, month - 1, day);
      const minAgeDate = new Date();
      minAgeDate.setFullYear(minAgeDate.getFullYear() - 13);
      if (birthDate > minAgeDate) return "Você deve ter pelo menos 13 anos.";
      return "";
    },
    Telefone: (value) => {
      if (!value) return "Este campo é obrigatório.";
      if (value.replace(/\D/g, "").length < 10) {
        return "Telefone inválido (mínimo 10 dígitos).";
      }
      return "";
    },
  };

  function validateForm(form) {
    clearAllErrors(form);
    let isValid = true;
    form.querySelectorAll("[required]").forEach((field) => {
      let validator = validators[field.name];
      if (!validator && field.name in validators) {
        const key = Object.keys(validators).find(
          (k) => k.toLowerCase() === field.name.toLowerCase(),
        );
        if (key) validator = validators[key];
      }
      if (!validator) return;
      const error = validator(field.value.trim());
      if (error) {
        isValid = false;
        showError(field, error);
      }
    });
    return isValid;
  }

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
      form.querySelectorAll("input[required]").forEach((input) => {
        applyMask(input);
        input.addEventListener("input", () => clearError(input));
      });

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        document.activeElement?.blur();
        if (!validateForm(form)) {
          focusFirstError(form);
          return;
        }

        const formData = new FormData(form);
        const actionUrl =
          form.id === "loginForm"
            ? "../api/user_login.php"
            : "../api/user_register.php";

        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) submitButton.disabled = true;

        fetch(actionUrl, {
          method: "POST",
          body: formData,
        })
          .then((response) => {
            if (submitButton) submitButton.disabled = false;
            if (!response.ok) {
              throw new Error(
                `Erro de rede: ${response.status} ${response.statusText}`,
              );
            }
            return response.json();
          })
          .then((data) => {
            clearAllErrors(form);

            if (data.success) {
              const isLogin = form.id === "loginForm";
              const title = isLogin ? "Login Efetuado" : "Cadastro Efetuado";
              exibirPopup(title, data.message, "success");

              setTimeout(() => {
                if (form.id === "registerForm") {
                  window.location.href = "login.php";
                } else if (form.id === "loginForm") {
                  window.location.href = "../index.php";
                }
              }, 2000);
            } else if (data.errors && Object.keys(data.errors).length > 0) {
              // Exibe erros nos campos
              for (const fieldName in data.errors) {
                const field = form.querySelector(`[name="${fieldName}"]`);
                if (field) {
                  showError(field, data.errors[fieldName]);
                }
              }
              focusFirstError(form);

              // Popup de validação
              exibirPopup(
                "Erro de Validação",
                data.message || "Por favor, corrija os campos marcados.",
                "warning",
              );
            } else {
              // Erro genérico (do servidor)
              exibirPopup(
                "Ocorreu um Erro",
                data.message || "Ocorreu um erro desconhecido.",
                "error",
              );
            }
          })
          .catch((error) => {
            if (submitButton) submitButton.disabled = false;
            console.error("Erro na requisição:", error);

            exibirPopup(
              "Erro de Conexão",
              "Não foi possível conectar ao servidor. Tente novamente mais tarde.",
              "error",
            );
          });
      });
    });
  });
})();

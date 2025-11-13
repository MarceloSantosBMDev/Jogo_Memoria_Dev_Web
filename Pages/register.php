<?php
$path_prefix = '../';
$header_theme_class = 'default';

require_once('../PHP/config.php');
?>

<!DOCTYPE html>
<html lang="pt-br">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<meta http-equiv="X-UA-Compatible" content="ie=edge" />
		<title>Cadastro - Memory Game</title>

		<link
			href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap"
			rel="stylesheet"
		/>
		<link rel="stylesheet" href="../Styles/footer.css">
		<link rel="stylesheet" href="../Styles/login-register.css">
		<link rel="stylesheet" href="../Styles/popup.css">
		<link rel="stylesheet" href="../Styles/header.css">
	</head>

	<body>
		<?php 
            include '../PHP/header.php'; 
        ?>

		<main>
			<div class="container-flex">
				<div class="center_container register">
					<img
						src="../pokemons/umbreon.gif"
						alt="Umbreon"
						class="umbreon_espeon"
					/>

					<form action="register" id="registerForm" novalidate>
						<h3>Cadastro</h3>

						<div class="input-wrapper">
							<span class="info-text">Nome Completo</span>
							<input
								type="text"
								name="Nome"
								id="nome"
								placeholder="Nome Completo"
								required
								autocomplete="name"
							/>
						</div>

						<div class="input-row">
							<div class="input-wrapper half">
								<span class="info-text">Username</span>
								<input
									type="text"
									name="username"
									id="username"
									placeholder="Usuário"
									required
									autocomplete="username"
								/>
							</div>

							<div class="input-wrapper half">
								<span class="info-text">Email</span>
								<input
									type="email"
									name="Email"
									id="email"
									placeholder="Email"
									required
									autocomplete="email"
								/>
							</div>
						</div>

						<div class="input-wrapper">
							<span class="info-text">Senha</span>
							<input
								type="password"
								name="password"
								id="password"
								placeholder="Senha (mínimo 6 caracteres)"
								required
								autocomplete="new-password"
							/>
						</div>

						<div class="input-row">
							<div class="input-wrapper half">
								<span class="info-text">CPF</span>
								<input
									type="text"
									name="CPF"
									id="cpf"
									placeholder="CPF"
									required
									maxlength="14"
									autocomplete="off"
								/>
							</div>

							<div class="input-wrapper half">
								<span class="info-text">Data de Nascimento</span>
								<input
									type="text"
									name="data"
									id="data"
									placeholder="Nascimento"
									required
									autocomplete="bday"
								/>
							</div>
						</div>

						<div class="input-wrapper">
							<span class="info-text">Telefone</span>
							<input
								type="text"
								name="Telefone"
								id="telefone"
								placeholder="Telefone (DDD) 99999-9999"
								required
								autocomplete="tel"
							/>
						</div>

						<button type="submit" class="Submit_Button register">
							Cadastre-se
						</button>

						<p class="p_login">
							Já tem um login?
							<a
								href="login.html"
								style="cursor: url('../image/pointer.png') 8 8, pointer"
								>Logar-se</a
							>
						</p>
					</form>
				</div>
			</div>

			<footer class="site-footer">
				<div class="footer-container">
					<div class="footer-copyright">
						<p>&copy; 2025 Memory Game. Todos os Direitos Reservados.</p>
						<p>Criado com 💛 para Fãs de Pokémon</p>
					</div>
					<div class="footer-social-links">
						<a href="#" title="Nosso Projeto no GitHub">GitHub</a>
					</div>
				</div>
			</footer>
		</main>

		<script src="../Scripts/form_handler.js"></script>
	</body>
</html>

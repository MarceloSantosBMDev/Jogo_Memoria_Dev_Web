<?php
$path_prefix = '../';
$header_theme_class = 'default';

require_once('../PHP/config.php');
?>

<!DOCTYPE html>
<html lang="pt-br">
	<head>
	<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="X-UA-Compatible" content="ie=edge">
		<title>Login - Memory Game</title>

		<link
			href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap"
			rel="stylesheet"
		>
		<link rel="stylesheet" href="../Styles/header.css">
		<link rel="stylesheet" href="../Styles/login-register.css">
		<link rel="stylesheet" href="../Styles/popup.css">
		<link rel="stylesheet" href="../Styles/footer.css">
	</head>
	<body>
		<?php 
            include '../PHP/header.php'; 
        ?>

		<main>
			<div class="container-flex">
				<div class="center_container">
					<div class="shine"></div>
					<img src="../pokemons/flareon.gif" alt="Flareon" class="flareon">
					<img src="../pokemons/glaceon.gif" alt="Glaceon" class="glaceon">

					<form action="#" id="loginForm">
						<h3>Login</h3>

						<div class="input-wrapper">
							<span class="info-text">Username</span>
							<input
								type="text"
								name="username"
								id="username"
								placeholder="Usuário"
								required
								autocomplete="username"
							>
						</div>

						<div class="input-wrapper">
							<span class="info-text">Senha</span>
							<input
								type="password"
								name="password"
								id="password"
								placeholder="Senha"
								required
								autocomplete="current-password"
							>
						</div>

						<button type="submit" class="Submit_Button">Entrar</button>

						<p class="p_login">
							Não tem uma conta?
							<a
								href="register.php"
								style="cursor: url('../image/pointer.png') 8 8, pointer"
								>Cadastre-se</a
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

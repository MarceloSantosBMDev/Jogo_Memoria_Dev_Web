<?php
$path_prefix = '../';
$header_theme_class = 'theme-purple';

require_once('../PHP/config.php');
require_once('../PHP/protect.php'); 
?>

<!doctype html>
<html lang="pt-br">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="X-UA-Compatible" content="ie=edge">

		<title>Profile - Memory Game</title>

		<link
			href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap"
			rel="stylesheet"
		>

		<link rel="stylesheet" href="../Styles/stylebase.css">
		<link rel="stylesheet" href="../Styles/leaderboard.css">
		<link rel="stylesheet" href="../Styles/footer.css">
		<link rel="stylesheet" href="../Styles/header.css">
	</head>

	<body>
		<?php 
            include '../PHP/header.php'; 
        ?>

		<main>
			<section class="profile-page-section">
				<div class="profile-page-layout">
					<div class="trainer-form-container">
						<div class="profile-img-container">
							<img
								src="../pokemons/ditto.gif"
								alt="Foto do Treinador"
								class="Profile_Img"
								id="ImagemAlterada"
								onclick="mudarImagem()"
							>
						</div>

						<h2>Perfil de Treinador</h2>

						<form action="#">
							<div class="form-group">
								<label for="profile-name" id="profile-name-label">Nome</label>
								<input
									type="text"
									id="profile-name"
									class="form-input"
									placeholder="Marcelo dos Santos da Boa Morte"
								>
							</div>

							<div class="form-group">
								<label for="email" id="email-label">Email</label>
								<input
									type="email"
									id="email"
									class="form-input"
									placeholder="marcelo@hotmail.com"
								>
							</div>

							<div class="form-group">
								<label for="trainer-id" id="trainer-id-label">Número</label>
								<input
									type="text"
									id="trainer-id"
									class="form-input"
									placeholder="11993404123"
									readonly
								>
							</div>

							<button type="submit" class="submit-btn">Atualizar Perfil</button>
						</form>
					</div>

					<div class="game-history-container">
						<h2>Histórico de Partidas</h2>
						<ul class="history-list">
							<li class="history-item victory">
								<div class="game-info">
									<span class="game-date">15/10/2025 - 48 Jogadas</span>
									<span class="game-details"
										>Modo Difícil - Clássico - 01:45</span
									>
								</div>
							</li>
							<li class="history-item victory">
								<div class="game-info">
									<span class="game-date">15/10/2025- 48 Jogadas</span>
									<span class="game-details"
										>Modo Difícil - Contra o Tempo - 01:45</span
									>
								</div>
								<span class="game-result">Vitória</span>
							</li>

							<li class="history-item victory">
								<div class="game-info">
									<span class="game-date">14/10/2025- 6 Jogadas</span>
									<span class="game-details"
										>Modo Fácil - Contra o Tempo - 00:58</span
									>
								</div>
								<span class="game-result">Vitória</span>
							</li>
						</ul>

						<button
							type="button"
							class="button_leader"
							onclick="window.location.href='leaderboard.html'"
						>
							Leaderboard
						</button>
					</div>
				</div>
			</section>
			<footer class="site-footer theme-purple">
				<div class="footer-container">
					<div class="footer-copyright">
						<p>&copy; 2025 Memory Game. Todos os Direitos Reservados.</p>
						<p>Criado com 💜 para Fãs de Pokémon</p>
					</div>
					<div class="footer-social-links">
						<a href="#" title="Nosso Projeto no GitHub">GitHub</a>
					</div>
				</div>
			</footer>
		</main>

		<script src="../Scripts/profilephoto.js"></script>
	</body>
</html>

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

		<title>Leaderboard - Memory Game</title>

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
			<section class="leaderboard-table">
				<div class="leader">
					<div class="leaderboard-container">
						<h2 class="leaderboard-title">Rankings Board</h2>

						<div class="selectors-container">
							<div class="mode-selector">
								<button class="mode-btn active" data-mode="classico">
									Clássico
								</button>
								<button class="mode-btn" data-mode="tempo">
									Contra o Tempo
								</button>
							</div>

							<div class="size-selector">
								<button class="size-btn" data-size="2x2">2x2</button>
								<button class="size-btn" data-size="4x4">4x4</button>
								<button class="size-btn" data-size="6x6">6x6</button>
								<button class="size-btn active" data-size="8x8">8x8</button>
							</div>
						</div>

						<div class="leaderboard-header">
							<span>Place</span>
							<span>Jogador</span>
							<span id="metric-header">Movimentos</span>
						</div>

						<div class="leaderboard-list" id="leaderboard-list"></div>
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

		<script src="../Scripts/leaderboard.js"></script>
	</body>
</html>

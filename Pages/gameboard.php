<?php
$path_prefix = '../';
$header_theme_class = 'theme-yellow';

require_once('../PHP/config.php');
require_once('../PHP/protect.php'); 
?>

<!doctype html>
<html lang="pt-br">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="X-UA-Compatible" content="ie=edge">

		<title>Memory Game - Pokémon Edition</title>

		<link
			href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap"
			rel="stylesheet"
		>

		<link rel="stylesheet" href="../Styles/stylebase.css">
		<link rel="stylesheet" href="../Styles/gameboard.css">
		<link rel="stylesheet" href="../Styles/footer.css">
		<link rel="stylesheet" href="../Styles/header.css">
		<link rel="stylesheet" href="../Styles/transition.css">
		<link rel="stylesheet" href="../Styles/popup.css">

	</head>

	<body>
		<?php 
            include '../PHP/header.php'; 
        ?>

		<section class="game-section">
			<div class="game-container">
				<h2 class="game-title">.</h2>
				<p class="game-description"></p>

				<div class="game-table"></div>

				<div
					id="container-botoes"
					style="
						display: flex;
						flex-direction: column;
						align-items: center;
						gap: 10px;
						margin-top: 20px;
					"
				></div>
			</div>
		</section>

		<main>
			<footer class="site-footer theme-yellow">
				<div class="footer-container">
					<div class="footer-copyright">
						<p>&copy; 2025 Memory Game. Todos os Direitos Reservados.</p>
						<p>Criado com 💛 para Fãs de Pokémon</p>
					</div>
					<div class="footer-social-links">
						<a href="#" title="Nosso Projeto no GitHub">GitHub</a>
						<button id="cheat-button" class="cheat-button nav-link">
                            Trapaça
                        </button>
					</div>
				</div>
			</footer>
		</main>

		<script src="../Scripts/memorygame.js"></script>
		<script src="../Scripts/transition.js" defer></script>
	</body>
</html>

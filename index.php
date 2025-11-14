<?php
$path_prefix = './';
$header_theme_class = 'default';

require_once('./PHP/config.php'); 
?>

<!doctype html>
<html lang="pt-br">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="X-UA-Compatible" content="ie=edge">
		<title>Memory Game</title>

		<link
			href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
			rel="stylesheet"
		>
		<link
			href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
			rel="stylesheet"
		>

		<link rel="stylesheet" href="./Styles/stylebase.css">
		<link rel="stylesheet" href="./Styles/footer.css">
		<link rel="stylesheet" href="./Styles/header.css">
		<link rel="stylesheet" href="./Styles/pokedex.css">
		<link rel="stylesheet" href="./Styles/transition.css">
	</head>
	<body>
		<main>
			<?php 
            include './PHP/header.php'; 
            ?>

			<br>

			<section
				class="pokedex"
				style="display: flex; align-items: center; justify-content: center"
			>
				<div class="pokedex-container">
					<div class="pokedex">
						<div class="topo-pokedex">
							<div class="luz_cima_pokedex">
								<div class="luz_azul_grande"></div>
								<div class="luz_vermelha_pequena"></div>
								<div class="luz_amarela_pequena"></div>
								<div class="luz_verde_pequena"></div>
							</div>
							<div class="tela-container">
								<div id="pokedex-screen-content" class="tela">
									<h2 id="screen-main-title">.</h2>
									<div id="screen-option-display"></div>
									<p id="screen-hint-text"></p>
								</div>
							</div>
						</div>

						<div class="dobrada"></div>

						<div class="pokedex-bottom">
							<div class="bottom-controls-layout">
								<div class="d-pad-container">
									<div class="d-pad">
										<div
											class="d-pad-btn d-pad-left"
											data-direction="left"
										></div>
										<div
											class="d-pad-btn d-pad-right"
											data-direction="right"
										></div>
										<div class="d-pad-up"></div>
										<div class="d-pad-down"></div>
										<div class="d-pad-center"></div>
									</div>
								</div>

								<div class="action-buttons">
									<div class="button-group">
										<button
											id="start-game-btn"
											class="action-btn btn-a"
										></button>
										<label>START</label>
									</div>
									<div class="button-group">
										<button
											id="select-game-btn"
											class="action-btn btn-b"
										></button>
										<label>SELECT</label>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<footer class="site-footer">
				<div class="footer-container">
					<div class="footer-copyright">
						<p>&copy; 2025 Memory Game. Todos os Direitos Reservados.</p>
						<p>Criado com ❤️ para Fãs de Pokémon</p>
					</div>
					<div class="footer-social-links">
						<a href="#" title="Nosso Projeto no GitHub">GitHub</a>
					</div>
				</div>
			</footer>
		</main>

		<script src="Scripts/pokedex.js"></script>
		<script src="Scripts/transition.js" defer></script>
	</body>
</html>

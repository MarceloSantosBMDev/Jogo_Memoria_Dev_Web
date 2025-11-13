<?php
$path_prefix = '../';
$header_theme_class = 'theme-purple';
require_once('../PHP/config.php');
require_once('../PHP/protect.php');      
require_once('../PHP/connection.php'); 

$success_msg = '';
$error_msg = '';
$errors = [];

if (!isset($_SESSION['user_id'])) {
    header('Location: ../login.php');
    exit;
}
$user_id = intval($_SESSION['user_id']);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $full_name = trim($_POST['full_name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $phone = trim($_POST['phone'] ?? '');

    if ($full_name === '') {
        $errors[] = "O nome não pode ficar vazio.";
    }
    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Informe um e-mail válido.";
    }
    if ($phone === '' || strlen(preg_replace('/\D/', '', $phone)) < 8) {
        $errors[] = "Informe um telefone válido.";
    }

    if (empty($errors)) {
        $stmt = $conn->prepare("SELECT id FROM users WHERE email = ? AND id <> ? LIMIT 1");
        $stmt->bind_param('si', $email, $user_id);
        $stmt->execute();
        $stmt->store_result();
        if ($stmt->num_rows > 0) {
            $errors[] = "O email informado já está em uso por outro usuário.";
            $stmt->close();
        } else {
            $stmt->close();

            $params = [];
            $types = '';
            $set_parts = [];

            $set_parts[] = "full_name = ?";
            $types .= 's';
            $params[] = $full_name;

            $set_parts[] = "email = ?";
            $types .= 's';
            $params[] = $email;

            $set_parts[] = "phone = ?";
            $types .= 's';
            $params[] = $phone;

            $sql = "UPDATE users SET " . implode(', ', $set_parts) . " WHERE id = ?";
            $types .= 'i';
            $params[] = $user_id;

            $stmt = $conn->prepare($sql);
            if ($stmt === false) {
                $error_msg = "Erro ao preparar atualização: " . $conn->error;
            } else {
                $bind_names[] = $types;
                for ($i = 0; $i < count($params); $i++) {
                    $bind_name = 'bind' . $i;
                    $$bind_name = $params[$i];
                    $bind_names[] = &$$bind_name;
                }
                call_user_func_array([$stmt, 'bind_param'], $bind_names);

                if ($stmt->execute()) {
                    $success_msg = "Perfil atualizado com sucesso!";
                } else {
                    $error_msg = "Erro ao atualizar perfil: " . $stmt->error;
                }
                $stmt->close();
            }
        }
    }
}

// Buscar dados do usuário
$stmt = $conn->prepare("SELECT username, full_name, email, cpf, birth_date, phone FROM users WHERE id = ? LIMIT 1");
$stmt->bind_param('i', $user_id);
$stmt->execute();
$stmt->bind_result($username, $full_name_db, $email_db, $cpf_db, $birth_date_db, $phone_db);
$stmt->fetch();
$stmt->close();

$display_full_name = $_POST['full_name'] ?? $full_name_db;
$display_email = $_POST['email'] ?? $email_db;
$display_phone = $_POST['phone'] ?? $phone_db;

// Formatar CPF e data
$cpf_formatado = $cpf_db ? preg_replace('/(\d{3})(\d{3})(\d{3})(\d{2})/', '$1.$2.$3-$4', $cpf_db) : '';
$data_formatada = $birth_date_db ? date('d/m/Y', strtotime($birth_date_db)) : '';

$historico_stmt = $conn->prepare("
    SELECT
        game_mode, 
        difficulty, 
        moves, 
        time_seconds, 
        completed,
        played_at 
    FROM game_results 
    WHERE user_id = ? 
    ORDER BY played_at DESC 
    LIMIT 5
");

$historico_stmt->bind_param('i', $user_id);
$historico_stmt->execute();
$historico_stmt->bind_result($game_mode, $difficulty, $moves, $time_seconds, $completed, $played_at);

$historico_partidas = [];
while ($historico_stmt->fetch()) {
    $historico_partidas[] = [
        'game_mode' => $game_mode,
        'difficulty' => $difficulty,
        'moves' => $moves,
        'time_seconds' => $time_seconds,
        'completed' => $completed,
        'played_at' => $played_at
    ];
}
$historico_stmt->close();

$historico_completo_stmt = $conn->prepare("
    SELECT
        game_mode, 
        difficulty, 
        moves, 
        time_seconds, 
        completed,
        played_at 
    FROM game_results 
    WHERE user_id = ? 
    ORDER BY played_at DESC
");

$historico_completo_stmt->bind_param('i', $user_id);
$historico_completo_stmt->execute();
$historico_completo_stmt->bind_result($game_mode, $difficulty, $moves, $time_seconds, $completed, $played_at);

$historico_completo = [];
$total_vitorias = 0;
$total_partidas = 0;

while ($historico_completo_stmt->fetch()) {
    $historico_completo[] = [
        'game_mode' => $game_mode,
        'difficulty' => $difficulty,
        'moves' => $moves,
        'time_seconds' => $time_seconds,
        'completed' => $completed,
        'played_at' => $played_at
    ];
    
    $total_partidas++;
    if ($completed) {
        $total_vitorias++;
    }
}

$historico_completo_stmt->close();

$taxa_vitoria = $total_partidas > 0 ? round(($total_vitorias / $total_partidas) * 100) : 0;
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
		<link rel="stylesheet" href="../Styles/profile.css">
		<link rel="stylesheet" href="../Styles/profile_popup.css">

		<link rel="stylesheet" href="../Styles/footer.css">
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

					<form action="" method="post">
						<h3>Perfil</h3>
						
						<?php if ($success_msg): ?>
							<div class="profile-message success">
								<?= htmlspecialchars($success_msg) ?>
							</div>
						<?php endif; ?>

						<?php if ($error_msg): ?>
							<div class="profile-message error">
								<?= htmlspecialchars($error_msg) ?>
							</div>
						<?php endif; ?>

						<?php if (!empty($errors)): ?>
							<div class="profile-message error">
								<strong>Por favor, corrija os seguintes erros:</strong>
								<ul>
									<?php foreach ($errors as $error): ?>
										<li><?= htmlspecialchars($error) ?></li>
									<?php endforeach; ?>
								</ul>
							</div>
						<?php endif; ?>

						<div class="input-wrapper">
							<span class="info-text">Nome Completo</span>
							<input
								type="text"
								name="full_name"
								id="profile-name"
								class="form-input"
								value="<?= htmlspecialchars($display_full_name) ?>"
								required
								autocomplete="name"
							>
						</div>

						<div class="input-row">
							<div class="input-wrapper half">
								<span class="info-text">Username</span>
								<input
									type="text"
									name="username"
									id="username"
									class="form-input disabled"
									value="<?= htmlspecialchars($username) ?>"
									readonly
									disabled
									autocomplete="username"
									style="background-color: grey;"
								>
							</div>

							<div class="input-wrapper half">
								<span class="info-text">Email</span>
								<input
									type="email"
									name="email"
									id="email"
									class="form-input"
									value="<?= htmlspecialchars($display_email) ?>"
									required
									autocomplete="email"

								>
							</div>
						</div>

						<div class="input-row">
							<div class="input-wrapper half">
								<span class="info-text">CPF</span>
								<input
									type="text"
									name="cpf"
									id="cpf"
									class="form-input disabled"
									value="<?= htmlspecialchars($cpf_formatado) ?>"
									readonly
									disabled
									autocomplete="off"
									style="background-color: grey;"

								>
							</div>

							<div class="input-wrapper half">
								<span class="info-text">Data de Nascimento</span>
								<input
									type="text"
									name="birth_date"
									id="birth_date"
									class="form-input disabled"
									value="<?= htmlspecialchars($data_formatada) ?>"
									readonly
									disabled
									autocomplete="bday"
									style="background-color: grey;"

								>
							</div>
						</div>

						<div class="input-wrapper">
							<span class="info-text">Telefone</span>
							<input
								type="text"
								name="phone"
								id="phone"
								class="form-input"
								value="<?= htmlspecialchars($display_phone) ?>"
								placeholder="(11) 99999-9999"
								required 
								autocomplete="tel"
							>
						</div>

						<button type="submit" class="Submit_Button">Atualizar Perfil</button>
					</form>
				</div>

				<div class="center_container" style="margin: 50px;">
					<div class="shine"></div>
					<form>
						<h3>Histórico</h3>
						
						<?php if (empty($historico_partidas)): ?>
							<div class="no-history">
								<p>Nenhuma partida jogada ainda.</p>
								<p>Comece a jogar para ver seu histórico aqui!</p>
							</div>
						<?php else: ?>
							<ul class="history-list">
								<?php foreach ($historico_partidas as $partida): ?>
									<?php
									$data_formatada = date('d/m/Y | H:i', strtotime($partida['played_at']));
									$modo_jogo = $partida['game_mode'] == 'classico' ? 'Clássico' : 'Contra o Tempo';
									
									$dificuldade_formatada = [
										'2x2' => 'Iniciais',
										'4x4' => 'Raros', 
										'6x6' => 'Lendarios',
										'8x8' => 'Míticos'
									][$partida['difficulty']] ?? $partida['difficulty'];
									
									if ($partida['game_mode'] == 'classico') {
										$jogadas_texto = $partida['moves'] ? "{$partida['moves']} Jogadas" : "N/A Jogadas";
										$detalhes = "Modo {$dificuldade_formatada} - {$modo_jogo} - {$jogadas_texto}";
									} else {
										$tempo_formatado = $partida['time_seconds'] ? gmdate('i:s', $partida['time_seconds']) : 'N/A';
										$detalhes = "Modo {$dificuldade_formatada} - {$modo_jogo} - {$tempo_formatado}";
									}
									
									$resultado = $partida['completed'] ? 'Vitória' : 'Derrota';
									$classe_resultado = $partida['completed'] ? 'victory' : 'defeat';
									?>
									
									<li class="history-item <?= $classe_resultado ?>">
										<div class="game-info">
											<span class="game-date"><?= htmlspecialchars($data_formatada) ?></span>
											<span class="game-details"><?= htmlspecialchars($detalhes) ?></span>
										</div>
										<span class="game-result"><?= htmlspecialchars($resultado) ?></span>
									</li>
								<?php endforeach; ?>
							</ul>
						<?php endif; ?>

						<button
							type="button"
							class="Submit_Button"
							onclick="abrirHistoricoCompleto()"
						>
							Ver Histórico Completo
						</button>
					</form>
				</div>
			</div>

			<div id="historyPopup" class="history-popup-overlay">
				<div class="history-popup">
					<button class="close-popup" onclick="fecharHistoricoCompleto()">×</button>
					
					<div class="history-popup-header">
						<h3>Histórico Completo</h3>
					</div>
					
					<div class="history-popup-content">
						<?php if (empty($historico_completo)): ?>
							<div class="no-history-popup">
								<p>Nenhuma partida jogada ainda.</p>
								<p>Comece a jogar para ver seu histórico aqui!</p>
							</div>
						<?php else: ?>
							<!-- Estatísticas -->
							<div class="history-stats">
								<div class="stat-item">
									<span class="stat-value"><?= $total_partidas ?></span>
									<span class="stat-label">Total de Partidas</span>
								</div>
								<div class="stat-item">
									<span class="stat-value"><?= $total_vitorias ?></span>
									<span class="stat-label">Vitórias</span>
								</div>
								<div class="stat-item">
									<span class="stat-value"><?= $taxa_vitoria ?>%</span>
									<span class="stat-label">Taxa de Vitória</span>
								</div>
							</div>

							<ul class="history-list">
								<?php foreach ($historico_completo as $partida): ?>
									<?php
									$data_formatada = date('d/m/Y H:i', strtotime($partida['played_at']));
									$modo_jogo = $partida['game_mode'] == 'classico' ? 'Clássico' : 'Contra o Tempo';
									
									$dificuldade_formatada = [
										'2x2' => 'Iniciais',
										'4x4' => 'Raros', 
										'6x6' => 'Lendarios',
										'8x8' => 'Míticos'
									][$partida['difficulty']] ?? $partida['difficulty'];
									
									if ($partida['game_mode'] == 'classico') {
										$jogadas_texto = $partida['moves'] ? "{$partida['moves']} Jogadas" : "N/A Jogadas";
										$detalhes = "Modo {$dificuldade_formatada} - {$modo_jogo} - {$jogadas_texto}";
									} else {
										$tempo_formatado = $partida['time_seconds'] ? gmdate('i:s', $partida['time_seconds']) : 'N/A';
										$detalhes = "Modo {$dificuldade_formatada} - {$modo_jogo} - {$tempo_formatado}";
									}
									
									$resultado = $partida['completed'] ? 'Vitória' : 'Derrota';
									$classe_resultado = $partida['completed'] ? 'victory' : 'defeat';
									?>
									
									<li class="history-item <?= $classe_resultado ?>">
										<div class="game-info">
											<span class="game-date"><?= htmlspecialchars($data_formatada) ?></span>
											<span class="game-details"><?= htmlspecialchars($detalhes) ?></span>
										</div>
										<span class="game-result"><?= htmlspecialchars($resultado) ?></span>
									</li>
								<?php endforeach; ?>
							</ul>
						<?php endif; ?>
					</div>
					
					<div class="history-popup-buttons">
						<a href="leaderboard.php" class="popup-button primary">Leaderboard</a>
					</div>
				</div>
			</div>

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
		<script src="../Scripts/profile_popup.js"></script>
	</body>
</html>
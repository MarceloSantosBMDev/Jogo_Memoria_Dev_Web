<?php
require_once('config.php');
require_once('connection.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Método não permitido']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$mode = $data['mode'] ?? 'classico';
$size = $data['size'] ?? '8x8';

$allowedModes = ['classico', 'tempo'];
$allowedSizes = ['2x2', '4x4', '6x6', '8x8'];

if (!in_array($mode, $allowedModes) || !in_array($size, $allowedSizes)) {
    echo json_encode(['status' => 'error', 'message' => 'Parâmetros inválidos']);
    exit;
}

try {
    if ($mode === 'classico') {
        $sql = "
            SELECT u.username, g.moves as best_score
            FROM game_results g
            INNER JOIN users u ON g.user_id = u.id
            WHERE g.game_mode = ? 
            AND g.difficulty = ?
            AND g.completed = TRUE
            AND g.moves IS NOT NULL
            ORDER BY g.moves ASC
            LIMIT 10
        ";
    } else {
        $sql = "
            SELECT u.username, g.time_seconds as best_score
            FROM game_results g
            INNER JOIN users u ON g.user_id = u.id
            WHERE g.game_mode = ? 
            AND g.difficulty = ?
            AND g.completed = TRUE
            AND g.time_seconds IS NOT NULL
            ORDER BY g.time_seconds ASC
            LIMIT 10
        ";
    }

    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ss', $mode, $size);
    $stmt->execute();
    $result = $stmt->get_result();

    $leaderboard = [];
    while ($row = $result->fetch_assoc()) {
        $leaderboard[] = [
            'username' => $row['username'],
            'best_score' => (int)$row['best_score']
        ];
    }

    $stmt->close();

    echo json_encode([
        'status' => 'success',
        'leaderboard' => $leaderboard
    ]);

} catch (Exception $e) {
    error_log("Erro na leaderboard: " . $e->getMessage());
    echo json_encode([
        'status' => 'error',
        'message' => 'Erro interno do servidor'
    ]);
}
?>
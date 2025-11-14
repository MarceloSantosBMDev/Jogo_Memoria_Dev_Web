<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Apenas verificar se existe
error_log("=== SAVE_GAME.PHP INICIADO ===");
error_log("Session Status: " . session_status());
error_log("SESSION disponível: " . (isset($_SESSION) ? 'SIM' : 'NÃO'));
error_log("SESSION data: " . (isset($_SESSION) ? print_r($_SESSION, true) : 'NÃO DEFINIDA'));

try {
    $json_input = file_get_contents('php://input');
    error_log("Dados brutos recebidos: " . $json_input);
    
    if (empty($json_input)) {
        throw new Exception("Nenhum dado recebido");
    }
    
    $data = json_decode($json_input, true);
    
    if ($data === null) {
        throw new Exception("JSON inválido: " . json_last_error_msg());
    }
    
    error_log("Dados decodificados: " . print_r($data, true));

    $user_id = $data['user_id'] ?? null;
    
    if (!$user_id) {
        if (isset($_SESSION) && isset($_SESSION['user_id'])) {
            $user_id = $_SESSION['user_id'];
            error_log("User ID da sessão: " . $user_id);
        } else {
            throw new Exception("ID do usuário não fornecido");
        }
    }
    
    $user_id = intval($user_id);
    error_log("User ID final: " . $user_id);

    // Validação dos dados do jogo
    $game_mode = $data['game_mode'] ?? null;
    $difficulty = $data['difficulty'] ?? null;
    $completed = isset($data['completed']) ? (bool)$data['completed'] : false;
    $moves = (!empty($data['moves']) && is_numeric($data['moves'])) ? (int)$data['moves'] : null;
    $time_seconds = (!empty($data['time_seconds']) && is_numeric($data['time_seconds'])) ? (int)$data['time_seconds'] : null;

    $valid_modes = ['classico', 'tempo'];
    $valid_diffs = ['2x2', '4x4', '6x6', '8x8'];

    if (!in_array($game_mode, $valid_modes)) {
        throw new Exception("Modo de jogo inválido");
    }
    
    if (!in_array($difficulty, $valid_diffs)) {
        throw new Exception("Dificuldade inválida");
    }

    error_log("Dados validados - User: $user_id, Modo: $game_mode, Dificuldade: $difficulty");

    // Carregar conexão
    if (file_exists('config.php')) {
        require_once('config.php');
        error_log("Config.php carregado");
    } else {
        throw new Exception("Arquivo config.php não encontrado");
    }

    // Conexão com banco
    if (!isset($conn) || !$conn) {
        throw new Exception("Conexão com banco de dados não disponível");
    }

    // Inserir no banco
    $sql = "INSERT INTO game_results (user_id, game_mode, difficulty, moves, time_seconds, completed) 
            VALUES (?, ?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception("Erro ao preparar query: " . $conn->error);
    }

    $stmt->bind_param("issiii", $user_id, $game_mode, $difficulty, $moves, $time_seconds, $completed);
    
    if ($stmt->execute()) {
        $insert_id = $conn->insert_id;
        error_log("Query executada com sucesso! ID: " . $insert_id);
        
        echo json_encode([
            'status' => 'success', 
            'message' => 'Resultado salvo com sucesso.',
            'insert_id' => $insert_id
        ]);
    } else {
        throw new Exception("Erro ao executar query: " . $stmt->error);
    }
    
    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    error_log("ERRO: " . $e->getMessage());
    
    echo json_encode([
        'status' => 'error', 
        'message' => $e->getMessage()
    ]);
}
?>
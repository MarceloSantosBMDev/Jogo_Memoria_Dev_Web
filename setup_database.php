<?php
// Setup do banco de dados - Executar apenas uma vez

$host = 'localhost';
$user = 'root';
$pass = '';
$dbname = 'memory_pokemon_game_db';

echo "=== SETUP DO BANCO DE DADOS ===\n\n";

try {
    $conn = new mysqli($host, $user, $pass);
    
    if ($conn->connect_error) {
        throw new Exception("Falha na conexão: " . $conn->connect_error);
    }
    
    echo "✓ Conexão estabelecida\n";
    
    // Criar banco
    $sql = "CREATE DATABASE IF NOT EXISTS $dbname CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
    if ($conn->query($sql) === TRUE) {
        echo "✓ Banco '$dbname' criado\n";
    } else {
        throw new Exception("Erro ao criar banco: " . $conn->error);
    }
    
    $conn->select_db($dbname);
    
    // Tabela users
    $sqlUsers = "CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        cpf VARCHAR(14) UNIQUE NOT NULL,
        birth_date DATE NOT NULL,
        phone VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_username (username),
        INDEX idx_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    if ($conn->query($sqlUsers) === TRUE) {
        echo "✓ Tabela 'users' criada\n";
    } else {
        throw new Exception("Erro: " . $conn->error);
    }
    
    // Tabela game_results
    $sqlGames = "CREATE TABLE IF NOT EXISTS game_results (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        game_mode ENUM('classico', 'tempo') NOT NULL,
        difficulty ENUM('2x2', '4x4', '6x6', '8x8') NOT NULL,
        moves INT NULL,
        time_seconds INT NULL,
        completed BOOLEAN DEFAULT TRUE,
        played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_games (user_id),
        INDEX idx_leaderboard (game_mode, difficulty, moves),
        INDEX idx_leaderboard_time (game_mode, difficulty, time_seconds)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    if ($conn->query($sqlGames) === TRUE) {
        echo "✓ Tabela 'game_results' criada\n\n";
    } else {
        throw new Exception("Erro: " . $conn->error);
    }
    
    // Popular com dados de teste
    echo "=== POPULANDO DADOS DE TESTE ===\n\n";
    
    // Verificar se já existem usuários
    $checkUsers = $conn->query("SELECT COUNT(*) as total FROM users");
    $userCount = $checkUsers->fetch_assoc()['total'];
    
    if ($userCount == 0) {
        // Inserir usuários de teste
        $testUsers = [
            ['ash_ketchum', 'senha123', 'Ash Ketchum', 'ash@pokemon.com', '12345678901', '1990-05-22', '11987654321'],
            ['misty_water', 'senha123', 'Misty Waterflower', 'misty@pokemon.com', '23456789012', '1992-03-15', '11976543210'],
            ['brock_stone', 'senha123', 'Brock Harrison', 'brock@pokemon.com', '34567890123', '1988-08-10', '11965432109'],
            ['gary_oak', 'senha123', 'Gary Oak', 'gary@pokemon.com', '45678901234', '1990-11-30', '11954321098'],
            ['professor_oak', 'senha123', 'Samuel Oak', 'oak@pokemon.com', '56789012345', '1960-01-05', '11943210987']
        ];
        
        foreach ($testUsers as $user) {
            $hashedPassword = password_hash($user[1], PASSWORD_DEFAULT);
            $stmt = $conn->prepare("INSERT INTO users (username, password, full_name, email, cpf, birth_date, phone) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param('sssssss', $user[0], $hashedPassword, $user[2], $user[3], $user[4], $user[5], $user[6]);
            
            if ($stmt->execute()) {
                echo "✓ Usuário '{$user[0]}' criado\n";
            }
            $stmt->close();
        }
        
        echo "\n";
        
        // Inserir partidas de teste
        $testGames = [
            // Ash Ketchum - Clássico
            [1, 'classico', '2x2', 8, null, true],
            [1, 'classico', '4x4', 25, null, true],
            [1, 'classico', '6x6', 45, null, true],
            [1, 'classico', '8x8', 75, null, true],
            [1, 'classico', '2x2', 10, null, true],
            
            // Ash Ketchum - Tempo
            [1, 'tempo', '2x2', null, 15, true],
            [1, 'tempo', '4x4', null, 45, true],
            [1, 'tempo', '6x6', null, 90, true],
            
            // Misty - Clássico
            [2, 'classico', '2x2', 7, null, true],
            [2, 'classico', '4x4', 22, null, true],
            [2, 'classico', '6x6', 50, null, true],
            [2, 'classico', '2x2', 9, null, true],
            [2, 'classico', '4x4', 30, null, false],
            
            // Misty - Tempo
            [2, 'tempo', '2x2', null, 12, true],
            [2, 'tempo', '4x4', null, 40, true],
            [2, 'tempo', '6x6', null, 85, true],
            
            // Brock - Clássico
            [3, 'classico', '2x2', 6, null, true],
            [3, 'classico', '4x4', 20, null, true],
            [3, 'classico', '6x6', 42, null, true],
            [3, 'classico', '8x8', 80, null, true],
            
            // Brock - Tempo
            [3, 'tempo', '2x2', null, 10, true],
            [3, 'tempo', '4x4', null, 38, true],
            [3, 'tempo', '6x6', null, 88, true],
            [3, 'tempo', '8x8', null, 150, true],
            
            // Gary - Clássico (melhor jogador)
            [4, 'classico', '2x2', 5, null, true],
            [4, 'classico', '4x4', 18, null, true],
            [4, 'classico', '6x6', 38, null, true],
            [4, 'classico', '8x8', 68, null, true],
            [4, 'classico', '2x2', 6, null, true],
            
            // Gary - Tempo (melhor tempo)
            [4, 'tempo', '2x2', null, 8, true],
            [4, 'tempo', '4x4', null, 35, true],
            [4, 'tempo', '6x6', null, 75, true],
            [4, 'tempo', '8x8', null, 140, true],
            
            // Professor Oak - Clássico
            [5, 'classico', '2x2', 12, null, true],
            [5, 'classico', '4x4', 35, null, true],
            [5, 'classico', '2x2', 15, null, false],
            
            // Professor Oak - Tempo
            [5, 'tempo', '2x2', null, 20, true],
            [5, 'tempo', '4x4', null, 55, true],
        ];
        
        $stmt = $conn->prepare("INSERT INTO game_results (user_id, game_mode, difficulty, moves, time_seconds, completed) VALUES (?, ?, ?, ?, ?, ?)");
        
        foreach ($testGames as $game) {
            $stmt->bind_param('issiii', $game[0], $game[1], $game[2], $game[3], $game[4], $game[5]);
            $stmt->execute();
        }
        
        $stmt->close();
        echo "✓ " . count($testGames) . " partidas de teste criadas\n\n";
        
    } else {
        echo "⚠ Banco já possui dados, pulando população\n\n";
    }
    
    echo "=== SETUP CONCLUÍDO! ===\n\n";
    echo "Usuários de teste (senha: senha123):\n";
    echo "- ash_ketchum\n";
    echo "- misty_water\n";
    echo "- brock_stone\n";
    echo "- gary_oak (melhor jogador)\n";
    echo "- professor_oak\n\n";
    
    $conn->close();
    
} catch (Exception $e) {
    echo "\n✗ ERRO: " . $e->getMessage() . "\n";
    exit(1);
}
?>
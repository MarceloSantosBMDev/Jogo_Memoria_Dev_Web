<?php
// Script para criar o banco de dados e tabelas necessárias
// EXECUTAR APENAS UMA VEZ

// Configurações do banco
$host = 'localhost';
$user = 'root';
$pass = '';
$dbname = 'memory_pokemon_game_db';

echo "=== SETUP DO BANCO DE DADOS - POKEMON ===\n\n";

try {
    // Conectar ao MySQL (sem selecionar banco)
    $conn = new mysqli($host, $user, $pass);
    
    if ($conn->connect_error) {
        throw new Exception("Falha na conexão: " . $conn->connect_error);
    }
    
    echo "✓ Conexão com MySQL estabelecida\n";
    
    // Criar banco de dados
    $sql = "CREATE DATABASE IF NOT EXISTS $dbname CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
    if ($conn->query($sql) === TRUE) {
        echo "✓ Banco de dados '$dbname' criado/verificado\n";
    } else {
        throw new Exception("Erro ao criar banco: " . $conn->error);
    }
    
    $conn->select_db($dbname);
    echo "✓ Banco de dados selecionado\n\n";
    
    // Criar tabela de usuários
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
        echo "✓ Tabela 'users' criada/verificada\n";
    } else {
        throw new Exception("Erro ao criar tabela users: " . $conn->error);
    }
    
    // Criar tabela de partidas
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
        echo "✓ Tabela 'game_results' criada/verificada\n";
    } else {
        throw new Exception("Erro ao criar tabela game_results: " . $conn->error);
    }
    
    // Criar tabela de rankings (view materializada - opcional)
    $sqlRankings = "CREATE TABLE IF NOT EXISTS leaderboard_cache (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        username VARCHAR(50) NOT NULL,
        game_mode ENUM('classico', 'tempo') NOT NULL,
        difficulty ENUM('2x2', '4x4', '6x6', '8x8') NOT NULL,
        best_score INT NOT NULL,
        rank_position INT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_ranking (user_id, game_mode, difficulty),
        INDEX idx_ranking (game_mode, difficulty, rank_position)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    if ($conn->query($sqlRankings) === TRUE) {
        echo "✓ Tabela 'leaderboard_cache' criada/verificada\n";
    } else {
        throw new Exception("Erro ao criar tabela leaderboard_cache: " . $conn->error);
    }
    
    echo "\n=== SETUP CONCLUÍDO COM SUCESSO! ===\n";
    echo "\nPróximos passos:\n";
    echo "1. Verifique o arquivo PHP/config.php\n";
    echo "2. Certifique-se de que as credenciais do banco estão corretas\n";
    echo "3. Acesse o sistema através de index.php\n";
    echo "\nBanco configurado: $dbname\n";
    echo "Tabelas criadas: users, game_results, leaderboard_cache\n";
    
    $conn->close();
    
} catch (Exception $e) {
    echo "\n✗ ERRO: " . $e->getMessage() . "\n";
    echo "\nVerifique:\n";
    echo "- Se o MySQL/MariaDB está rodando\n";
    echo "- Se as credenciais estão corretas\n";
    echo "- Se o usuário tem permissões suficientes\n";
    exit(1);
}
?>
<?php
// Conexão com o DB
$host = 'localhost';
$user = 'root';
$pass = '';
$dbname = 'memory_pokemon_game_db';

$response = ['success' => false, 'message' => ''];
$errors = [];

function sendResponse($response) {
    echo json_encode($response);
    exit;
}

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    $response['message'] = "Erro de conexão com o banco de dados.";
    sendResponse($response);
}
?>
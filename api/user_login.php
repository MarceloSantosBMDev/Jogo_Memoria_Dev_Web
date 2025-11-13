<?php

include('../PHP/connection.php');

session_start();
header('Content-Type: application/json');

$response = ['success' => false, 'message' => '', 'errors' => []];

$username = trim($conn->real_escape_string($_POST['username'] ?? ''));
$password = $conn->real_escape_string($_POST['password'] ?? '');

if (empty($username) || empty($password)) {
    $response['message'] = 'Usuário ou senha inválidos.';
    sendResponse($response);
}

$sql = "SELECT id, username, password FROM users WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();
    
    if (password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['loggedin'] = true;
        
        $response['success'] = true;
        $response['message'] = "Login bem-sucedido. Redirecionando...";
        
    } else {
        $response['errors']['password'] = 'Senha incorreta.';
        $response['message'] = 'Usuário ou senha inválidos.';
    }
    
} else {
    $response['errors']['username'] = 'Usuário não encontrado.';
    $response['message'] = 'Usuário ou senha inválidos.';
}

$stmt->close();
$conn->close();

sendResponse($response);
?>
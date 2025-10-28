<?php
include('../PHP/connection.php');

session_start();
header('Content-Type: application/json');

$username = trim($_POST['username'] ?? '');
$password = $_POST['password'] ?? '';

if (empty($username) || empty($password)) {
    $response['message'] = 'Usuário ou senha inválidos.';
    sendResponse($response);
}

// SELECT
$sql = "SELECT id, username, password FROM users WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();
    
    // Verifica a senha
    if (password_verify($password, $user['password'])) {
        
        // Cria session
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        
        $response['success'] = true;
        $response['message'] = "Login bem-sucedido. Redirecionando...";
        
    } else {
        // Senha incorreta
        $errors['password'] = 'Senha incorreta.';
        $response['message'] = 'Usuário ou senha inválidos.';
        $response['errors'] = $errors;
    }
    
} else {
    // Usuário não encontrado
    $errors['username'] = 'Usuário não encontrado.';
    $response['message'] = 'Usuário ou senha inválidos.';
    $response['errors'] = $errors;
}

$stmt->close();
$conn->close();

if (!empty($errors) && $response['message'] == 'Usuário ou senha inválidos.') {
    sendResponse($response);
}

sendResponse($response);
?>
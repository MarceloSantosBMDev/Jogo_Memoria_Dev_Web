<?php

include('../PHP/connection.php');
header('Content-Type: application/json');

$response = ['success' => false, 'message' => '', 'errors' => []];
$errors = [];

$username = trim($conn->real_escape_string($_POST['username'] ?? ''));
$password = ($conn->real_escape_string($_POST['password'] ?? ''));
$full_name = trim($conn->real_escape_string($_POST['Nome'] ?? ''));
$email = trim($conn->real_escape_string($_POST['Email'] ?? ''));
$cpf = trim($conn->real_escape_string($_POST['CPF'] ?? ''));
$birth_date_raw = trim($conn->real_escape_string($_POST['data'] ?? ''));
$phone = trim($conn->real_escape_string($_POST['Telefone'] ?? ''));

$cpf_clean = preg_replace('/[^0-9]/', '', $cpf);
$phone_clean = preg_replace('/[^0-9]/', '', $phone);
$birth_date = null;

if (!empty($birth_date_raw)) {
    $date_obj = DateTime::createFromFormat('d/m/Y', $birth_date_raw);
    if ($date_obj) {
        $birth_date = $date_obj->format('Y-m-d');
    }
}


if (empty($username) || empty($password) || empty($email) || empty($cpf_clean) || empty($birth_date) || empty($phone_clean)) {
    $response['message'] = 'Todos os campos obrigatórios devem ser preenchidos.';
} else {
    $stmt = $conn->prepare("SELECT username, email, cpf, phone FROM users WHERE username = ? OR email = ? OR cpf = ? OR phone = ?");
    $stmt->bind_param("ssss", $username, $email, $cpf_clean, $phone_clean);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        
        if ($row['username'] === $username) {
            $errors['username'] = 'Este usuário já está em uso.';
        }
        if ($row['email'] === $email) {
            $errors['Email'] = 'Este e-mail já está cadastrado.';
        }
        if ($row['cpf'] === $cpf_clean) {
            $errors['CPF'] = 'Este CPF já está cadastrado.';
        }
        if ($row['phone'] === $phone_clean) {
            $errors['Telefone'] = 'Este telefone já está cadastrado.';
        }
    }
    $stmt->close();
}


if (!empty($errors)) {
    $response['message'] = 'Verifique os erros de validação.';
    $response['errors'] = $errors;
    sendResponse($response);
}

if (empty($errors) && $response['message'] === '') {

    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    $sql = "INSERT INTO users (username, password, full_name, email, cpf, birth_date, phone) VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssss", $username, $hashed_password, $full_name, $email, $cpf_clean, $birth_date, $phone_clean);
    
    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = "Cadastro realizado! Você será redirecionado para o login.";
    } else {
        $response['message'] = "Erro ao registrar usuário: " . $stmt->error;
    }
    
    $stmt->close();
} else if (empty($errors)) {
    // $response['message'] já foi definida como 'Todos os campos...'
}

$conn->close();
sendResponse($response);
?>
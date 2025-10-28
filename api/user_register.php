<?php
include('../PHP/connection.php');
header('Content-Type: application/json');

$username = trim($_POST['username'] ?? '');
$password = $_POST['password'] ?? '';
$full_name = trim($_POST['Nome'] ?? '');
$email = trim($_POST['Email'] ?? '');
$cpf = trim($_POST['CPF'] ?? '');
$birth_date_raw = trim($_POST['data'] ?? ''); // DD/MM/AAAA
$phone = trim($_POST['Telefone'] ?? '');

$cpf_clean = preg_replace('/[^0-9]/', '', $cpf);
$phone_clean = preg_replace('/[^0-9]/', '', $phone);
$birth_date = DateTime::createFromFormat('d/m/Y', $birth_date_raw)->format('Y-m-d');


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

// INSERT
if (empty($errors)) {

    // Hash da senha
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    $sql = "INSERT INTO users (username, password, full_name, email, cpf, birth_date, phone) VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssss", $username, $hashed_password, $full_name, $email, $cpf_clean, $birth_date, $phone_clean);
    
    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = "Cadastro realizado com sucesso! Você será redirecionado para o login.";
    } else {
        // Erro
        $response['message'] = "Erro ao registrar usuário: " . $stmt->error;
    }
    
    $stmt->close();
}

$conn->close();
sendResponse($response);
?>
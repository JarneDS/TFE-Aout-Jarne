<?php

session_start();
require __DIR__ . '/database.php';
require __DIR__ . '/classes/User.php';

header('Content-Type: application/json');

$user = new User($db);

$username = $_POST['username'] ?? null;
$email = $_POST['email'] ?? null;
$password = $_POST['password'] ?? null;

if (!$username || !$email || !$password) {
    echo json_encode(['message' => 'Champs manquants']);
    exit;
}

$created = $user->register($username, $email, $password);

echo json_encode([
    'message' => $created 
        ? 'Compte créé avec succès'
        : 'Cet email est déjà utilisé'
]);

?>

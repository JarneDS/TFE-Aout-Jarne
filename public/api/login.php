<?php

    session_start();
    require __DIR__ . '/database.php';
    require __DIR__ . '/classes/User.php';

    header('Content-Type: application/json');

    $user = new User($db);

    $email = $_POST['email'] ?? null;
    $password = $_POST['mdp'] ?? null;

    if (!$email || !$password) {
        echo json_encode(['message' => 'Champs manquants']);
        exit;
    }

    $logged = $user->login($email, $password);

    echo json_encode([
        'message' => $logged 
            ? 'Connexion réussie'
            : 'Email ou mot de passe incorrect'
    ]);

?>

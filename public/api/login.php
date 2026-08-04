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

    if ($logged) {
        echo json_encode([
            'message' => 'Connexion réussie',
            'userId' => $_SESSION['user']['id'],
            'nom' => $_SESSION['user']['nom'],
            'prenom' => $_SESSION['user']['prenom'],
            'email' => $_SESSION['user']['email'],
            'image' => $_SESSION['user']['image']
        ]);
    } else {
        echo json_encode([
            'message' => 'Email ou mot de passe incorrect'
        ]);
    }

?>

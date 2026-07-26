<?php
    header('Content-Type: application/json');
    require_once __DIR__ . '/database.php';
    require_once __DIR__ . '/classes/User.php';

    $nom = $_POST['nom'] ?? '';
    $prenom = $_POST['prenom'] ?? '';
    $email = $_POST['email'] ?? '';
    $mdp = $_POST['mdp'] ?? '';

    if (!$nom || !$prenom || !$email || !$mdp) {
        echo json_encode(['success' => false, 'message' => 'Champs manquants']);
        exit;
    }

    // Upload image
    $imagePath = null;

    if (!empty($_FILES['image']['name'])) {
        $uploadDir = __DIR__ . '/../uploads/';
        if (!is_dir($uploadDir)) mkdir($uploadDir);

        $fileName = uniqid() . '_' . basename($_FILES['image']['name']);
        $targetFile = $uploadDir . $fileName;

        if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
            $imagePath = '/uploads/' . $fileName;
        }
    }

    $user = new User($db);
    $created = $user->register($nom, $prenom, $email, $mdp, $imagePath);

    echo json_encode(['success' => $created]);
?>

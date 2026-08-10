<?php
    session_start();
    require __DIR__ . '/database.php';
    require __DIR__ . '/classes/User.php';

    $userClass = new User($db);

    $nom = $_POST['nom'] ?? null;
    $prenom = $_POST['prenom'] ?? null;
    $email = $_POST['email'] ?? null;
    $mdp = $_POST['mdp'] ?? null;

    if (!$nom || !$prenom || !$email || !$mdp) {
        echo json_encode(['success' => false, 'error' => 'Champs manquants']);
        exit;
    }

    // valider l'email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'error' => 'Email invalide']);
        exit;
    }

    $imagePath = null;

    if (!empty($_FILES['image']['name'])) {
        $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        $ext = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));

        // 1. Vérifier l'extension
        if (!in_array($ext, $allowed)) {
            echo json_encode(['success' => false, 'error' => 'Format interdit']);
            exit;
        }

        // 2. Vérifier le type MIME réel
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->file($_FILES['image']['tmp_name']);
        if (!str_starts_with($mimeType, 'image/')) {
            echo json_encode(['success' => false, 'error' => 'Pas une vraie image']);
            exit;
        }

        // 3. Vérifier la taille (max 2 Mo)
        if ($_FILES['image']['size'] > 2 * 1024 * 1024) {
            echo json_encode(['success' => false, 'error' => 'Image trop lourde']);
            exit;
        }

        // 4. Nom sécurisé (AVANT de construire $target)
        $fileName = uniqid('', true) . '.' . $ext;

        // 5. Chemin serveur
        $target = __DIR__ . "/../uploads/" . $fileName;

        // 6. Upload
        if (!move_uploaded_file($_FILES['image']['tmp_name'], $target)) {
            echo json_encode(['success' => false, 'error' => 'Échec upload']);
            exit;
        }

        // 7. Chemin public
        $imagePath = "/projets/tfe-aout/uploads/" . $fileName;
    }

    $success = $userClass->register($nom, $prenom, $email, $mdp, $imagePath);

    if ($success) {

        $_SESSION['user'] = [
            'id' => $db->lastInsertId(),
            'nom' => $nom,
            'prenom' => $prenom,
            'email' => $email,
            'image' => $imagePath
        ];

        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false]);
    }

?>

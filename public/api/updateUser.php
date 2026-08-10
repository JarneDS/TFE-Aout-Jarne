<?php
    session_start();
    require __DIR__ . '/database.php';
    require __DIR__ . '/classes/User.php';

    if (!isset($_SESSION['user'])) {
        echo json_encode(['success' => false, 'message' => 'Non connecté']);
        exit;
    }

    $id = $_SESSION['user']['id'];

    $nom = $_POST['nom'];
    $prenom = $_POST['prenom'];
    $email = $_POST['email'];
    $mdp = $_POST['mdp'] ?? null;

    // Upload image si nouvelle image
    $imagePath = $_SESSION['user']['image'];

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

    // Update SQL
    $stmt = $db->prepare("
        UPDATE users 
        SET nom = ?, prenom = ?, email = ?, image = ?
        " . ($mdp ? ", password = ?" : "") . "
        WHERE id = ?
    ");

    $params = [$nom, $prenom, $email, $imagePath];

    if ($mdp) {
        $params[] = password_hash($mdp, PASSWORD_DEFAULT);
    }

    $params[] = $id;

    $stmt->execute($params);

    // Mettre à jour la session
    $_SESSION['user']['nom'] = $nom;
    $_SESSION['user']['prenom'] = $prenom;
    $_SESSION['user']['email'] = $email;
    $_SESSION['user']['image'] = $imagePath;

    echo json_encode(['success' => true]);

?>

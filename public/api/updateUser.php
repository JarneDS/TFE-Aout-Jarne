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
        $fileName = uniqid() . "_" . $_FILES['image']['name'];
        $target = __DIR__ . "/../uploads/" . $fileName;

        move_uploaded_file($_FILES['image']['tmp_name'], $target);
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

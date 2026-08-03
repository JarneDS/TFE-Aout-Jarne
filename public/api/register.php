<?php
    session_start();
    require __DIR__ . '/database.php';
    require __DIR__ . '/classes/User.php';

    $userClass = new User($db);

    $nom = $_POST['nom'];
    $prenom = $_POST['prenom'];
    $email = $_POST['email'];
    $mdp = $_POST['mdp'];

    $imagePath = null;

    if (!empty($_FILES['image']['name'])) {
        $fileName = uniqid() . "_" . $_FILES['image']['name'];
        $target = __DIR__ . "/../uploads/" . $fileName;
        move_uploaded_file($_FILES['image']['tmp_name'], $target);
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

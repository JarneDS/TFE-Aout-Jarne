<?php
    require __DIR__ . '/database.php';
    header("Content-Type: application/json");

    // Récupérer les problèmes d'une voiture
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $voitureId = $_GET['voitureId'];

        $stmt = $pdo->prepare("SELECT * FROM problemes WHERE voiture_id = ? ORDER BY date_survenance DESC");
        $stmt->execute([$voitureId]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        exit;
    }

    // Ajouter un problème
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);

        $stmt = $pdo->prepare("
            INSERT INTO problemes (voiture_id, type_probleme, description, date_survenance)
            VALUES (?, ?, ?, ?)
        ");

        $stmt->execute([
            $data['voitureId'],
            $data['type_probleme'],
            $data['description'],
            $data['date_survenance']
        ]);

        echo json_encode(["success" => true]);
        exit;
    }

    // Modifier le statut
    if ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
        $data = json_decode(file_get_contents("php://input"), true);

        $stmt = $pdo->prepare("UPDATE problemes SET statut = ? WHERE id = ?");
        $stmt->execute([$data['statut'], $data['id']]);

        echo json_encode(["success" => true]);
        exit;
    }

    // Supprimer un problème
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $id = $_GET['id'];

        $stmt = $pdo->prepare("DELETE FROM problemes WHERE id = ?");
        $stmt->execute([$id]);

        echo json_encode(["success" => true]);
        exit;
    }
    
?>

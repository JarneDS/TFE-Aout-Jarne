<?php
    require __DIR__ . '/database.php';
    header("Content-Type: application/json");

    // Récupérer une voiture par son ID
    if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['voitureId'])) {

        $id = $_GET['voitureId'];

        $stmt = $db->prepare("SELECT * FROM voitures WHERE id = ?");
        $stmt->execute([$id]);
        $voiture = $stmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode([
            "success" => true,
            "voiture" => $voiture
        ]);
        exit;
    }

    // GET : récupérer les voitures d'un user
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {

        $userId = $_GET['userId'] ?? null;

        if (!$userId) {
            echo json_encode(["success" => false, "error" => "userId manquant"]);
            exit;
        }

        $stmt = $db->prepare("SELECT * FROM voitures WHERE user_id = ?");
        $stmt->execute([$userId]);
        $voitures = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "success" => true,
            "voitures" => $voitures
        ]);
        exit;
    }

    // UPDATE : modifier une voiture
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['update'])) {

        $data = json_decode(file_get_contents("php://input"), true);

        if (!$data || !isset($data['id'])) {
            echo json_encode(["success" => false, "error" => "id manquant"]);
            exit;
        }

        $stmt = $db->prepare("
            UPDATE voitures
            SET marque = ?, modele = ?, type = ?, kmParcourues = ?, moisConstruction = ?, anneeConstruction = ?
            WHERE id = ?
        ");

        $stmt->execute([
            $data['marque'],
            $data['modele'],
            $data['type'],
            $data['kmParcourues'],
            $data['moisConstruction'],
            $data['anneeConstruction'],
            $data['id']
        ]);

        echo json_encode(["success" => true]);
        exit;
    }

    // POST : ajouter une voiture
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {

        $data = json_decode(file_get_contents("php://input"), true);

        if (!$data) {
            echo json_encode(["success" => false, "error" => "JSON invalide"]);
            exit;
        }

        $stmt = $db->prepare("
            INSERT INTO voitures (user_id, marque, modele, type, kmParcourues, moisConstruction, anneeConstruction)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");

        $stmt->execute([
            $data['userId'],
            $data['marque'],
            $data['modele'],
            $data['type'],
            $data['kmParcourues'],
            $data['moisConstruction'],
            $data['anneeConstruction']
        ]);

        echo json_encode(["success" => true]);
        exit;
    }

    // DELETE : supprimer une voiture
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {

        $id = $_GET['id'] ?? null;

        if (!$id) {
            echo json_encode(["success" => false, "error" => "id manquant"]);
            exit;
        }

        $stmt = $db->prepare("DELETE FROM voitures WHERE id = ?");
        $stmt->execute([$id]);

        echo json_encode(["success" => true]);
        exit;
    }
?>
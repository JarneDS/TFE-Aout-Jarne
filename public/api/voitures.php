<?php
    session_start();
    require __DIR__ . '/database.php';
    header("Content-Type: application/json");

    // Auth
    if (!isset($_SESSION['user'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Non connecté']);
        exit;
    }

    $userId = $_SESSION['user']['id'];
    $method = $_SERVER['REQUEST_METHOD'];

    // DELETE : supprimer une voiture
    if ($method === 'DELETE') {

        // Récupération manuelle de l'id dans l'URL
        $id = null;
        if (isset($_SERVER['QUERY_STRING'])) {
            parse_str($_SERVER['QUERY_STRING'], $params);
            $id = $params['id'] ?? null;
        }

        if (!$id) {
            echo json_encode(["success" => false, "error" => "id manquant"]);
            exit;
        }

        $stmt = $db->prepare("DELETE FROM voitures WHERE id = ? AND user_id = ?");
        $stmt->execute([$id, $userId]);

        echo json_encode(["success" => true]);
        exit;
    }

    // GET : récupérer une voiture par ID
    if ($method === 'GET' && isset($_GET['voitureId'])) {

        $id = $_GET['voitureId'];

        $stmt = $db->prepare("SELECT * FROM voitures WHERE id = ? AND user_id = ?");
        $stmt->execute([$id, $userId]);
        $voiture = $stmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode(["success" => true, "voiture" => $voiture]);
        exit;
    }

    // GET : récupérer toutes les voitures du user
    if ($method === 'GET') {

        $stmt = $db->prepare("SELECT * FROM voitures WHERE user_id = ?");
        $stmt->execute([$userId]);
        $voitures = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(["success" => true, "voitures" => $voitures]);
        exit;
    }

    // POST : update voiture
    if ($method === 'POST' && isset($_GET['update'])) {

        $data = json_decode(file_get_contents("php://input"), true);

        if (!$data || !isset($data['id'])) {
            echo json_encode(["success" => false, "error" => "id manquant"]);
            exit;
        }

        $stmt = $db->prepare("
            UPDATE voitures
            SET marque = ?, modele = ?, type = ?, kmParcourues = ?, moisConstruction = ?, anneeConstruction = ?
            WHERE id = ? AND user_id = ?
        ");

        $stmt->execute([
            $data['marque'],
            $data['modele'],
            $data['type'],
            $data['kmParcourues'],
            $data['moisConstruction'],
            $data['anneeConstruction'],
            $data['id'],
            $userId
        ]);

        echo json_encode(["success" => true]);
        exit;
    }

    // POST : ajouter une voiture
    if ($method === 'POST') {

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
            $userId,
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
?>

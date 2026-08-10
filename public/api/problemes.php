<?php
    session_start();
    require __DIR__ . '/database.php';
    header("Content-Type: application/json");

    if (getenv('APP_ENV') === 'dev') {
        ini_set('display_errors', 1);
        error_reporting(E_ALL);
    }

    // AUTHENTIFICATION OBLIGATOIRE
    if (!isset($_SESSION['user'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Non connecté']);
        exit;
    }

    $userId = $_SESSION['user']['id'];

    // GET : récupérer les problèmes
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $stmt = $db->prepare("SELECT * FROM voitures WHERE user_id = ?");
        $stmt->execute([$userId]);

        if (!isset($_GET['voitureId'])) {
            echo json_encode(["success" => false, "error" => "voitureId manquant"]);
            exit;
        }

        $voitureId = $_GET['voitureId'];

        $stmt = $db->prepare("SELECT * FROM problemes WHERE voiture_id = ? ORDER BY date_survenance DESC");
        $stmt->execute([$voitureId]);

        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        exit;
    }

    // POST : ajouter un problème
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && !isset($_GET['update'])) {

        $data = json_decode(file_get_contents("php://input"), true);

        $stmt = $db->prepare("
            INSERT INTO problemes (voiture_id, type_probleme, description, date_survenance, statut)
            VALUES (?, ?, ?, ?, 'En cours')
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

    // POST update : modifier statut
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['update'])) {

        $data = json_decode(file_get_contents("php://input"), true);

        $stmt = $db->prepare("UPDATE problemes SET statut = ? WHERE id = ?");
        $stmt->execute([$data['statut'], $data['id']]);

        echo json_encode(["success" => true]);
        exit;
    }

    // DELETE : supprimer un problème
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $stmt = $db->prepare("DELETE FROM voitures WHERE id = ? AND user_id = ?");
        $stmt->execute([$id, $userId]);

        if (!isset($_GET['id'])) {
            echo json_encode(["success" => false, "error" => "id manquant"]);
            exit;
        }

        $id = $_GET['id'];

        $stmt = $db->prepare("DELETE FROM problemes WHERE id = ?");
        $stmt->execute([$id]);

        echo json_encode(["success" => true]);
        exit;
    }
?>

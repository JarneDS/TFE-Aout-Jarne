<?php
    session_start();
    require __DIR__ . '/database.php';

    if (!isset($_SESSION['user'])) {
        echo json_encode(['success' => false]);
        exit;
    }

    $id = $_SESSION['user']['id'];

    $stmt = $db->prepare("DELETE FROM users WHERE id = ?");
    $stmt->execute([$id]);

    session_destroy();

    echo json_encode(['success' => true]);

?>

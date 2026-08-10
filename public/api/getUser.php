<?php
    session_start();
    header('Content-Type: application/json');

    if (!isset($_SESSION['user'])) {
        echo json_encode(['logged' => false]);
        exit;
    }

    echo json_encode([
        'logged' => true,
        'user' => $_SESSION['user']
    ]);
?>

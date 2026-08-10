<?php
    /* Essayer de créer un fichier .env pour protéger les informations sensibles mais aucun moyen trouver de le faire fonctionner avec OVH */
    $dsn  = getenv('DB_DSN')  ?: 'mysql:host=jarnedl561.mysql.db;dbname=jarnedl561;charset=utf8';
    $user = getenv('DB_USER') ?: 'jarnedl561';
    $pass = getenv('DB_PASS') ?: 'Mignolet2004';

    $db = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
?>

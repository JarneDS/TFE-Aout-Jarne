<?php
$dsn  = getenv('DB_DSN')  ?: 'mysql:host=localhost;dbname=tfe;charset=utf8';
$user = getenv('DB_USER') ?: 'root';
$pass = getenv('DB_PASS') ?: '';

$db = new PDO($dsn, $user, $pass, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);

?>

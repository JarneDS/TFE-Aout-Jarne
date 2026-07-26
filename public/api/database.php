<?php

$dsn = "mysql:host=jarnedl561.mysql.db;dbname=jarnedl561;charset=utf8";
$user = "jarnedl561";
$pass = "Mignolet2004";

$db = new PDO($dsn, $user, $pass, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
]);

?>

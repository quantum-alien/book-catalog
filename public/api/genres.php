<?php

declare(strict_types=1);

require __DIR__ . '/config.php';

$pdo = get_pdo();

$stmt   = $pdo->query('SELECT DISTINCT genre FROM books ORDER BY genre ASC');
$genres = array_column($stmt->fetchAll(), 'genre');

echo json_encode($genres, JSON_UNESCAPED_UNICODE);

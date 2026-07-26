<?php

declare(strict_types=1);

require __DIR__ . '/config.php';

$pdo = get_pdo();

$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

if (!$id) {
    send_error(400, 'A valid numeric "id" query parameter is required.');
}

$stmt = $pdo->prepare('SELECT * FROM books WHERE id = :id');
$stmt->execute([':id' => $id]);
$book = $stmt->fetch();

if (!$book) {
    send_error(404, "No book found with id {$id}.");
}

echo json_encode($book, JSON_UNESCAPED_UNICODE);

<?php

declare(strict_types=1);

require __DIR__ . '/config.php';

$pdo = get_pdo();

$search = trim((string) ($_GET['search'] ?? ''));
$genre  = trim((string) ($_GET['genre'] ?? ''));
$sort   = (string) ($_GET['sort'] ?? 'title');
$order  = strtolower((string) ($_GET['order'] ?? 'asc'));

$allowedSorts = ['title', 'author', 'published_year'];
$allowedOrder = ['asc', 'desc'];

if (!in_array($sort, $allowedSorts, true)) {
    send_error(400, "Invalid sort field. Allowed values: " . implode(', ', $allowedSorts));
}

if (!in_array($order, $allowedOrder, true)) {
    send_error(400, "Invalid order value. Allowed values: " . implode(', ', $allowedOrder));
}

$where  = [];
$params = [];

if ($search !== '') {
    $searchableColumns = ['title', 'author', 'genre', 'call_number', 'description'];
    $searchClauses     = array_map(static function (string $column): string {
        return $column . ' LIKE :search';
    }, $searchableColumns);

    $where[]          = '(' . implode(' OR ', $searchClauses) . ')';
    $params[':search'] = '%' . $search . '%';
}

if ($genre !== '') {
    $where[]          = 'genre = :genre';
    $params[':genre'] = $genre;
}

$sql = 'SELECT id, title, author, genre, published_year, call_number FROM books';

if (!empty($where)) {
    $sql .= ' WHERE ' . implode(' AND ', $where);
}

$sql .= " ORDER BY {$sort} COLLATE NOCASE " . strtoupper($order);

$stmt = $pdo->prepare($sql);
$stmt->execute($params);

echo json_encode($stmt->fetchAll(), JSON_UNESCAPED_UNICODE);

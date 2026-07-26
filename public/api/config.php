<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function send_error(int $statusCode, string $message): void
{
    http_response_code($statusCode);
    echo json_encode(['error' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

function get_pdo(): PDO
{
    static $pdo = null;

    if ($pdo !== null) {
        return $pdo;
    }

    $projectRoot = dirname(__DIR__, 2);
    $dataDir     = $projectRoot . '/data';
    $dbPath      = $dataDir . '/library.sqlite';
    $schemaPath  = $projectRoot . '/database/schema.sql';

    if (!is_dir($dataDir)) {
        mkdir($dataDir, 0775, true);
    }

    $needsInit = !file_exists($dbPath) || filesize($dbPath) === 0;

    try {
        $pdo = new PDO('sqlite:' . $dbPath);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        $pdo->exec('PRAGMA foreign_keys = ON;');

        if ($needsInit) {
            if (!file_exists($schemaPath)) {
                throw new RuntimeException('Schema file not found at ' . $schemaPath);
            }
            $pdo->exec((string) file_get_contents($schemaPath));
        }
    } catch (Throwable $e) {
        send_error(500, 'Database initialization failed: ' . $e->getMessage());
    }

    return $pdo;
}

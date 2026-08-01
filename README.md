# The Reading Room — Book Catalog

A small library-catalog web app: browse a shelf of books, search and filter
them, and click any cover to open a card-catalog-style detail view with the
full description. Built as a portfolio project with a vanilla JS frontend and
a PHP + SQLite backend.

![PHP](https://img.shields.io/badge/PHP-8.0%2B-777bb4)
![SQLite](https://img.shields.io/badge/database-SQLite-003b57)
![No frameworks](https://img.shields.io/badge/frontend-vanilla%20JS-f0db4f)

## Features

- **Live search** across title and author, debounced and reflected in the URL
  so a search is shareable as a link.
- **Genre filter** and **sort by title / author / year**, ascending or
  descending.
- **Book detail modal** styled like a library index card, showing the full
  synopsis, genre, publication year, and a generated call number.
- **Zero-config backend**: the SQLite database is created and seeded
  automatically from `database/schema.sql` the first time the API runs — no
  manual database setup, no external services.
- Accessible by default: keyboard-operable cards and modal, visible focus
  states, `aria-live` result counts, and respect for `prefers-reduced-motion`.
- No jQuery, no Bootstrap, no build step — just a REST-ish PHP API and plain
  JavaScript on the frontend.

## Tech stack

| Layer     | Choice                                   |
|-----------|-------------------------------------------|
| Frontend  | HTML, CSS, vanilla JavaScript (`fetch`)    |
| Backend   | PHP 8 (PDO)                                |
| Database  | SQLite (file-based, auto-created)          |
| Fonts     | Fraunces, Inter, IBM Plex Mono (Google Fonts) |

## Project structure

```
book-catalog/
├── public/                 # Document root — point your web server here
│   ├── index.html
│   ├── css/style.css
│   ├── js/app.js
│   └── api/
│       ├── config.php      # DB connection + auto-init from schema.sql
│       ├── books.php       # GET list of books (search / filter / sort)
│       ├── book.php        # GET a single book by id
│       └── genres.php      # GET distinct genres for the filter dropdown
├── database/
│   └── schema.sql          # Table definition + seed data (11 books)
├── data/                   # SQLite file lives here once created (gitignored)
└── README.md
```

## Getting started

**Requirements:** PHP 8.0+ with the `pdo_sqlite` extension (bundled with PHP
by default on most systems).

```bash
git clone https://github.com/quantum-alien/book-catalog.git
cd book-catalog
php -S localhost:8000 -t public
```

Then open **http://localhost:8000**. The database file at `data/library.sqlite`
is created and seeded automatically on the first API request — nothing else
to configure.

To start over with a clean database, just delete `data/library.sqlite` and
reload the page.

## API reference

All endpoints return JSON.

### `GET /api/books.php`

Returns a list of books. All query parameters are optional.

| Parameter | Type   | Default | Notes                                          |
|-----------|--------|---------|-------------------------------------------------|
| `search`  | string | —       | Matches against title or author (case-insensitive) |
| `genre`   | string | —       | Exact match against a genre returned by `/api/genres.php` |
| `sort`    | string | `title` | One of `title`, `author`, `published_year`       |
| `order`   | string | `asc`   | `asc` or `desc`                                  |

```bash
curl "http://localhost:8000/api/books.php?search=dostoevsky&sort=published_year&order=asc"
```

### `GET /api/book.php?id={id}`

Returns full details for a single book, including its description. Responds
with `404` if the id doesn't exist.

### `GET /api/genres.php`

Returns a sorted array of distinct genre strings, used to populate the genre
filter dropdown.

## Design notes

The visual language treats each book card like a cloth-bound cover: a
deterministic color is derived from the book's title and author, so the same
book always gets the same "binding" color without needing any cover images.
The detail modal is laid out like a library card-catalog entry, with a
generated call number and a rotated genre stamp.

## Possible next steps

- Pagination or infinite scroll once the catalog grows past a shelf's worth
  of books.
- An admin view (with authentication) for adding and editing books instead of
  editing `schema.sql` by hand.
- Swap SQLite for MySQL/PostgreSQL by changing the DSN in `config.php` — the
  rest of the API is database-agnostic SQL.
  

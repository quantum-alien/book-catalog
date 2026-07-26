CREATE TABLE IF NOT EXISTS books (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    title           TEXT NOT NULL,
    author          TEXT NOT NULL,
    genre           TEXT NOT NULL,
    published_year  INTEGER NOT NULL,
    call_number     TEXT NOT NULL,
    description     TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_books_title  ON books (title);
CREATE INDEX IF NOT EXISTS idx_books_author ON books (author);
CREATE INDEX IF NOT EXISTS idx_books_genre  ON books (genre);

INSERT INTO books (title, author, genre, published_year, call_number, description) VALUES
('Collected Stories', 'Vladimir Nabokov', 'Short Fiction', 1995, '813.54 NAB',
 'A wide-ranging gathering of Nabokov''s short fiction, moving between émigré Berlin, half-remembered Russian childhoods, and quietly uncanny turns of fate. The stories share his trademark precision of language and an interest in memory as something that can be revisited but never fully recovered.'),

('The Master and Margarita', 'Mikhail Bulgakov', 'Satire', 1967, '891.73 BUL',
 'The devil arrives in 1930s Moscow accompanied by a talking cat and a retinue of tricksters, exposing the greed and cowardice of the literary establishment. Woven through the chaos is the story of a persecuted writer, his devoted Margarita, and a retelling of Pontius Pilate''s reluctant judgment of Christ.'),

('White Nights', 'Fyodor Dostoevsky', 'Novella', 1848, '891.73 DOS',
 'Over four sleepless nights, a lonely dreamer in St. Petersburg falls for a young woman waiting for a man who may never return. Tender and melancholic, it is a study of loneliness and the gap between the lives people imagine and the ones they actually live.'),

('Crime and Punishment', 'Fyodor Dostoevsky', 'Psychological Fiction', 1866, '891.73 DOS',
 'A destitute former student convinces himself that a calculated murder can be justified by a higher purpose, then spends the rest of the novel unravelling under the weight of guilt. It remains one of the sharpest fictional examinations of conscience ever written.'),

('War and Peace', 'Leo Tolstoy', 'Historical Fiction', 1869, '891.73 TOL',
 'Five aristocratic families are swept up in the Napoleonic Wars, their private hopes and disappointments set against the invasion of Russia. Tolstoy moves fluidly between ballroom and battlefield, arguing throughout that history is made as much by ordinary choices as by generals.'),

('Anna Karenina', 'Leo Tolstoy', 'Tragedy', 1878, '891.73 TOL',
 'An affair between a married woman and a cavalry officer collides with the rigid expectations of Russian high society. Alongside it runs the quieter story of a landowner searching for meaning in work and family, offering a counterpoint to Anna''s unraveling.'),

('Dead Souls', 'Nikolai Gogol', 'Satire', 1842, '891.73 GOG',
 'A con man travels the Russian countryside buying up the paperwork of deceased serfs, hoping to use the fictitious estate as collateral. Gogol''s satire of provincial greed and bureaucratic absurdity is as much a portrait of a nation as it is a picaresque comedy.'),

('The Cherry Orchard', 'Anton Chekhov', 'Drama', 1904, '891.72 CHE',
 'A family returns to their ancestral estate to find the orchard, and their old way of life, about to be auctioned off. Chekhov''s final play balances comedy and grief as its characters fail, again and again, to act before time runs out.'),

('Eugene Onegin', 'Alexander Pushkin', 'Verse Novel', 1833, '891.71 PUS',
 'A bored aristocrat rejects the earnest love of a young woman, only to regret it years later when their positions have reversed. Told entirely in verse, it is both a love story and a sly commentary on the manners of its era.'),

('Fathers and Sons', 'Ivan Turgenev', 'Social Fiction', 1862, '891.73 TUR',
 'A young nihilist returns home from university and clashes with his father''s generation over love, science, and tradition. The novel captures the generational rift in 19th-century Russia with a sympathy that spares neither side.'),

('The Story of One Gang', 'Ilya Stogov', 'Contemporary Fiction', 2005, '891.73 STO',
 'A fast, unsentimental account of a group of friends navigating the lawless energy of post-Soviet St. Petersburg. Stogov''s clipped, journalistic style captures a generation improvising its own rules in a city still reinventing itself.');

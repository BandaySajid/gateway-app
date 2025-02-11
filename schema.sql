CREATE TABLE IF NOT EXISTS users (
	id TEXT PRIMARY KEY NOT NULL,
	name TEXT,
	email TEXT,
	plan TEXT DEFAULT 'free' NOT NULL
);

CREATE TABLE IF NOT EXISTS rules (
	id TEXT PRIMARY KEY NOT NULL,
  name TEXT,
  host TEXT NOT NULL,
	protocol TEXT NOT NULL,
	port TEXT,
	period INTEGER NOT NULL,
	duration INTEGER NOT NULL,
	frequency INTEGER NOT NULL,
	filter TEXT NOT NULL,
	expressions TEXT,
  user_id TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
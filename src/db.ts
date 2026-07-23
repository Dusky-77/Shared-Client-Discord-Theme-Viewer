import sqlite3 from "sqlite3";

let db: sqlite3.Database | null = null;

export function initDb(): Promise<sqlite3.Database> {
	return new Promise((resolve, reject) => {
		if (db) return resolve(db);
		const instance = new sqlite3.Database("./themes.db", (err) => {
			if (err) return reject(err);
			db = instance;
			db.run(
				`
        CREATE TABLE IF NOT EXISTS user_themes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT NOT NULL,
          name TEXT NOT NULL,
          colors TEXT NOT NULL,
          angle INTEGER NOT NULL,
          intensity INTEGER NOT NULL,
          mode TEXT NOT NULL,
          is_public INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `,
				(runErr) => (runErr ? reject(runErr) : resolve(db!)),
			);
		});
	});
}

export async function deleteUserTheme(userId: string, name: string): Promise<boolean> {
	const database = await initDb();
	return new Promise<boolean>((resolve, reject) => {
		database.run("DELETE FROM user_themes WHERE user_id = ? AND name = ?", [userId, name], function (err) {
			if (err) return reject(err);
			resolve(this.changes > 0);
		});
	});
}

export async function saveUserTheme(
	userId: string,
	name: string,
	colors: string[],
	angle: number,
	intensity: number,
	mode: string,
	isPublic: boolean,
): Promise<boolean> {
	const database = await initDb();
	const count = await new Promise<number>((resolve, reject) => {
		database.get("SELECT COUNT(*) as count FROM user_themes WHERE user_id = ?", [userId], (err, row: any) => {
			if (err) return reject(err);
			resolve(row ? row.count : 0);
		});
	});
	if (count >= 5) return false;
	return new Promise<boolean>((resolve, reject) => {
		database.run(
			"INSERT INTO user_themes (user_id, name, colors, angle, intensity, mode, is_public) VALUES (?, ?, ?, ?, ?, ?, ?)",
			[userId, name, JSON.stringify(colors), angle, intensity, mode, isPublic ? 1 : 0],
			(err) => (err ? reject(err) : resolve(true)),
		);
	});
}

export async function getUserThemes(userId: string): Promise<any[]> {
	const database = await initDb();
	return new Promise((resolve, reject) => {
		database.all(
			"SELECT * FROM user_themes WHERE user_id = ? ORDER BY created_at DESC LIMIT 5",
			[userId],
			(err, rows) => {
				if (err) return reject(err);
				resolve(rows || []);
			},
		);
	});
}

export async function getPublicPresets(page: number = 1): Promise<any[]> {
	const database = await initDb();
	const limit = 7;
	const offset = (page - 1) * limit;
	return new Promise((resolve, reject) => {
		database.all(
			"SELECT * FROM user_themes WHERE is_public = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?",
			[limit, offset],
			(err, rows) => {
				if (err) return reject(err);
				resolve(rows || []);
			},
		);
	});
}

export async function getPublicPresetsCount(): Promise<number> {
	const database = await initDb();
	return new Promise((resolve, reject) => {
		database.get(
			"SELECT COUNT(*) as count FROM user_themes WHERE is_public = 1",
			[],
			(err, row: any) => {
				if (err) return reject(err);
				resolve(row ? row.count : 0);
			},
		);
	});
}
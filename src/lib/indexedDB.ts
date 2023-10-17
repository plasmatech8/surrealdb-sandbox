import Dexie, { type Table } from 'dexie';

class SaveDatabase extends Dexie {
	public save!: Table<{ id?: number; value: string }>;
	public constructor() {
		super('DatabaseSave');
		this.version(1).stores({
			save: '++id, value'
		});
	}
}

const db = new SaveDatabase();

export async function saveData(data: string[]) {
	// Log size in bytes
	const numBytes = new Blob([JSON.stringify(data)]).size;
	console.info(`Saving ${numBytes / 1_000_000} MB to indexedDB`);

	// Save to indexedDB
	await db.save.clear();
	console.log(data);
	const x = await db.save.bulkAdd(data.map((value) => ({ value })));
	console.log(x);
}

export async function loadData() {
	return (await db.save.toArray()).map(({ value }) => value);
}

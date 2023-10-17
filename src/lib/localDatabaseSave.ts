import Dexie, { type Table } from 'dexie';
import prettyBytes from 'pretty-bytes';

class LocalSaveDatabase extends Dexie {
	public save!: Table<{ id?: number; value: string }>;
	public constructor() {
		super('DatabaseSave');
		this.version(1).stores({
			save: '++id, value'
		});
	}
}

const db = new LocalSaveDatabase();

export async function setLocalSave(data: string[], start: string) {
	// Log size in bytes
	const numBytes = new Blob([JSON.stringify(data)]).size;
	console.info(`Saving ${prettyBytes(numBytes)} to indexedDB`);

	// Set local storage info
	localStorage.setItem('saveSizeBytes', numBytes.toString());
	localStorage.setItem('saveStartCode', start);

	// Save to indexedDB
	await db.save.clear();
	await db.save.bulkAdd(data.map((value) => ({ value })));
}

export async function getLocalSave() {
	const data = (await db.save.toArray()).map(({ value }) => value);
	const start = localStorage.getItem('saveStartCode');
	return { data, start };
}

export async function deleteLocalSave() {
	await db.save.clear();
	localStorage.removeItem('saveSizeBytes');
	localStorage.removeItem('saveStartCode');
}

export function getLocalSaveSize(): number | null {
	return parseInt(localStorage.getItem('saveSizeBytes') ?? '');
}

import Dexie, { type Table } from 'dexie';
import prettyBytes from 'pretty-bytes';

class LocalSaveDatabase extends Dexie {
	public history!: Table<{ id?: number; value: string }>;
	public editors!: Table<{ id?: number; value: string }>;
	public constructor() {
		super('DatabaseSave');
		this.version(1).stores({
			history: '++id, value',
			editors: '++id, value'
		});
	}
}

const db = new LocalSaveDatabase();

export async function setLocalSave(history: string[], editors: string[]) {
	// Log size in bytes
	const historyBytesSize = new Blob([JSON.stringify(history)]).size;
	const editorsByteSize = new Blob([JSON.stringify(editors)]).size;
	const totalBytesSize = historyBytesSize + editorsByteSize;
	console.info(`Saving ${prettyBytes(totalBytesSize)} to indexedDB`);

	// Store size of save in local storage
	localStorage.setItem('localSaveBytesSize', prettyBytes(totalBytesSize));

	// Save history & editors to indexedDB
	console.log('???');
	await db.history.clear();
	await db.editors.clear();
	await db.history.bulkAdd(history.map((value) => ({ value })));
	await db.editors.bulkAdd(editors.map((value) => ({ value })));
}

export async function getLocalSave() {
	const history = (await db.history.toArray()).map(({ value }) => value);
	const editors = (await db.editors.toArray()).map(({ value }) => value);
	return { history, editors };
}

export async function deleteLocalSave() {
	await db.history.clear();
	await db.editors.clear();
	localStorage.removeItem('localSaveBytesSize');
}

export function getLocalSaveSize() {
	return localStorage.getItem('localSaveBytesSize');
}

<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	onMount(async () => {
		if (browser) {
			const { Surreal } = await import('surrealdb.wasm');

			const db = new Surreal();
			try {
				// Connect to the database
				await db.connect('mem://', {
					// Set the namespace and database for the connection
					ns: 'test',
					db: 'test',
					// Set the authentication details for the connection
					auth: {
						NS: 'test',
						DB: 'test',
						SC: 'user',
						user: 'root',
						pass: 'root'
					}
				});
				const version = await db.version();
				console.log('Instantiated SurrealDB with version: ' + version);

				// Select a specific namespace / database
				await db.use({ ns: 'test', db: 'test' });

				// Create a new person with a random id
				let created = await db.create('person', {
					title: 'Founder & CEO',
					name: {
						first: 'Tobie',
						last: 'Morgan Hitchcock'
					},
					marketing: true,
					identifier: Math.random().toString(36).substr(2, 10)
				});
				console.log(created);

				// Update a person record with a specific id
				let updated = await db.merge('person:jaime', {
					marketing: true
				});
				console.log(updated);

				// Select all people records
				let people = await db.select('person');

				// Perform a custom advanced query
				let groups = await db.query(
					'SELECT marketing, count() FROM type::table($table) GROUP BY marketing',
					{
						table: 'person'
					}
				);
				console.log(groups);

				// Delete all people upto but not including Jaime
				let deleted = await db.delete('person:..jaime');
				console.log(deleted);

				// Delete all people
				await db.delete('person');
			} catch (e) {
				console.error('ERROR', e);
			}
		}
	});
</script>

<div class="container h-full mx-auto flex justify-center items-center">Hello World!</div>

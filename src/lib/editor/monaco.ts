import * as monaco from 'monaco-editor';
// import { Registry } from 'monaco-textmate';

// Import the workers in a production-safe way.
// This is different than in Monaco's documentation for Vite,
// but avoids a weird error ("Unexpected usage") at runtime
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';

// import surrealqlTm from '$lib/assets/surrealql.tmLanguage.json';
// import javascriptTm from '$lib/assets/javascript.tmLanguage.json';
// import jsonTm from '$lib/assets/JSON.tmLanguage.json';

// const SCOPE_GRAMMARS = {
// 	'source.surql': {
// 		format: 'json',
// 		content: surrealqlTm
// 	},
// 	'source.js': {
// 		format: 'json',
// 		content: javascriptTm
// 	},
// 	'source.json': {
// 		format: 'json',
// 		content: jsonTm
// 	}
// } as const;

// function getGrammar(scopeName: keyof typeof SCOPE_GRAMMARS) {
// 	return SCOPE_GRAMMARS[scopeName] || SCOPE_GRAMMARS['source.surql'];
// }

self.MonacoEnvironment = {
	getWorker: function (_: string, label: string) {
		switch (label) {
			case 'json':
				return new jsonWorker();
			default:
				return new editorWorker();
		}
	}
};

monaco.languages.register({
	id: 'surrealql',
	extensions: ['.surql', '.surrealql']
});

monaco.languages.setLanguageConfiguration('surrealql', {
	comments: {
		lineComment: '--',
		blockComment: ['/*', '*/']
	},
	brackets: [
		['{', '}'],
		['[', ']'],
		['(', ')'],
		['⟨', '⟩'],
		['`', '`']
	],
	autoClosingPairs: [
		{ open: '{', close: '}', notIn: ['string', 'comment'] },
		{ open: '[', close: ']', notIn: ['string', 'comment'] },
		{ open: '(', close: ')', notIn: ['string', 'comment'] },
		{ open: '"', close: '"', notIn: ['string'] },
		{ open: "'", close: "'", notIn: ['string'] },
		{ open: '`', close: '`', notIn: ['string'] },
		{ open: '⟨', close: '⟩', notIn: ['string', 'comment'] }
	],
	surroundingPairs: [
		{ open: '{', close: '}' },
		{ open: '[', close: ']' },
		{ open: '(', close: ')' },
		{ open: '"', close: '"' },
		{ open: "'", close: "'" },
		{ open: '`', close: '`' },
		{ open: '⟨', close: '⟩' }
	]
});

// // table intellisense
// monaco.languages.registerCompletionItemProvider("surrealql", {
//     triggerCharacters: [" "],
//     provideCompletionItems: async (model, position, context) => {
//         const { tableSuggest } = store.getState().config;
//         const surreal = getSurreal();

//         if (!tableSuggest || !surreal) {
//             return;
//         }

//         const linePrefix = model.getLineContent(position.lineNumber).slice(0, Math.max(0, position.column));
//         const isAuto = context.triggerKind === languages.CompletionTriggerKind.TriggerCharacter;

//         if (isAuto && !TABLE_PREFIXES.some((pre) => linePrefix.toUpperCase().endsWith(pre))) {
//             return;
//         }

//         try {
//             const response = await surreal.querySingle("INFO FOR DB");
//             const result = response[0].result as SurrealInfoDB;

//             if (!result) {
//                 return {
//                     suggestions: [],
//                 };
//             }

//             const tables = Object.keys(result.tables);
//             const suggestions = tables.map((table) => ({
//                 label: table,
//                 insertText: table,
//                 kind: languages.CompletionItemKind.Class,
//                 range: monaco.Range.fromPositions(position, position),
//             }));

//             return {
//                 suggestions,
//             };
//         } catch {
//             return {
//                 suggestions: [],
//             };
//         }
//     },
// });

// // variable intellisense
// monaco.languages.registerCompletionItemProvider("surrealql", {
//     triggerCharacters: ["$"],
//     provideCompletionItems(_, position, context) {
//         const session = getActiveSession();

//         if (!session) {
//             return;
//         }

//         const variables = JSON.parse(session.variables);
//         const variableNames = Object.keys(variables);

//         if (variableNames.length === 0) {
//             return;
//         }

//         const isAuto = context.triggerKind === languages.CompletionTriggerKind.TriggerCharacter;
//         const suggestions: languages.CompletionItem[] = variableNames.map((variableName) => ({
//             label: `$${variableName}`,
//             insertText: (isAuto ? "" : "$") + variableName,
//             detail: `${variables[variableName]}`,
//             kind: languages.CompletionItemKind.Variable,
//             range: monaco.Range.fromPositions(position, position),
//         }));

//         return {
//             suggestions,
//         };
//     },
// });

export default monaco;

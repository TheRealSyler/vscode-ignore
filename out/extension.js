"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const autocomplete_provider_1 = require("./autocomplete/autocomplete.provider");
function activate(context) {
    console.log('a', context);
    const gitIgnoreCompletion = new autocomplete_provider_1.GitIgnoreCompletions(context);
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider([
        { language: 'gitignore', scheme: 'file' },
        { language: 'gitignore', scheme: 'untitled' }
    ], gitIgnoreCompletion, '.', '/'));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map
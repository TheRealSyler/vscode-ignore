"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const path_1 = require("path");
const fs_1 = require("fs");
class GitIgnoreCompletions {
    constructor(context) {
        this.context = context;
    }
    provideCompletionItems(document, position, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const start = new vscode_1.Position(position.line, 0);
            const range = new vscode_1.Range(start, position);
            const currentWord = document.getText(range).trim();
            const tempDir = path_1.resolve(document.uri.path, '../', currentWord);
            const dir = fs_1.statSync(tempDir).isDirectory() ? tempDir : path_1.resolve(document.uri.path, '../');
            const files = yield fs_1.promises.readdir(dir);
            const completions = [];
            for (let i = 0; i < files.length; i++) {
                const fileName = files[i];
                const stats = fs_1.statSync(path_1.resolve(document.uri.path, '../', fileName));
                const isDir = stats.isDirectory();
                const Item = new vscode_1.CompletionItem(fileName, isDir ? vscode_1.CompletionItemKind.Folder : vscode_1.CompletionItemKind.File);
                Item.insertText = isDir ? `${fileName}/` : fileName;
                Item.command = isDir
                    ? {
                        title: 'Trigger Completion',
                        command: 'editor.action.triggerSuggest'
                    }
                    : undefined;
                completions.push(Item);
            }
            return completions;
        });
    }
}
exports.GitIgnoreCompletions = GitIgnoreCompletions;
//# sourceMappingURL=autocomplete.provider.js.map
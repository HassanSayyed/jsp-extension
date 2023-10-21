var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const vscode = require("vscode");
function extractJavaCode(text) {
    const javaCodeRegex = /<%java(.*?)%>/gs;
    const javaCodeMatches = text.match(javaCodeRegex) || [];
    return javaCodeMatches.map((match) => match.slice(6, -2).trim());
}
function provideCompletionItems(document, position, token, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const lineText = document.lineAt(position.line).text;
        const javaCodeBlocks = extractJavaCode(lineText);
        if (javaCodeBlocks.length > 0) {
            // Request Java code completion suggestions for each Java block
            const suggestionsPromises = javaCodeBlocks.map((codeBlock) => __awaiter(this, void 0, void 0, function* () {
                // Request code completion suggestions for the Java block with language mode set to "java"
                const suggestions = yield vscode.commands.executeCommand("vscode.executeCompletionItemProvider", document.uri, position, "java" // Specify the language mode as "java"
                );
                return suggestions && suggestions.items ? suggestions.items : [];
            }));
            // Combine suggestions from all Java code blocks
            const allSuggestions = yield Promise.all(suggestionsPromises);
            return [].concat(...allSuggestions);
        }
        return []; // No suggestions
    });
}
function activate(context) {
    console.log("Your extension is now active!");
    // Register a provider for custom language features
    let disposable = vscode.languages.registerCompletionItemProvider("jsp", {
        provideCompletionItems(document, position, token, context) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield provideCompletionItems(document, position, token, context);
            });
        },
    });
    context.subscriptions.push(disposable);
}
function deactivate() {
    console.log("Your extension is now deactivated.");
}
module.exports = {
    activate,
    deactivate,
};

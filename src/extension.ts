const vscode = require("vscode");

function extractJavaCode(text) {
  const javaCodeRegex = /<%java(.*?)%>/gs;
  const javaCodeMatches = text.match(javaCodeRegex) || [];
  return javaCodeMatches.map((match) => match.slice(6, -2).trim());
}

async function provideCompletionItems(document, position, token, context) {
  const lineText = document.lineAt(position.line).text;
  const javaCodeBlocks = extractJavaCode(lineText);

  if (javaCodeBlocks.length > 0) {
    // Request Java code completion suggestions for each Java block
    const suggestionsPromises = javaCodeBlocks.map(async (codeBlock) => {
      // Request code completion suggestions for the Java block with language mode set to "java"
      const suggestions = await vscode.commands.executeCommand(
        "vscode.executeCompletionItemProvider",
        document.uri,
        position,
        "java" // Specify the language mode as "java"
      );
      return suggestions && suggestions.items ? suggestions.items : [];
    });

    // Combine suggestions from all Java code blocks
    const allSuggestions = await Promise.all(suggestionsPromises);
    return [].concat(...allSuggestions);
  }

  return []; // No suggestions
}

function activate(context) {
  console.log("Your extension is now active!");

  // Register a provider for custom language features
  let disposable = vscode.languages.registerCompletionItemProvider("jsp", {
    async provideCompletionItems(document, position, token, context) {
      return await provideCompletionItems(document, position, token, context);
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

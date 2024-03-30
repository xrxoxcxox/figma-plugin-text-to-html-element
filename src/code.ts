function determineTag(layerName: string): string {
  const tagMatch = layerName.match(/^(h[1-6])/);
  return tagMatch ? tagMatch[0] : "p";
}

function findTextNodes(node: SceneNode): string[] {
  let texts: string[] = [];
  if (node.type === "TEXT") {
    const tagName = determineTag(node.name);
    texts.push(`<${tagName}>${node.characters}</${tagName}>`);
  } else if ("children" in node) {
    node.children.forEach((child: SceneNode) => {
      texts = texts.concat(findTextNodes(child));
    });
  }
  return texts;
}

function updateText() {
  if (figma.currentPage.selection.length > 0) {
    let allTexts: string[] = [];

    figma.currentPage.selection.forEach((node) => {
      allTexts = allTexts.concat(findTextNodes(node));
    });

    const htmlTextToDisplay = allTexts.join("\n");
    figma.ui.postMessage({ type: "htmlTextToDisplay", text: htmlTextToDisplay });
  } else {
    figma.ui.postMessage({ type: "noText", text: "Select a frame" });
  }
}

figma.showUI(__html__, { width: 400, height: 480 });

updateText();

figma.on("selectionchange", updateText);

figma.ui.onmessage = msg => {
  if (msg.type === "copy") {
    figma.notify(`Text copied to clipboard`);
  }
}

import { on, showUI } from "@create-figma-plugin/utilities";
import type { CopyTextHandler } from "./types";

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
    texts = node.children.reduce(
      (acc, child) => [...acc, ...findTextNodes(child)],
      texts,
    );
  }
  return texts;
}

function extractAndSendMessage() {
  if (figma.currentPage.selection.length === 0) {
    figma.ui.postMessage({ text: "", isTextSelected: false });
    return;
  }

  const allTexts = figma.currentPage.selection.flatMap(findTextNodes);
  const htmlTextToDisplay = allTexts.join("\n");
  figma.ui.postMessage({
    text: htmlTextToDisplay,
    isTextSelected: true,
  });
}

export default function () {
  figma.on("selectionchange", extractAndSendMessage);
  function handleClick(data: string) {
    figma.notify(data);
  }
  on<CopyTextHandler>('COPY_TEXT', handleClick)
  showUI({ height: 416, width: 400 });
}

import {
  Bold,
  Button,
  Container,
  render,
  Text,
  VerticalSpace,
} from "@create-figma-plugin/ui";
import { emit } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import styles from "./styles.css";
import type { CopyTextHandler } from "./types";

function Plugin() {
  const [selectedText, setSelectedText] = useState<string>("");
  const [isTextSelected, setIsTextSelected] = useState<boolean>(false);

  function handleClick() {
    const area = document.createElement("textarea");
    document.body.appendChild(area);
    area.value = selectedText;
    area.focus();
    area.select();
    document.execCommand("copy");
    document.body.removeChild(area);
    // parent.postMessage({ pluginMessage: { type: "textCopy" } }, "*");
    emit<CopyTextHandler>('COPY_TEXT', 'Text copied to clipboard');
  }

  useEffect(() => {
    const handleMessage = (event: {
      data: { pluginMessage: { text: string; isTextSelected: boolean } };
    }) => {
      const { text, isTextSelected } = event.data.pluginMessage;
      setSelectedText(text);
      setIsTextSelected(isTextSelected);
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);
  return (
    <Container space="medium">
      <VerticalSpace space="medium" />
      <Text>
        <Bold>Selected text</Bold>
      </Text>
      <VerticalSpace space="small" />
      <div
        className={`${styles.displayArea} ${isTextSelected ? styles.isTextSelected : styles.isNotTextSelected}`}
      >
        <Text>{selectedText || "Select a frame"}</Text>
      </div>
      <VerticalSpace space="medium" />
      {selectedText ? (
        <Button fullWidth onClick={handleClick}>
          Copy text
        </Button>
      ) : null}
      <VerticalSpace space="small" />
    </Container>
  );
}

export default render(Plugin);

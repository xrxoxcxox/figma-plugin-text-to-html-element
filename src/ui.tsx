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
import type { CopyCodeHandler, UiReadyHandler } from "./types";

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
    emit<CopyCodeHandler>("COPY_CODE", "Text copied to clipboard");
  }

  useEffect(() => {
    emit<UiReadyHandler>("UI_READY");

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
          Copy code
        </Button>
      ) : null}
      <VerticalSpace space="small" />
    </Container>
  );
}

export default render(Plugin);

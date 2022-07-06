import React from "react";
import ReactDOM from "react-dom";

import styled from "styled-components";
import CopyToClipboard from "@uxui/copy-to-clipboard-react";

const Pane = styled("div")({
  padding: "8px 10px",
  backgroundColor: "#fafafa",
  borderRadius: "3px",
  border: "1px solid #dddddd",
  display: "flex",
  justifyContent: "space-between",
  position: "relative",
  fontFamily: "sans-serif",
  fontSize: "16px",
});

const Container = styled("div")({
  width: "320px",
  margin: "100px auto",
});

const Tooltip = styled("div")({
  backgroundColor: "#111111",
  color: "#ffffff",
  position: "absolute",
  top: "-25px",
  right: "-10px",
  fontWeight: 600,
  fontSize: "12px",
  padding: "4px 5px",
  "&:after": {
    content: "''",
    position: "absolute",
    width: "0",
    height: "0",
    border: "5px solid transparent",
    borderTopColor: "#111111",
    bottom: "-10px",
    left: "50%",
    transform: "translateX(-50%)",
  },
});

export default function CopyToClip() {
  const content = "0xc6255aDf5aBB75DF880f2ae33b524c514b350c47";
  return (
    <CopyToClipboard>
      {({ copy, copied, turnOffCopied }) => {
        const handleCopy = (e) => {
          if (content && !copied) {
            copy(content);
            setTimeout(() => {
              turnOffCopied();
            }, 1000);
          }
        };

        const copyOnClick = (e) => {
          e.preventDefault();
          handleCopy();
        };

        const copyOnKeyPress = (e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleCopy();
          }
        };

        return (
          <Container>
            <Pane>
              <span>{content}</span>
              <div
                role="button"
                onClick={copyOnClick}
                tabIndex={0}
                onKeyDown={copyOnKeyPress}
              >
                <i className="fas fa-copy"></i>
                {copied && (
                  <Tooltip
                    role="tooltip"
                    aria-describedby="copied ETH address!"
                  >
                    Copied
                  </Tooltip>
                )}
              </div>
            </Pane>
          </Container>
        );
      }}
    </CopyToClipboard>
  );
}

import "@fontsource/martel/400.css";
import "@fontsource/martel/700.css";

import wrapWithProvider from "./wrap-with-provider";

import "./src/styles/customFonts.scss";
if (process.env.NODE_ENV === "development") {
  console.log(
    "%c EdgeTag Mock Mode: Bật chế độ giả lập EdgeTag. ",
    "background: #7b5ed4; color: #fff; padding: 4px;",
  );

  window.edgetag = function (...args) {
    console.groupCollapsed(`🚀 EdgeTag Event: ${args[1]}`);
    console.log("Payload:", args[2] || "No payload");
    console.groupEnd();
  };
}

export const wrapRootElement = wrapWithProvider;

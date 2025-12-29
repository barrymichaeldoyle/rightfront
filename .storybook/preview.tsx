import type { Preview } from "@storybook/nextjs-vite";
import React from "react";
import theme from "./RightFrontTheme";
import "../src/styles/globals.css";

const preview: Preview = {
  parameters: {
    docs: {
      theme,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "dark",
      values: [
        {
          name: "dark",
          value: "#020617", // slate-950
        },
      ],
    },
    a11y: {
      test: "todo",
    },
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-slate-950 text-slate-100 antialiased">
        <Story />
      </div>
    ),
  ],
};

export default preview;

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Card } from "./Card";
import type { CardPadding } from "./Card";

const meta = {
  title: "Components/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    padding: {
      control: "select",
      options: ["sm", "md", "lg", "none"],
      description: "The padding size of the card",
    },
    children: {
      control: "text",
      description: "Card content",
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    children: (
      <div>
        <h3 className="text-lg font-semibold text-slate-100">Card Title</h3>
        <p className="mt-2 text-sm text-slate-300">
          This is a card with medium padding.
        </p>
      </div>
    ),
    padding: "md",
  },
  parameters: {
    layout: "padded",
  },
};

// Padding sizes
export const SmallPadding: Story = {
  args: {
    children: (
      <div>
        <h3 className="text-base font-semibold text-slate-100">
          Small Padding
        </h3>
        <p className="mt-1 text-sm text-slate-300">
          Card with small padding (p-4).
        </p>
      </div>
    ),
    padding: "sm",
  },
  parameters: {
    layout: "padded",
  },
};

export const MediumPadding: Story = {
  args: {
    children: (
      <div>
        <h3 className="text-lg font-semibold text-slate-100">Medium Padding</h3>
        <p className="mt-2 text-sm text-slate-300">
          Card with medium padding (p-6).
        </p>
      </div>
    ),
    padding: "md",
  },
  parameters: {
    layout: "padded",
  },
};

export const LargePadding: Story = {
  args: {
    children: (
      <div>
        <h3 className="text-xl font-semibold text-slate-100">Large Padding</h3>
        <p className="mt-3 text-base text-slate-300">
          Card with large padding (p-8).
        </p>
      </div>
    ),
    padding: "lg",
  },
  parameters: {
    layout: "padded",
  },
};

export const NoPadding: Story = {
  args: {
    children: (
      <div>
        <h3 className="text-lg font-semibold text-slate-100">No Padding</h3>
        <p className="mt-2 text-sm text-slate-300">
          Card with no padding. Add padding to children as needed.
        </p>
      </div>
    ),
    padding: "none",
  },
  parameters: {
    layout: "padded",
  },
};

// All padding sizes showcase
export const AllPaddingSizes: Story = {
  render: () => {
    const paddings: CardPadding[] = ["none", "sm", "md", "lg"];
    return (
      <div className="flex flex-col gap-4">
        {paddings.map((padding) => (
          <Card key={padding} padding={padding}>
            <div>
              <h3 className="font-semibold text-slate-100 capitalize">
                {padding} Padding
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                Card with {padding} padding size.
              </p>
            </div>
          </Card>
        ))}
      </div>
    );
  },
  parameters: {
    layout: "padded",
  },
};

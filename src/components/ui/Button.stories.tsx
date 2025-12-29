import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button, ButtonLink, ButtonAnchor } from "./Button";
import type { ButtonVariant, ButtonSize } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline", "ghost", "danger", "link"],
      description: "The visual style variant of the button",
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "icon2xs", "iconXs", "iconSm", "icon"],
      description: "The size of the button",
    },
    fullWidth: {
      control: "boolean",
      description: "Whether the button should take full width",
    },
    disabled: {
      control: "boolean",
      description: "Whether the button is disabled",
    },
    loading: {
      control: "boolean",
      description: "Whether the button is in a loading state",
    },
    withSpinner: {
      control: "boolean",
      description: "Whether to show a spinner (without animation)",
    },
    children: {
      control: "text",
      description: "Button content",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    children: "Button",
    variant: "secondary",
    size: "md",
  },
};

// Variants
export const Primary: Story = {
  args: {
    children: "Primary Button",
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary Button",
    variant: "secondary",
  },
};

export const Outline: Story = {
  args: {
    children: "Outline Button",
    variant: "outline",
  },
};

export const Ghost: Story = {
  args: {
    children: "Ghost Button",
    variant: "ghost",
  },
};

export const Danger: Story = {
  args: {
    children: "Danger Button",
    variant: "danger",
  },
};

export const Link: Story = {
  args: {
    children: "Link Button",
    variant: "link",
  },
};

// Sizes
export const ExtraSmall: Story = {
  args: {
    children: "Extra Small",
    size: "xs",
  },
};

export const Small: Story = {
  args: {
    children: "Small",
    size: "sm",
  },
};

export const Medium: Story = {
  args: {
    children: "Medium",
    size: "md",
  },
};

export const Large: Story = {
  args: {
    children: "Large",
    size: "lg",
  },
};

// Icon sizes
export const IconExtraSmall: Story = {
  args: {
    children: "⚙",
    size: "icon2xs",
  },
};

export const IconSmall: Story = {
  args: {
    children: "⚙",
    size: "iconXs",
  },
};

export const IconMedium: Story = {
  args: {
    children: "⚙",
    size: "iconSm",
  },
};

export const Icon: Story = {
  args: {
    children: "⚙",
    size: "icon",
  },
};

// States
export const Disabled: Story = {
  args: {
    children: "Disabled Button",
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    children: "Loading Button",
    loading: true,
  },
};

export const WithSpinner: Story = {
  args: {
    children: "Button with Spinner",
    withSpinner: true,
  },
};

export const FullWidth: Story = {
  args: {
    children: "Full Width Button",
    fullWidth: true,
  },
  parameters: {
    layout: "padded",
  },
};

// All variants showcase
export const AllVariants: Story = {
  render: () => {
    const variants: ButtonVariant[] = [
      "primary",
      "secondary",
      "outline",
      "ghost",
      "danger",
      "link",
    ];
    return (
      <div className="flex flex-col gap-4">
        {variants.map((variant) => (
          <Button key={variant} variant={variant}>
            {variant.charAt(0).toUpperCase() + variant.slice(1)}
          </Button>
        ))}
      </div>
    );
  },
  parameters: {
    layout: "padded",
  },
};

// All sizes showcase
export const AllSizes: Story = {
  render: () => {
    const sizes: ButtonSize[] = ["xs", "sm", "md", "lg"];
    return (
      <div className="flex items-center gap-4">
        {sizes.map((size) => (
          <Button key={size} size={size}>
            {size.toUpperCase()}
          </Button>
        ))}
      </div>
    );
  },
  parameters: {
    layout: "padded",
  },
};

// ButtonLink component
export const ButtonLinkStory: Story = {
  render: () => (
    <ButtonLink href="#" variant="primary">
      Link Button
    </ButtonLink>
  ),
  parameters: {
    layout: "padded",
  },
};

// ButtonAnchor component
export const ButtonAnchorStory: Story = {
  render: () => (
    <ButtonAnchor href="#" variant="outline">
      Anchor Button
    </ButtonAnchor>
  ),
  parameters: {
    layout: "padded",
  },
};

import { Meta, StoryObj } from '@storybook/react'

import { Button, IButton } from './Button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  argTypes: {
    intent: ['primary', 'secondary', 'danger'],
    fullWidth: [true, false],
  },
}
export default meta;

type Story = StoryObj<typeof Button>

export function ButtonDefault(args: IButton) {
  return <Button {...args}>{args.children}</Button>
}

ButtonDefault.args = {
  children: 'Login',
  intent: 'primary',
  fullWidth: false,
}

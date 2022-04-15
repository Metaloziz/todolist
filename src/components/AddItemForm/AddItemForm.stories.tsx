import React, { FC } from "react";

import { action } from "@storybook/addon-actions";

import { AddItemForm } from "./AddItemForm";

export default {
  title: 'AddItemForm Stories',
  component: AddItemForm,
}

export const AddItemFormBaseExample: FC = () => (
  <AddItemForm addItem={action('Button inside form clicked')} />
)

export const AddItemFormDisabledExample: FC = () => (
  <AddItemForm disabled addItem={action('Button inside form clicked')} />
)

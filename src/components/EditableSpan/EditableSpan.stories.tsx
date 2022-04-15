import React, { FC } from "react";

import { action } from "@storybook/addon-actions";

import { EditableSpan } from "./EditableSpan";

export default {
  title: 'EditableSpan Stories',
  component: EditableSpan,
}

export const EditableSpanFormBaseExample: FC = () => (
  <EditableSpan value="StartValue" onChange={action('value changed')} />
)

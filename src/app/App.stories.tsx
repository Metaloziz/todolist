import { App } from './App'

import {
  ReduxStoreProviderDecorator,
} from 'stories/decorators/ReduxStoreProviderDecorator'

export default {
  title: 'App Stories',
  component: App,
  decorators: [ReduxStoreProviderDecorator],
}

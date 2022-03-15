import React from 'react'
import App from './App'
import {
  HashRouterDecorator,
  ReduxStoreProviderDecorator
} from 'stories/decorators/ReduxStoreProviderDecorator'

export default {
  title: 'App Stories',
  component: App,
  decorators: [ReduxStoreProviderDecorator, HashRouterDecorator]
}

export const AppBaseExample = (props: any) => {
  return (<App demo={true}/>)
}

# vwrap

Wrapping Vue components with custom elements.

## Installation

```
yarn add @sonicgarden/vwrap
```

## Usage

```jsx
import { vwrap } from '@sonicgarden/vwrap'
import MyComponent from './MyComponent.vue'
import MyComponentWithSlot from './MyComponentWithSlot.vue'

vwrap('my-component', MyComponent)
vwrap('my-async-component', async () => (await import('./MyAsyncComponent.vue')).default)
vwrap('my-component-with-slot', MyComponentWithSlot, { hasSlot: true })
```

You can then use this element in an HTML file:

```html
<my-component data-props="{\"content\":\"Hello, world!\"}"></my-component>
<my-async-component data-props="{\"content\":\"Hello, world!\"}"></my-async-component>

<my-component-with-slot>
  <template slot="trigger"><button>Click!</button></template>
  <template>
    <div class="alert">Hello, world!</div>
  </template>
</my-component-with-slot>
```

## Limitation

- Attribute changes
- Slots changes
- Events trigger
- ShadowDOM

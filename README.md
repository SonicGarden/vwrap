# vwrap

Wrapping Vue components with custom elements.

## Vue compatibility

| Vue Version | vwrap Version |
| ------------- |:-------------:|
| v3.x | 1.x |
| v2.x | 0.x |

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

Refer to the [type definitions](https://github.com/SonicGarden/vwrap/blob/6268e2a953ad28337e3af2faad1d5eaf57ce91b8/src/index.ts#L59-L62) for more options.

## Limitation

- Attribute changes
- Slots changes
- Events trigger
- ShadowDOM

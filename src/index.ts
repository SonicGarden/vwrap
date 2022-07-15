/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentOptions, DefineComponent, createApp, h, App, VNode } from 'vue'

const notEmpty = <T>(value: T | null | undefined): value is NonNullable<T> => {
  return value !== null && value !== undefined
}

const getProps = (element: HTMLElement): any => {
  const json = element.dataset.props
  if (!json) return {} as any

  return JSON.parse(json)
}

type Attributes = Record<string, string | null>

const getAttributes = (node: Element): Attributes => {
  const res: Attributes = {}
  for (let i = 0, l = node.attributes.length; i < l; i++) {
    const attr = node.attributes[i]
    res[attr.nodeName] = attr.nodeValue
  }
  return res
}

// SEE: https://v3.vuejs.org/guide/render-function.html
const toVNode = (node: Element): [string, VNode | string] | undefined => {
  if (node.nodeType === Node.TEXT_NODE) {
    return (node as unknown as CharacterData).data.trim()
      ? ['default', (node as unknown as CharacterData).data]
      : undefined
  } else if (node.nodeType === 1) {
    const { slot, ...attrs } = getAttributes(node)
    const tag = node.tagName === 'TEMPLATE' ? 'div' : node.tagName
    return [slot ?? 'default', h(tag, { ...attrs, innerHTML: node.innerHTML })]
  } else {
    return undefined
  }
}

const toVNodes = (fragment: DocumentFragment) => {
  // eslint-disable-next-line unicorn/prefer-spread
  const nodes = Array.from(fragment.childNodes)
    .map((child) => toVNode(child as HTMLElement))
    // eslint-disable-next-line unicorn/no-array-callback-reference
    .filter(notEmpty)
    .map(([slot, node]) => [slot, () => node])
  return Object.fromEntries(nodes)
}

const getChildren = (el: HTMLElement) => {
  const fragment = document.createDocumentFragment()
  while (el.childNodes.length > 0) {
    fragment.append(el.childNodes[0])
  }
  return fragment
}

type VwrapOptions = {
  hasSlot?: boolean
  beforeMountCallback?: (app: App) => void
}

type Component = ComponentOptions | DefineComponent<any, any, any, any, any, any, any, any, any, any, any, any>

export const vwrap = (
  name: string,
  component: Component | (() => Promise<Component>),
  options: VwrapOptions = {},
): void => {
  class VwrapElement extends HTMLElement {
    private __vue_custom_element__?: App

    connectedCallback() {
      if (!options.hasSlot) return this.render()

      window.setTimeout(() => {
        this.render()
      }, 0)
    }

    disconnectedCallback() {
      if (!this.__vue_custom_element__) return

      this.__vue_custom_element__.unmount()
      delete this.__vue_custom_element__
    }

    async render() {
      if (this.__vue_custom_element__) return

      const children = getChildren(this)
      const props = getProps(this)
      const resolvedComponent = typeof component === 'function' ? await component() : component

      const wrapper = createApp({
        name: 'VWrapper',
        render() {
          return h(resolvedComponent, props, toVNodes(children))
        },
      })

      if (options.beforeMountCallback) {
        options.beforeMountCallback(wrapper)
      }

      this.__vue_custom_element__ = wrapper
      // eslint-disable-next-line github/unescaped-html-literal
      this.innerHTML = '<div></div>'
      this.__vue_custom_element__.mount(this.children[0])
    }
  }

  window.customElements.define(name, VwrapElement)
}

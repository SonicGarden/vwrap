/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentOptions, DefineComponent, createApp, h, App } from 'vue'

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

type SlotData = {
  slot?: string
  attrs: Attributes
  domProps: {
    innerHTML: string
  }
}

const toVNode = (node: Element) => {
  if (node.nodeType === Node.TEXT_NODE) {
    // eslint-disable-next-line unicorn/no-null
    return (node as unknown as CharacterData).data.trim() ? (node as unknown as CharacterData).data : null
  } else if (node.nodeType === 1) {
    const data: SlotData = {
      attrs: getAttributes(node),
      domProps: {
        innerHTML: node.innerHTML,
      },
    }
    if (data.attrs.slot) {
      data.slot = data.attrs.slot
      delete data.attrs.slot
    }
    const tag = node.tagName === 'TEMPLATE' ? 'div' : node.tagName
    return h(tag, data)
  } else {
    // eslint-disable-next-line unicorn/no-null
    return null
  }
}

const toVNodes = (fragment: DocumentFragment) => {
  return [...fragment.childNodes].map((child) => toVNode(child as HTMLElement))
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
}

export const vwrap = (
  name: string,
  component: ComponentOptions | DefineComponent | (() => Promise<ComponentOptions | DefineComponent>),
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

    render() {
      if (this.__vue_custom_element__) return

      const children = getChildren(this)
      const props = getProps(this)

      const wrapper = createApp({
        name: 'VWrapper',
        render() {
          return h(component, props, toVNodes(children))
        },
      })

      this.__vue_custom_element__ = wrapper
      // eslint-disable-next-line github/unescaped-html-literal
      this.innerHTML = '<div></div>'
      this.__vue_custom_element__.mount(this.children[0])
    }
  }

  window.customElements.define(name, VwrapElement)
}

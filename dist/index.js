import Vue from 'vue';
const getProps = (element) => {
    const json = element.dataset.props;
    if (!json)
        return {};
    return JSON.parse(json);
};
const getAttributes = (node) => {
    const res = {};
    for (let i = 0, l = node.attributes.length; i < l; i++) {
        const attr = node.attributes[i];
        res[attr.nodeName] = attr.nodeValue;
    }
    return res;
};
const toVNode = (h, node) => {
    if (node.nodeType === Node.TEXT_NODE) {
        return node.data.trim()
            ? node.data
            : null;
    }
    else if (node.nodeType === 1) {
        const data = {
            attrs: getAttributes(node),
            domProps: {
                innerHTML: node.innerHTML,
            },
        };
        if (data.attrs.slot) {
            data.slot = data.attrs.slot;
            delete data.attrs.slot;
        }
        const tag = node.tagName === 'TEMPLATE' ? 'div' : node.tagName;
        return h(tag, data);
    }
    else {
        return null;
    }
};
const toVNodes = (h, fragment) => {
    const res = [];
    for (let i = 0, l = fragment.children.length; i < l; i++) {
        res.push(toVNode(h, fragment.children[i]));
    }
    return res;
};
const getChildren = (el) => {
    const fragment = document.createDocumentFragment();
    while (el.childNodes.length > 0) {
        fragment.append(el.childNodes[0]);
    }
    return fragment;
};
export const vwrap = (name, component, options = {}) => {
    class VwrapElement extends HTMLElement {
        connectedCallback() {
            if (!options.hasSlot)
                return this.render();
            window.setTimeout(() => {
                this.render();
            }, 0);
        }
        disconnectedCallback() {
            if (!this.__vue_custom_element__)
                return;
            this.__vue_custom_element__.$destroy();
            delete this.__vue_custom_element__;
        }
        render() {
            if (this.__vue_custom_element__)
                return;
            const children = getChildren(this);
            const props = getProps(this);
            const wrapper = new Vue({
                name: 'VWrapper',
                render(h) {
                    return h(component, {
                        props,
                    }, toVNodes(h, children));
                },
            });
            this.__vue_custom_element__ = wrapper;
            this.innerHTML = '<div></div>';
            this.__vue_custom_element__.$mount(this.children[0]);
        }
    }
    window.customElements.define(name, VwrapElement);
};

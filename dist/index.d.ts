import Vue, { ComponentOptions, VueConstructor } from 'vue';
declare type VwrapOptions = {
    hasSlot?: boolean;
};
export declare const vwrap: (name: string, component: ComponentOptions<Vue> | VueConstructor<Vue>, options?: VwrapOptions) => void;
export {};

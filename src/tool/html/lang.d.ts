import { Reactive } from "vue";

export function defineLang<T extends object>(textObject: T, onloadCallback?: () => void): Reactive<T>;
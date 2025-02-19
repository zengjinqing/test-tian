import { reactive } from "vue";
import store from "@/store";
import { baseURL, frontBaseURL } from "@/config/ip.config";

const langCache = new Map();

export function defineLang(path, textObject, onloadCallback) {
    const langTextRef = reactive(textObject);
    if (process.env.NODE_ENV === "development") {
        getComponentTextByPlugin(path).then(text => {
            for (const key in text) {
                // @ts-ignore;
                langTextRef[key] = text[key];
            }
            if (onloadCallback) onloadCallback(langTextRef);
        });
    } else {
        getLangAsync(path, langTextRef, onloadCallback);
    }
    return langTextRef;
}

function getLangAsync(path, langTextRef, onloadCallback) {
    path = "src" + path + "/lang/" + store.language + '.lang.json';
    let lang = langCache.get(store.language);
    let componentLang;
    // 语言模块不存在
    if (lang) {
        componentLang = lang.findKey('path', path);
        if (componentLang) {
            const text = componentLang.lang;
            for (const key in text) {
                // @ts-ignore;
                langTextRef[key] = text[key];
            }
            if (onloadCallback) onloadCallback(langTextRef);
        }
        // 获取语言模块
    } else {
        let sourceURL;
        if (store.terminal == 'PC') sourceURL = baseURL + '/client/lang?lang=' + store.language;
        else sourceURL = frontBaseURL + '/lang/' + store.language + '.langAll.json'
        fetch(sourceURL).then(res => res.json()).then(
            res => {
                if (!res) throw new Error('语言包服务不存在')
                const lang = store.terminal === 'WEB' ? res : res.data;
                if (!lang) throw new Error('语言包内容不存在');
                langCache.set(store.language, lang);
                lang.findKey('path', path);
                componentLang = lang.findKey('path', path);
                if (componentLang) {
                    const text = componentLang.lang;
                    for (const key in text) {
                        // @ts-ignore;
                        langTextRef[key] = text[key];
                    }
                    if (onloadCallback) onloadCallback(langTextRef);
                }
            }
        )
    }
}


async function getComponentTextByPlugin(path) {
    let sourcePath = process.env.NODE_ENV === 'development' ? '/src' : '/lang';
    let filePath = frontBaseURL + sourcePath + path + '/lang/' + store.language + '.lang.json';
    const res = await fetch(filePath);
    const fileJSON = await res.json().catch(_ => { throw new Error('获取组件文本路径错误:' + filePath) });
    return fileJSON;
}
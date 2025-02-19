import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import router from './router/index'
import 'element-plus/dist/index.css'
import './style.css'
import App from './App.vue'
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 自定义拖拽指令
app.directive('draggable', {
  beforeMount(el, binding) {
    // 添加拖拽事件监听
    el.addEventListener('mousedown', (e) => {
      const startX = e.clientX - el.offsetLeft;
      const startY = e.clientY - el.offsetTop;

      const moveFunc = (e) => {
        el.style.position = 'absolute';
        el.style.left = e.clientX - startX + 'px';
        el.style.top = e.clientY - startY + 'px';
      };

      el.addEventListener('mousemove', moveFunc);

      // 松开鼠标后移除事件监听
      el.addEventListener('mouseup', () => {
        el.removeEventListener('mousemove', moveFunc);
      }, { once: true });
    });
  }
});
app.use(ElementPlus).use(router).mount('#app')

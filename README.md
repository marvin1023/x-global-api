# Global API

一个提供全局 toast & loading & modal 的纯 JS 库，无依赖。

提供各种形式的 toast 及常规的 loading 和 modal。toast 特性如下：

- 默认图标支持 `'success' | 'error' | 'warning' | 'none'` ，可自定义图标；
- 支持纯图标或纯文本提示；
- 支持图标及文本横向或纵向显示；
- 支持 toast 垂直方向上，中，下显示；

## 安装

```bash
npm i x-global-api --save
```

## 使用

### Toast

```ts
import { showToast, hideToast, ToastOptions } from 'x-global-api';

// es 模块导入使用，手动引入 css 文件
import 'x-global-api/dist/esm/index.css';

// toast 默认会自动关闭
// 如不需要自动关闭，可设置 duration 为 0，或设置一个超大的值
// 默认参数
// {
//   icon: 'none',
//   mask: false,
//   duration: 2000,
//   maxWidth: 'auto',
//   place: 'center',
//   offset: '10px',
//   layout: 'block',
//   animation: 'fade',
// }
showToast(options: ToastOptions); // ToastOptions 见下面 TS 类型
hideToast();
```

### Loading

loading 属于 toast 的特例。toast 默认会自动消失，但是 loading 不会，需要主动调用 hideLoading（或调用新的 showToast 或 showLoading ）。

可通过设置 iconUrl 来自定义 loading 的图标。

```ts
import { showLoading, hideLoading, LoadingOptions } from 'x-global-api';

showLoading(options: LoadingOptions); // LoadingOptions 见下面 TS 类型
hideLoading();
```

### Modal

```ts
import { showModal, hideModal, ModalOptions } from 'x-global-api';

// 默认参数
// {
//   width: '300px',
//   footerTexts: [{ text: '取消' }, { text: '确认', color: '#00cafc' }],
//   footerLayout: 'inline',
//   maskCanClose: true,
//   animation: 'fade',
// }
showModal(options: ModalOptions); // ModalOptions 见下面 TS 类型
hideModal();
```

### TS 类型

```ts
// toast
// -----------------------------------------
export declare type ToastIconType = 'success' | 'error' | 'warning' | 'none' | 'custom';
export declare type ToastIconMap = Record<ToastIconType, string>;
export declare type ToastPlace = 'top' | 'center' | 'bottom';
export declare type ToastLayout = 'inline' | 'block';
export declare type ToastAnimation = 'fade' | 'down' | 'up' | string;
export interface ToastOptions {
  icon?: ToastIconType;
  iconUrl?: string; // 自定义图标
  title?: string;
  mask?: boolean;
  duration?: number;
  parent?: Element; // 默认插入到 body 最后，设置该属性则插入到该元素最后
  wrapClass?: string; // 添加自定义容器 class
  maxWidth?: string; // 限制最大长度，默认为 auto
  place?: ToastPlace; // 垂直位置，默认居中，可放在头部或底部
  offset?: string; // 当为头部或底部时，偏移的上或下的距离
  layout?: ToastLayout; // 图标与文字是一行显示还是不同行显示
  // 默认为 fade 动画，如 place 为 top，则默认为 down 动画，如 place 为 bottom，则默认为 up 动画，可自定义，见下面动画说明
  animation?: ToastAnimation;
}

// loading
// -----------------------------------------
export type LoadingOptions = Partial<Omit<ToastOptions, 'duration' | 'icon'>>;

// modal
// -----------------------------------------
export type ModalFooterText = { text: string; color?: string; key?: string };
// key 对应 ModalFooterText 中的 key，如没有，则为 index 值。如返回为 true 则不关闭弹窗
export type ModalFooterCallback = (key: string) => void | boolean;
export type ModalFooterLayout = 'inline' | 'block';

export interface ModalOptions {
  title?: string;
  content?: string;
  footerTexts?: ModalFooterText[]; // 底部按钮数组
  callback?: ModalFooterCallback; // 点击关闭
  footerLayout?: ModalFooterLayout; // 底部按钮是 block 单独一行还是 inline 在一行
  parent?: Element;
  wrapClass?: string;
  width?: string;
  maskCanClose?: boolean;
  animation?: 'fade' | string;
}
```

### 修改样式说明

第一种方法：通过修改 css 变量的值。

默认提供的如下的 css 变量，可通过修改变量的值来修改样式。

```css
:root {
  --global-api-toast-bg-color: rgba(0, 0, 0, 0.7);
  --global-api-toast-text-color: #fff;
  --global-api-toast-radius: 8px;
  --global-api-toast-z-index: 6000;

  --global-api-modal-overlay-bg-color: rgba(0, 0, 0, 0.7);
  --global-api-modal-bg-color: #fff;
  --global-api-modal-bg-active-color: #ededed;
  --global-api-modal-text-color: #000;
  --global-api-modal-radius: 8px;
  --global-api-modal-z-index: 5000;
  --global-api-modal-btn-border-color: #ededed;
}
```

第二种方法：自定义 class

通过 `wrapClass` 属性自定义 class，来覆盖样式。

## 动画说明

Toast 根据显示位置上、中、下，提供了 3 组动画，分别为 fade in/out，down in/out，up in/out。可自定义动画样式。而 modal 只提供一种 fade in/out 动画。

### Toast & Modal fade in/out

```css
/* animation: fade in/out */
/* -------------------------------------- */
.global-api-toast-fade-in,
.global-api-modal-fade-in {
  animation: globalApiFadeIn 0.3s ease-in-out both;
}

.global-api-toast-fade-out,
.global-api-modal-fade-out {
  animation: globalApiFadeOut 0.3s ease-in-out both;
}

@keyframes globalApiFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes globalApiFadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
```

### Toast down in/out

```css
/* animation: down in/out */
/* -------------------------------------- */
.global-api-toast-down-in .global-api-toast-main {
  animation: globalApiDownIn 0.3s ease-in-out both;
}

.global-api-toast-down-out .global-api-toast-main {
  animation: globalApiDownOut 0.3s ease-in-out both;
}

@keyframes globalApiDownIn {
  from {
    opacity: 0;
    transform: translate(-50%, calc(-100% - 30px));
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

@keyframes globalApiDownOut {
  from {
    opacity: 1;
    transform: translate(-50%, 0);
  }
  to {
    opacity: 0;
    transform: translate(-50%, calc(-100% - 30px));
  }
}
```

#### Toast down in/out

```css
/* animation: up in/out */
/* -------------------------------------- */
.global-api-toast-up-in .global-api-toast-main {
  animation: globalApiUpIn 0.3s ease-in-out both;
}

.global-api-toast-up-out .global-api-toast-main {
  animation: globalApiUpOut 0.3s ease-in-out both;
}

@keyframes globalApiUpIn {
  from {
    opacity: 0;
    transform: translate(-50%, calc(100% + 30px));
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

@keyframes globalApiUpOut {
  from {
    opacity: 1;
    transform: translate(-50%, 0);
  }
  to {
    opacity: 0;
    transform: translate(-50%, calc(100% + 30px));
  }
}
```

### 自定义动画

自定义 `animation` 属性的值，就会生成对应的 class。然后以此 class 就可以自定义动画，注意动画应该使用 animation 关键帧动画，不能使用 transition 动画。

以自定义 modal 的动画为例。设置 `animation` 的值为 `scale`，将会以该值添加对应的进入和离开动画 class，进入的 class 为 `.global-api-modal-scale-in`，对应的离开 class 为 `.global-api-modal-scale-out`。（如果为 toast，则相应的为 class 把 `modal` 关键词换成 `toast` 即可。）

不论是 toast 还是 modal，其实都是一个容器，然后包括主体内容和遮罩两部分。

```html
<!-- toast 结构 -->

<!-- 动画的进入和离开 class 挂着该节点上-->
<div class="global-api-toast">
  <!-- 如果 mask 为 true 则有，否则没有该层 -->
  <div class="global-api-toast-overlay"></div>
  <div class="global-api-toast-main">...</div>
</div>

<!-- modal 结构 -->
<!-- 动画的进入和离开 class 挂着该节点上-->
<div class="global-api-modal">
  <div class="global-api-modal-overlay"></div>
  <div class="global-api-modal-main">...</div>
</div>
```

由于动画涉及到两层，遮罩层和主体内容层，对于遮罩层来说，一个渐隐渐现动画即可，而内容主体就可以搞各种动画了。所以如果要自定义动画，其实应该有两个动画，一个是全局的渐隐渐现动画，一个是内容主体的动画。以上面的 modal 的 scale 为例：

```css
/* animation: scale in/out */
/* -------------------------------------- */
/* 整体 fade 动画 */
.global-api-modal-scale-in {
  animation: globalApiFadeIn 0.3s ease-in-out both;
}
.global-api-modal-scale-out {
  animation: globalApiFadeOut 0.3s ease-in-out both;
}

/* 主体内容 scale 动画 */
.global-api-modal-scale-in .global-api-modal-main {
  animation: globalApiScaleIn 0.3s ease-in-out both;
}

.global-api-modal-scale-out .global-api-modal-main {
  animation: globalApiScaleOut 0.3s ease-in-out both;
}

@keyframes globalApiScaleIn {
  from {
    transform: scale(0.5);
  }
  to {
    transform: scale(1);
  }
}

@keyframes globalApiScaleOut {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(0.5);
  }
}
```

## 注意事项

- toast 和 loading 公用一个实例，每次只能有一个出现，如果有新的要 show，那么老的就会被移除掉。
- 该库 TS 编译的 `target` 为 `ES2015`（即为最基础版本的 es6）。
- 如果为 es 模块导入使用，则需要手动引入 css 文件，如果是 umd 使用，则已经自动打包，不需要再手动引入

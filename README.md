# Global API

一个提供全局 toast、loading、modal、action sheet 的纯 JS 库，无依赖。

## 安装

```bash
npm i x-global-api --save
```

## 使用

### Toast

提供各种形式的 toast。特性如下：

- 默认图标支持 `'success' | 'error' | 'warning' | 'loading' | 'custom' | 'none'` ，可自定义图标（图标设置为 custom）；
- 支持纯图标或纯文本提示；
- 支持图标及文本横向或纵向显示；
- 支持 toast 垂直方向上，中，下显示；
- 支持配置默认参数。

```ts
import { Toast, showToast, hideToast, ToastConfig, ToastOptions } from 'x-global-api';

// es 模块导入使用，手动引入 css 文件
import 'x-global-api/dist/esm/index.css';

// toast 默认会自动关闭
// 如不需要自动关闭，可设置 duration 为 0，或设置一个超大的值
// 默认参数 Toast.defaultConfig
// {
//   icon: 'none',
//   mask: false,
//   duration: 2000,
//   maxWidth: 'calc(100vw - 32px)',
//   place: 'center',
//   layout: 'block',
//   animation: 'fade',
//   zIndex: 'auto',
//   multiLine: false,
//   iconMap: {
//     success: 'xxx', // success icon 的地址，默认用了一个base64图标，太长，所以这里用xxx表示，下面的 error，warning 一样
//     error: 'xxx',
//     warning: 'xxx',
//     loading: '',
//     custom: '',
//     none: '',
//   },
// };

// 可通过静态方法 setConfig 更新默认配置
Toast.setconfig(config: ToastConfig);

showToast(options: ToastOptions); // ToastOptions 见下面 TS 类型
hideToast();
```

### Loading

loading 属于 toast 的特例。toast 默认会自动消失，但是 loading 不会，需要主动调用 hideLoading。

默认 loading 是用 CSS 画的一个简单图标，可以通过 `Toast.setconfig` 指定 `loading` icon。

```ts
import { showLoading, hideLoading, LoadingOptions } from 'x-global-api';

showLoading(options: LoadingOptions); // LoadingOptions 见下面 TS 类型
hideLoading();
```

### Modal

```ts
import { Modal, showModal, ModalConfig, ModalOptions } from 'x-global-api';

// 默认参数 Modal.defaultConfig
// {
//   width: '300px',
//   footerButtons: [{ text: '取消', key: 'cancel' }, { text: '确认', key: 'confirm' }],
//   footerLayout: 'inline',
//   maskCanClose: true,
//   animation: 'fade',
//   isDarkModel: false,
//   zIndex: 'auto',
// }

// 可通过静态方法 setConfig 更新默认配置
Modal.setConfig(config: ModalConfig);

showModal(options: ModalOptions); // ModalOptions 见下面 TS 类型
```

### ActionSheet

```ts
import { ActionSheet, showActionSheet, ActionSheetConfig, ActionSheetOptions } from 'x-global-api';

// 默认参数 ActionSheet.defaultConfig
// {
//   lastItem: { text: '取消', key: 'cancel' },
//   animation: 'slide',
//   maskCanClose: true,
//   isDarkModel: false,
//   safeArea: true,
//   zIndex: 'auto',
// }

// 可通过静态方法 setConfig 更新默认配置
ActionSheet.setConfig(config: ActionSheetConfig);

showActionSheet(options: ActionSheetOptions); // ActionSheetOptions 见下面 TS 类型
```

## 详细说明

### TS 类型

```ts
// toast
// -----------------------------------------
export type ToastIconType = 'success' | 'error' | 'warning' | 'loading' | 'custom' | 'none';
export type ToastIconMap = Record<ToastIconType, string>;
export type ToastPlace = 'top' | 'center' | 'bottom';
export type ToastLayout = 'inline' | 'block';
export type ToastAnimation = 'fade' | 'down' | 'up' | 'none' | string;
export type LoadingOptions = Partial<Omit<ToastOptions, 'duration' | 'icon'>>;

export interface ToastConfig {
  icon?: ToastIconType; // 图标类型
  mask?: boolean;
  duration?: number;
  maxWidth?: string;
  place?: ToastPlace; // toast 出现未知，默认居中
  layout?: ToastLayout; // icon 与 title 的布局，inline 表示是同一行显示，block 表示各自独立一行显示
  animation?: ToastAnimation; // 使用什么动画
  iconMap?: ToastIconMap; // 图标类型所使用的图片
  zIndex?: number | 'auto';
  multiLine?: boolean; // 开启多行，不然会单行省略
}

export interface ToastOptionsExcludeConfig {
  parent?: Element; // 插入的父元素节点，默认为 body
  iconUrl?: string; // 当图片类型为 'custom' 时，自定义的图标地址。其余情况该地址无效。
  title?: string;
  wrapClass?: string; // 添加 className
  offset?: string; // 当 place 为 top 或 bottom 时，偏移顶部或底部的距离，默认为 15px
  safeArea?: boolean; // 当开启 safeArea，place 为 top 或 bottom 时，偏移的距离会再加上安全距离
  onAfterLeave?(): void; // toast 消失之后的回调
}

// show 方法参数 options
export type ToastOptions = ToastConfig & ToastOptionsExcludeConfig;

// modal
// -----------------------------------------
export type ModalFooterButton = { text: string; color?: string; key?: string };
export type ModalFooterButtonCallback = (key: string) => void | boolean; // key 对应 ModalFooterButton 中的 key，如没有，则为 index 值。
export type ModalFooterLayout = 'inline' | 'block';

export interface ModalConfig {
  width?: string;
  footerButtons?: ModalFooterButton[]; // 底部按钮
  footerLayout?: ModalFooterLayout; // 底部按钮布局，inline 所有按钮一行显示，block 表示各自一行
  maskCanClose?: boolean;
  animation?: 'scale' | 'none' | string; // 动画
  isDarkModel?: boolean; // 是否使用黑暗模式
  zIndex?: number | 'auto';
}

export interface ModalOptionsExcludeConfig {
  title?: string;
  content?: string;
  callback?: ModalFooterButtonCallback; // 按钮点击对应的回调，如果 return true 则不关闭该弹窗
  parent?: Element;
  wrapClass?: string; // 添加的 class
  onAfterLeave?(): void; // modal 消失之后的回调
}

// show 方法参数 options
export type ModalOptions = ModalConfig & ModalOptionsExcludeConfig;

// action-sheet
// -----------------------------------------
export type ActionSheetItem = { text: string; color?: string; key?: string };
export type ActionSheetCallback = (key: string) => void | boolean; // key 对应 ActionSheetItem 中的 key，如没有，则为 index 值。

export interface ActionSheetConfig {
  lastItem?: ActionSheetItem | false;
  animation?: 'slide' | 'none' | string;
  maskCanClose?: boolean;
  isDarkModel?: boolean;
  safeArea?: boolean;
  zIndex?: number | 'auto';
}

export interface ActionSheetOptionsExcludeConfig {
  title?: string;
  itemList?: ActionSheetItem[];
  callback?: ActionSheetCallback;
  parent?: Element;
  wrapClass?: string;
  onAfterLeave?(): void;
}

export type ActionSheetOptions = ActionSheetConfig & ActionSheetOptionsExcludeConfig;

export type ActionSheetInstanceOptions = Required<ActionSheetConfig> & ActionSheetOptionsExcludeConfig;
```

### 修改样式说明

第一种方法：通过修改 css 变量的值。

默认提供的如下的 css 变量，可通过修改变量的值来修改样式。

```css
:root {
  --global-api-toast-bg-color: rgba(0, 0, 0, 0.7);
  --global-api-toast-text-color: #fff;
  --global-api-toast-loading-border-color: rgba(256, 256, 256, 0.5); // 默认 loading 图标四分之三的颜色
  --global-api-toast-loading-border-bottom-color: #fff; // 默认 loading 图标四分之一的颜色
  --global-api-toast-radius: 8px;
  --global-api-toast-z-index: 6000;

  --global-api-modal-overlay-bg-color: rgba(0, 0, 0, 0.7);
  --global-api-modal-bg-color: #fff;
  --global-api-modal-bg-active-color: #ededed;
  --global-api-modal-text-color: #000;
  --global-api-modal-radius: 8px;
  --global-api-modal-z-index: 5000;
  --global-api-modal-btn-border-color: #ededed;

  --global-api-action-sheet-overlay-bg-color: rgba(0, 0, 0, 0.7);
  --global-api-action-sheet-bg-color: #fff;
  --global-api-action-sheet-divide-bg-color: #f7f7f7;
  --global-api-action-sheet-bg-active-color: #ededed;
  --global-api-action-sheet-text-color: #000;
  --global-api-action-sheet-radius: 8px;
  --global-api-action-sheet-z-index: 5000;
}
```

第二种方法：自定义 class

通过 `wrapClass` 属性自定义 class，来覆盖样式。

### 动画说明

- Toast 根据显示位置上、中、下，提供了 3 组动画，分别为 fade in/out，down in/out，up in/out。可自定义动画样式；
- Modal 只提供一种 scale in/out 动画；
- ActionSheet 只提供了一种 slide in/out 动画；
- 如不需要动画，则设置参数 `animation` 为 `none` 即可。

#### 自定义动画

自定义 `animation` 属性的值，就会生成对应的 class。然后以此 class 就可以自定义动画，注意动画应该使用 animation 关键帧动画，不能使用 transition 动画。

以自定义 modal 的动画为例。设置 `animation` 的值为 `scale`，将会以该值添加对应的进入和离开动画 class，进入的 class 为 `.global-api-modal-scale-in`，对应的离开 class 为 `.global-api-modal-scale-out`。（如果为 toast，则相应的为 class 把 `modal` 关键词换成 `toast` 即可。）

不论是 toast，modal，还是 actionSheet，其实都是一个容器，然后包括主体内容和遮罩两部分。

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

<!-- modal 结构 -->
<!-- 动画的进入和离开 class 挂着该节点上-->
<div class="global-api-action-sheet">
  <div class="global-api-action-sheet-overlay"></div>
  <div class="global-api-action-sheet-main">...</div>
</div>
```

由于动画涉及到两层，遮罩层和主体内容层，对于遮罩层来说，一个渐隐渐现动画即可，而内容主体就可以搞各种动画了。所以如果要自定义动画，其实应该有两个动画，一个是全局的渐隐渐现动画，一个是内容主体的动画。以上面的 modal 的 scale 为例：

```css
/* animation: scale in/out */
/* -------------------------------------- */
/* 整体 fade 动画 */
.global-api-modal-scale-in {
  animation: globalApiModalFadeIn 0.3s ease-in-out both;
}

.global-api-modal-scale-out {
  animation: globalApiModalFadeIn 0.3s ease-in-out reverse both;
}

/* 主题内容 scale 动画 */
.global-api-modal-scale-in .global-api-modal-main {
  animation: globalApiModalScaleIn 0.3s ease-in-out both;
}

.global-api-modal-scale-out .global-api-modal-main {
  animation: globalApiModalScaleIn 0.3s ease-in-out reverse both;
}

@keyframes globalApiModalFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes globalApiModalScaleIn {
  from {
    transform: scale(0.5);
  }
  to {
    transform: scale(1);
  }
}
```

## 查看 demo

运行命令，开启本地服务：

```bash
npm run dev
```

访问 example 目录中的 html 文件即可预览，如预览 toast demo： `http://127.0.0.1:5173/example/toast.html`

## 注意事项

- toast 和 loading 公用一个实例，每次只能有一个出现，如果有新的要 show，那么老的就会被移除掉。
- 该库 TS 编译的 `target` 为 `ES2015`（即为最基础版本的 es6）。
- 如果为 es 模块导入使用，则需要手动引入 css 文件，如果是 umd 使用，则已经自动打包，不需要再手动引入

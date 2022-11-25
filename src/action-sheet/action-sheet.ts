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

export class ActionSheet {
  parent: Element = document.body;
  wrap: Element | null = null;
  main: Element | null = null;
  overlay: Element | null = null;
  options!: ActionSheetInstanceOptions;
  enterClass: string | '' = '';
  leaveClass: string | '' = '';
  isHiding = false;

  static defaultConfig: Required<ActionSheetConfig> = {
    lastItem: { text: '取消', key: 'cancel' },
    animation: 'slide',
    maskCanClose: true,
    isDarkModel: false,
    safeArea: true,
    zIndex: 'auto',
  };

  static setConfig(config: ActionSheetConfig) {
    Object.assign(ActionSheet.defaultConfig, config);
  }

  show(options: ActionSheetOptions) {
    if (this.wrap) {
      console.info('please close the current action sheet first!');
      return;
    }

    this.options = Object.assign({}, ActionSheet.defaultConfig, options);
    const { parent, itemList } = this.options;

    if (!itemList || itemList.length === 0) {
      console.error('itemList is required!');
      return;
    }

    // 自定义插入父元素，默认插入到 body 结束前
    if (parent) {
      this.parent = parent;
    }

    this.generateHTML();

    this.onEventListener();
  }

  hide() {
    if (!this.wrap || this.isHiding) {
      return;
    }

    this.isHiding = true;
    const { animation } = this.options;

    if (animation !== 'none') {
      this.wrap.classList.add(this.leaveClass);
    } else {
      this.finish();
    }
  }

  finish() {
    if (!this.wrap) {
      return;
    }

    this.offEventListener();
    this.parent.removeChild(this.wrap);
    this.wrap = null;
    this.isHiding = false;
    this.options.onAfterLeave?.();
  }

  onEventListener() {
    if (!this.wrap) {
      return;
    }

    this.main = this.wrap.querySelector('.global-api-action-sheet-main');
    this.overlay = this.wrap.querySelector('.global-api-action-sheet-overlay');

    this.wrap.addEventListener('touchmove', this.wrapTouchMoveHandler.bind(this));
    this.wrap.addEventListener('animationend', this.wrapAnimationEndHandler.bind(this));
    this.main?.addEventListener('click', this.mainHandler.bind(this));

    if (this.options.maskCanClose) {
      this.overlay?.addEventListener('click', this.maskHandler.bind(this));
    }
  }

  offEventListener() {
    this.wrap?.removeEventListener('touchmove', this.wrapTouchMoveHandler.bind(this));
    this.wrap?.removeEventListener('animationend', this.wrapAnimationEndHandler.bind(this));
    this.main?.removeEventListener('click', this.mainHandler.bind(this));

    if (this.options.maskCanClose) {
      this.overlay?.removeEventListener('click', this.maskHandler.bind(this));
    }
  }

  wrapTouchMoveHandler(e: Event) {
    e.preventDefault();
  }

  wrapAnimationEndHandler() {
    const classNames = this.wrap?.className;
    if (classNames?.includes(this.enterClass)) {
      this.wrap?.classList.remove(this.enterClass);
    }

    if (classNames?.includes(this.leaveClass)) {
      this.finish();
    }
  }

  mainHandler(e: Event) {
    const target = e.target as HTMLElement;
    const { className, dataset } = target;
    const { callback } = this.options;

    if (className.includes('global-api-action-sheet-item')) {
      if (callback?.(dataset.key!) !== true) {
        this.hide();
      }
    }
  }

  maskHandler() {
    this.hide();
  }

  generateHTML() {
    const { itemList, lastItem, animation, title } = this.options;

    if (!itemList || itemList.length === 0) {
      return;
    }

    if (animation !== 'none') {
      this.enterClass = `global-api-action-sheet-${animation}-in`;
      this.leaveClass = `global-api-action-sheet-${animation}-out`;
    }

    this.wrap = document.createElement('div');
    this.wrapCssHandler();

    const itemHTML = itemList.reduce((prev, next, index) => {
      return (
        prev +
        `<div class="global-api-action-sheet-item" data-key="${next.key || index}" style="color: ${
          next.color || 'currentColor'
        }">${next.text}</div>`
      );
    }, '');

    const lastItemHTML =
      lastItem &&
      `<div class="global-api-action-sheet-item" data-key="${lastItem.key || itemList.length}" style="color: ${
        lastItem.color || 'currentColor'
      }">${lastItem.text}</div>`;

    const maskHTML = '<div class="global-api-action-sheet-overlay"></div>';
    const mainHTMlBegin = `<div class="global-api-action-sheet-main">`;
    const titleHTML = title ? `<div class="global-api-action-sheet-title">${title}</div>` : '';
    const contentHTML = `<div class="global-api-action-sheet-content">${itemHTML}</div>`;
    const footerHtml = lastItemHTML
      ? `<div class="global-api-action-sheet-divide"></div><div class="global-api-action-sheet-footer">${lastItemHTML}</div>`
      : '';
    const mainHTMlEnd = '</div>';

    const innerHTML = maskHTML + mainHTMlBegin + titleHTML + contentHTML + footerHtml + mainHTMlEnd;

    this.wrap.innerHTML = innerHTML;
    this.parent.appendChild(this.wrap);
  }

  wrapCssHandler() {
    if (!this.wrap) {
      return;
    }

    const { zIndex, wrapClass, isDarkModel, safeArea } = this.options;

    this.wrap.classList.add('global-api-action-sheet');

    if (zIndex !== 'auto') {
      this.wrap.setAttribute('style', `z-index: ${zIndex}`);
    }

    if (this.enterClass) {
      this.wrap.classList.add(this.enterClass);
    }

    if (wrapClass) {
      this.wrap.classList.add(wrapClass);
    }

    if (isDarkModel) {
      this.wrap.classList.add('global-api-action-sheet--dark');
    }

    if (safeArea) {
      this.wrap.classList.add('global-api-action-sheet--safe-area');
    }
  }
}

export type ModalFooterText = { text: string; color?: string; key?: string };
export type ModalFooterCallback = (key: string) => void | boolean; // key 对应 ModalFooterText 中的 key，如没有，则为 index 值。
export type ModalFooterLayout = 'inline' | 'block';

export interface ModalOptions {
  title?: string;
  content?: string;
  footerTexts?: ModalFooterText[];
  callback?: ModalFooterCallback;
  footerLayout?: ModalFooterLayout;
  parent?: Element;
  wrapClass?: string;
  width?: string;
  maskCanClose?: boolean;
  animation?: 'fade' | string;
  isDarkModel?: boolean;
  onAfterLeave?(): void;
}

export class Modal {
  parent: Element = document.body;
  wrap: Element | null = null;
  footer: Element | null = null;
  overlay: Element | null = null;
  isHiding = false;
  options!: ModalOptions;

  constructor() {
    this.initOptions();
  }

  initOptions() {
    this.options = {
      width: '300px',
      footerTexts: [{ text: '取消' }, { text: '确认', color: '#00cafc' }],
      footerLayout: 'inline',
      maskCanClose: true,
      animation: 'fade',
      isDarkModel: false,
    };
  }

  show(options: ModalOptions) {
    // toast 为单例，如果有正在显示的，则先隐藏老的，再显示新的
    if (this.wrap) {
      this.hide(() => {
        this.show(options);
      });
      return;
    }

    Object.assign(this.options, options);
    const { title, content, parent } = this.options;

    if (!content && !title) {
      console.error('content or title is required!');
      return;
    }

    // 自定义插入父元素，默认插入到 body 结束前
    if (parent) {
      this.parent = parent;
    }

    this.generateHTML();

    this.onEventListener();
  }

  generateHTML() {
    const { wrapClass, footerTexts, footerLayout, width, title, content, animation, isDarkModel } = this.options;
    this.wrap = document.createElement('div');
    this.wrap.classList.add('global-api-modal', `global-api-modal-${animation}-in`);

    if (wrapClass) {
      this.wrap.classList.add(wrapClass);
    }

    if (isDarkModel) {
      this.wrap.classList.add('global-api-modal--dark');
    }

    // HTML main
    const mainClass = `global-api-modal-main`;
    const footerClass = `global-api-modal-footer global-api-modal-footer--${footerLayout}`;

    const btnHTML = footerTexts!.reduce((prev, next, index) => {
      const style = next.color ? `color: ${next.color};` : '';
      return (
        prev +
        `<div class="global-api-modal-footer-btn" data-key="${next.key || index}" style="${style}">${next.text}</div>`
      );
    }, '');

    const maskHTML = '<div class="global-api-modal-overlay global-api-fade-in"></div>';
    const mainHTMlBegin = `<div class="${mainClass}" style="width: ${width};">`;

    const titleHTML = title ? `<div class="global-api-modal-title">${title}</div>` : '';
    const contentHTML = content ? `<div class="global-api-modal-content">${content}</div>` : '';
    const footerHtml = `<div class="${footerClass}">${btnHTML}</div>`;
    const mainHTMlEnd = '</div>';

    const innerHTML = maskHTML + mainHTMlBegin + titleHTML + contentHTML + footerHtml + mainHTMlEnd;

    this.wrap.innerHTML = innerHTML;
    this.parent.appendChild(this.wrap);
  }

  onEventListener() {
    this.footer = this.wrap!.querySelector('.global-api-modal-footer');
    this.overlay = this.wrap!.querySelector('.global-api-overlay');

    this.footer?.addEventListener('click', this.footerHandler.bind(this));

    if (this.options.maskCanClose) {
      this.overlay?.addEventListener('click', this.maskHandler.bind(this));
    }
  }

  offEventListener() {
    this.footer?.removeEventListener('click', this.footerHandler.bind(this));
    this.overlay?.removeEventListener('click', this.maskHandler.bind(this));
  }

  footerHandler(e: Event) {
    const { className, dataset } = e.target! as HTMLElement;
    const { callback } = this.options;

    if (className.includes('global-api-modal-footer-btn')) {
      if (callback?.(dataset.key!) !== true) {
        this.hide();
      }
    }
  }

  maskHandler() {
    this.hide();
  }

  hide(callback?: () => void) {
    if (!this.wrap || this.isHiding) {
      return;
    }

    this.isHiding = true;
    const { animation, onAfterLeave } = this.options;

    const animationendHandler = () => {
      this.wrap?.removeEventListener('animationend', animationendHandler);
      this.offEventListener();
      this.parent.removeChild(this.wrap!);
      this.wrap = null;
      this.isHiding = false;
      this.initOptions();
      onAfterLeave?.();
      callback?.();
    };

    this.wrap?.addEventListener('animationend', animationendHandler);

    this.wrap?.classList.add(`global-api-modal-${animation}-out`);
  }
}

export type ModalFooterText = { text: string; color?: string; key?: string };
export type ModalFooterCallback = (key: string) => void | boolean; // key 对应 ModalFooterText 中的 key，如没有，则为 index 值。
export type ModalFooterLayout = 'inline' | 'block';

export interface ModalConfig {
  width?: string;
  footerLayout?: ModalFooterLayout;
  footerTexts?: ModalFooterText[];
  maskCanClose?: boolean;
  animation?: 'fade' | string;
  isDarkModel?: boolean;
}

export interface ModalOptionsExcludeConfig {
  title?: string;
  content?: string;
  callback?: ModalFooterCallback;
  parent?: Element;
  wrapClass?: string;
  onAfterLeave?(): void;
}

export type ModalOptions = ModalConfig & ModalOptionsExcludeConfig;

export type ModalInstanceOptions = Required<ModalConfig> & ModalOptionsExcludeConfig;

export class Modal {
  parent: Element = document.body;
  wrap: Element | null = null;
  footer: Element | null = null;
  overlay: Element | null = null;
  isHiding = false;
  options!: ModalInstanceOptions;

  static defaultConfig: Required<ModalConfig> = {
    width: '300px',
    footerTexts: [{ text: '取消' }, { text: '确认', color: '#00cafc' }],
    footerLayout: 'inline',
    maskCanClose: true,
    animation: 'fade',
    isDarkModel: false,
  };

  static setConfig(config: ModalConfig) {
    Object.assign(Modal.defaultConfig, config);
  }

  show(options: ModalOptions) {
    if (this.wrap) {
      this.hide(() => {
        this.show(options);
      });
      return;
    }

    this.options = Object.assign({}, Modal.defaultConfig, options);

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

    let btnHTML = '';
    if (footerTexts.length > 0) {
      btnHTML = footerTexts.reduce((prev, next, index) => {
        const style = next.color ? `color: ${next.color};` : '';
        return (
          prev +
          `<div class="global-api-modal-footer-btn" data-key="${next.key || index}" style="${style}">${next.text}</div>`
        );
      }, '');
    }

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
    if (!this.wrap) {
      return;
    }

    this.footer = this.wrap.querySelector('.global-api-modal-footer');
    this.overlay = this.wrap.querySelector('.global-api-overlay');

    this.wrap.addEventListener('touchmouve', this.wrapHandler.bind(this));
    this.footer?.addEventListener('click', this.footerHandler.bind(this));

    if (this.options.maskCanClose) {
      this.overlay?.addEventListener('click', this.maskHandler.bind(this));
    }
  }

  offEventListener() {
    this.footer?.removeEventListener('click', this.footerHandler.bind(this));
    this.overlay?.removeEventListener('click', this.maskHandler.bind(this));
    this.wrap?.removeEventListener('touchmouve', this.wrapHandler.bind(this));
  }

  wrapHandler(e: Event) {
    e.preventDefault();
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
      if (!this.wrap) {
        return;
      }
      this.wrap.removeEventListener('animationend', animationendHandler);
      this.offEventListener();
      this.parent.removeChild(this.wrap);
      this.wrap = null;
      this.isHiding = false;
      onAfterLeave?.();
      callback?.();
    };

    this.wrap?.addEventListener('animationend', animationendHandler);

    this.wrap?.classList.add(`global-api-modal-${animation}-out`);
  }
}

export type ModalFooterButton = { text: string; color?: string; key?: string };
export type ModalFooterButtonCallback = (key: string) => void | boolean; // key 对应 ModalFooterButton 中的 key，如没有，则为 index 值。
export type ModalFooterLayout = 'inline' | 'block';

export interface ModalConfig {
  width?: string;
  footerLayout?: ModalFooterLayout;
  footerButtons?: ModalFooterButton[];
  maskCanClose?: boolean;
  animation?: 'scale' | 'none' | string;
  isDarkModel?: boolean;
  zIndex?: number | 'auto';
}

export interface ModalOptionsExcludeConfig {
  title?: string;
  content?: string;
  callback?: ModalFooterButtonCallback;
  parent?: HTMLElement;
  wrapClass?: string;
  onAfterLeave?(): void;
}

export type ModalOptions = ModalConfig & ModalOptionsExcludeConfig;

export type ModalInstanceOptions = Required<ModalConfig> & ModalOptionsExcludeConfig;

export type fn = () => void;

export class Modal {
  private parent: HTMLElement = document.body;
  private wrap: HTMLElement | null = null;
  private footer: HTMLElement | null = null;
  private overlay: HTMLElement | null = null;
  private options!: ModalInstanceOptions;
  private enterClass: string | '' = '';
  private leaveClass: string | '' = '';
  private isHiding = false;

  private static defaultConfig: Required<ModalConfig> = {
    width: '300px',
    footerButtons: [
      { text: '取消', key: 'cancel' },
      { text: '确认', key: 'confirm' },
    ],
    footerLayout: 'inline',
    maskCanClose: true,
    animation: 'scale',
    isDarkModel: false,
    zIndex: 'auto',
  };

  public static setConfig(config: ModalConfig) {
    Object.assign(Modal.defaultConfig, config);
  }

  public show(options: ModalOptions) {
    if (this.wrap) {
      console.info('please close the current modal first!');
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

  public hide() {
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

  private finish() {
    if (!this.wrap) {
      return;
    }

    this.offEventListener();
    this.parent.removeChild(this.wrap);
    this.wrap = null;
    this.isHiding = false;
    this.options.onAfterLeave?.();
  }

  private onEventListener() {
    if (!this.wrap) {
      return;
    }

    this.footer = this.wrap.querySelector('.global-api-modal-footer');
    this.overlay = this.wrap.querySelector('.global-api-modal-overlay');

    this.wrap.addEventListener('touchmove', this.wrapTouchMoveHandler.bind(this));
    this.wrap.addEventListener('animationend', this.wrapAnimationEndHandler.bind(this));
    this.footer?.addEventListener('click', this.footerHandler.bind(this));

    if (this.options.maskCanClose) {
      this.overlay?.addEventListener('click', this.maskHandler.bind(this));
    }
  }

  private offEventListener() {
    this.wrap?.removeEventListener('touchmove', this.wrapTouchMoveHandler.bind(this));
    this.wrap?.removeEventListener('animationend', this.wrapAnimationEndHandler.bind(this));
    this.footer?.removeEventListener('click', this.footerHandler.bind(this));

    if (this.options.maskCanClose) {
      this.overlay?.removeEventListener('click', this.maskHandler.bind(this));
    }
  }

  private wrapTouchMoveHandler(e: Event) {
    e.preventDefault();
  }

  private wrapAnimationEndHandler() {
    const classNames = this.wrap?.className;
    if (classNames?.includes(this.enterClass)) {
      this.wrap?.classList.remove(this.enterClass);
    }

    if (classNames?.includes(this.leaveClass)) {
      this.finish();
    }
  }

  private footerHandler(e: Event) {
    const target = e.target as HTMLElement;
    const { className, dataset } = target;
    const { callback } = this.options;

    if (className.includes('global-api-modal-footer-btn')) {
      if (callback?.(dataset.key!) !== true) {
        this.hide();
      }
    }
  }

  private maskHandler() {
    this.hide();
  }

  private generateHTML() {
    const { footerButtons, footerLayout, width, title, content, animation } = this.options;

    if (animation !== 'none') {
      this.enterClass = `global-api-modal-${animation}-in`;
      this.leaveClass = `global-api-modal-${animation}-out`;
    }

    this.wrap = document.createElement('div');
    this.wrapCssHandler();

    // HTML main
    const mainClass = `global-api-modal-main`;
    const footerClass = `global-api-modal-footer global-api-modal-footer--${footerLayout}`;

    let btnHTML = '';
    if (footerButtons.length > 0) {
      btnHTML = footerButtons.reduce((prev, next, index) => {
        const style = next.color ? `color: ${next.color};` : '';
        return (
          prev +
          `<div class="global-api-modal-footer-btn" data-key="${next.key || index}" style="${style}">${next.text}</div>`
        );
      }, '');
    }

    const maskHTML = '<div class="global-api-modal-overlay"></div>';
    const mainHTMlBegin = `<div class="${mainClass}" style="width: ${width};">`;

    const titleHTML = title ? `<div class="global-api-modal-title">${title}</div>` : '';
    const contentHTML = content ? `<div class="global-api-modal-content">${content}</div>` : '';
    const footerHtml = `<div class="${footerClass}">${btnHTML}</div>`;
    const mainHTMlEnd = '</div>';

    const innerHTML = maskHTML + mainHTMlBegin + titleHTML + contentHTML + footerHtml + mainHTMlEnd;

    this.wrap.innerHTML = innerHTML;
    this.parent.appendChild(this.wrap);
  }

  private wrapCssHandler() {
    if (!this.wrap) {
      return;
    }
    const { zIndex, wrapClass, isDarkModel } = this.options;

    this.wrap.classList.add('global-api-modal');
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
      this.wrap.classList.add('global-api-modal--dark');
    }
  }
}

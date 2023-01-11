export type ToastIconType = 'success' | 'error' | 'warning' | 'loading' | 'custom' | 'none';
export type ToastIconMap = Record<ToastIconType, string>;
export type ToastPlace = 'top' | 'center' | 'bottom';
export type ToastLayout = 'inline' | 'block';
export type ToastAnimation = 'fade' | 'down' | 'up' | 'none' | string;
export type LoadingOptions = Partial<Omit<ToastOptions, 'duration' | 'icon'>>;

export interface ToastConfig {
  icon?: ToastIconType;
  mask?: boolean;
  duration?: number;
  maxWidth?: string;
  place?: ToastPlace;
  layout?: ToastLayout;
  animation?: ToastAnimation;
  iconMap?: ToastIconMap;
  zIndex?: number | 'auto';
  multiLine?: boolean; // 开启多行，不然会单行省略
}

export interface ToastOptionsExcludeConfig {
  parent?: HTMLElement;
  iconUrl?: string;
  title?: string;
  wrapClass?: string;
  offset?: string;
  onAfterLeave?(): void;
  safeArea?: boolean;
}

// show 方法参数 options
export type ToastOptions = ToastConfig & ToastOptionsExcludeConfig;

// 实例 options
export type ToastInstanceOptions = Required<ToastConfig> & ToastOptionsExcludeConfig;

export class Toast {
  private parent: HTMLElement = document.body;
  private wrap: HTMLElement | null = null;
  private isHiding = false;
  private options!: ToastInstanceOptions;
  private enterClass: string | '' = '';
  private leaveClass: string | '' = '';
  private timer?: ReturnType<typeof setTimeout>;

  private static defaultConfig: Required<ToastConfig> = {
    icon: 'none',
    mask: false,
    duration: 2000,
    maxWidth: 'calc(100vw - 32px)',
    place: 'center',
    layout: 'block',
    animation: 'fade',
    zIndex: 'auto',
    multiLine: false,
    iconMap: {
      success:
        'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTYgMTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjgiIGZpbGw9IiMxNUQxNzMiPjwvY2lyY2xlPjxwYXRoIGQ9Ik00LjU1MTUxIDcuNjAwMUw3LjE4MjEzIDEwLjIzMDZMMTEuOTE2MSA1LjQ5NjY4IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PC9wYXRoPjwvc3ZnPg==',
      error:
        'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTYgMTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjgiIGZpbGw9IiNGRjU3NjUiPjwvY2lyY2xlPjxwYXRoIGQ9Ik04IDEwVjEyIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiPjwvcGF0aD48cGF0aCBkPSJNOCA0VjkiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiI+PC9wYXRoPjwvc3ZnPg==',
      warning:
        'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTYgMTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjgiIGZpbGw9IiMwMDk5RkYiPjwvY2lyY2xlPjxwYXRoIGQ9Ik04IDdWMTIiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiI+PC9wYXRoPjxwYXRoIGQ9Ik04IDRWNiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIj48L3BhdGg+PC9zdmc+Cg==',
      loading: '',
      custom: '',
      none: '',
    },
  };

  public static setConfig(config: ToastConfig) {
    Object.assign(Toast.defaultConfig, config);
  }

  public show(options: ToastOptions) {
    // toast 为单例，如果有正在显示的，则直接忽略
    if (this.wrap) {
      this.finish();
    }

    const { animation, place, icon } = options;
    if (!animation && place && place !== 'center') {
      const animationMap = {
        top: 'down',
        bottom: 'up',
      };

      options.animation = animationMap[place];
      options.offset = options.offset ?? '16px'; // 默认 offset 为 10px
    }

    // 如果是 loading
    if (icon === 'loading') {
      options.duration = 0;
      options.title = options.title ?? '加载中...';
    }

    this.options = Object.assign({}, Toast.defaultConfig, options);
    const { title, iconUrl, parent, duration } = this.options;

    if (iconUrl) {
      this.options.iconMap.custom = iconUrl;
      this.options.icon = 'custom';
    }

    if (this.options.icon === 'none' && !title) {
      console.error('icon or title is required!');
      return;
    }

    // 自定义插入父元素，默认插入到 body 结束前
    if (parent) {
      this.parent = parent;
    }

    this.generateHTML();
    this.onEventListener();

    // auto hide
    if (duration) {
      this.timer = setTimeout(() => {
        this.hide();
      }, duration);
    }
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

    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.offEventListener();
    this.parent.removeChild(this.wrap);
    this.wrap = null;
    this.isHiding = false;
    this.options.onAfterLeave?.();
  }

  private onEventListener() {
    this.wrap?.addEventListener('animationend', this.wrapAnimationEndHandler.bind(this));
  }

  private offEventListener() {
    this.wrap?.removeEventListener('animationend', this.wrapAnimationEndHandler.bind(this));
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

  private generateHTML() {
    const { layout, mask, icon, maxWidth, title, multiLine } = this.options;
    const { iconMap } = Toast.defaultConfig;
    const { animation } = this.options;

    if (animation !== 'none') {
      this.enterClass = `global-api-toast-${animation}-in`;
      this.leaveClass = `global-api-toast-${animation}-out`;
    }

    this.wrap = document.createElement('div');

    this.wrapCssHandler();

    const hasIcon = icon !== 'none';

    // HTML main
    let mainClass = `global-api-toast-main`;
    if (layout === 'inline') {
      mainClass += ` global-api-toast-main--inline`;
    } else if (hasIcon) {
      mainClass += ` global-api-toast-main--with-icon`;
    }

    let titleClass = 'global-api-toast-title';
    if (!multiLine) {
      titleClass += ` global-api-toast-title--ellipsis`;
    }

    // place

    const iconUrl = iconMap[icon];
    let iconClass = 'global-api-toast-icon';
    if (icon === 'loading' && iconUrl === '') {
      iconClass += ' global-api-toast-icon--loading';
    }

    const maskHTML = mask ? '<div class="global-api-toast-overlay"></div>' : '';
    const mainHTMlBegin = `<div class="${mainClass}" style="max-width: ${maxWidth};">`;
    const iconHTML = hasIcon ? `<div class="${iconClass}" style="background-image: url(${iconUrl})"></div>` : '';
    const titleHTML = title ? `<div class="${titleClass}">${title}</div>` : '';
    const mainHTMlEnd = '</div>';

    const innerHTML = maskHTML + mainHTMlBegin + iconHTML + titleHTML + mainHTMlEnd;

    this.wrap.innerHTML = innerHTML;
    this.parent.appendChild(this.wrap);
  }

  private wrapCssHandler() {
    const { zIndex, wrapClass, safeArea, place, offset } = this.options;

    if (!this.wrap) {
      return;
    }

    this.wrap.classList.add('global-api-toast');
    if (zIndex !== 'auto') {
      this.wrap.setAttribute('style', `z-index: ${zIndex}`);
    }

    if (this.enterClass) {
      this.wrap.classList.add(this.enterClass);
    }

    if (wrapClass) {
      this.wrap.classList.add(wrapClass);
    }

    if (safeArea && place !== 'center') {
      this.wrap.classList.add('global-api-toast--safe-area');
    }

    if (place === 'top') {
      // placeStyle = `top: ${offset};`;
      this.wrap.classList.add('global-api-toast--top');
      this.wrap.style.setProperty('top', offset!);
    } else if (place === 'bottom') {
      // placeStyle = `bottom: ${offset};`;
      this.wrap.classList.add('global-api-toast--bottom');
      this.wrap.style.setProperty('bottom', offset!);
    } else {
      this.wrap.style.setProperty('top', '50%');
    }
  }
}

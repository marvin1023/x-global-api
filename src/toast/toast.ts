export type ToastIconType = 'success' | 'error' | 'warning' | 'loading' | 'custom' | 'none';
export type ToastIconMap = Record<ToastIconType, string>;
export type ToastPlace = 'top' | 'center' | 'bottom';
export type ToastLayout = 'inline' | 'block';
export type ToastAnimation = 'fade' | 'down' | 'up' | string;
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
}

export interface ToastOptionsExcludeConfig {
  parent?: Element;
  iconUrl?: string;
  title?: string;
  wrapClass?: string;
  offset?: string;
  onAfterLeave?(): void;
}

// show 方法参数 options
export type ToastOptions = ToastConfig & ToastOptionsExcludeConfig;

// 实例 options
export type ToastInstanceOptions = Required<ToastConfig> & ToastOptionsExcludeConfig;

export class Toast {
  parent: Element = document.body;
  wrap: Element | null = null;
  isHiding = false;
  options!: ToastInstanceOptions;

  static defaultConfig: Required<ToastConfig> = {
    icon: 'none',
    mask: false,
    duration: 2000,
    maxWidth: 'calc(100vw - 32px)',
    place: 'center',
    layout: 'block',
    animation: 'fade',
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

  static setConfig(config: ToastConfig) {
    Object.assign(Toast.defaultConfig, config);
  }

  show(options: ToastOptions) {
    // toast 为单例，如果有正在显示的，则先隐藏老的，再显示新的
    if (this.wrap) {
      this.hide(() => {
        this.show(options);
      });
      return;
    }

    const { animation, place, icon } = options;
    if (!animation && place && place !== 'center') {
      const animationMap = {
        top: 'down',
        bottom: 'up',
      };

      options.animation = animationMap[place];
      options.offset = options.offset ?? '10px'; // 默认 offset 为 10px
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

    // auto hide
    if (duration) {
      const timer = setTimeout(() => {
        this.hide();
        clearTimeout(timer);
      }, duration);
    }
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
      this.parent.removeChild(this.wrap);
      this.wrap = null;
      this.isHiding = false;
      onAfterLeave?.();
      callback?.();
    };

    this.wrap.addEventListener('animationend', animationendHandler);

    this.wrap.classList.add(`global-api-toast-${animation}-out`);
  }

  generateHTML() {
    const { place, offset, layout, mask, icon, maxWidth, title, wrapClass } = this.options;
    const { iconMap } = Toast.defaultConfig;
    const { animation } = this.options;

    this.wrap = document.createElement('div');
    this.wrap.classList.add('global-api-toast', `global-api-toast-${animation}-in`);

    if (wrapClass) {
      this.wrap.classList.add(wrapClass);
    }

    const hasIcon = icon !== 'none';

    // HTML main
    let mainClass = `global-api-toast-main`;
    if (layout === 'inline') {
      mainClass += ` global-api-toast-main--inline`;
    } else if (hasIcon) {
      mainClass += ` global-api-toast-main--with-icon`;
    }

    // place
    let placeStyle = 'top: 50%; ';

    if (place === 'top') {
      placeStyle = `top: ${offset};`;
      mainClass += ` global-api-toast-main--top`;
    }

    if (place === 'bottom') {
      placeStyle = `bottom: ${offset};`;
      mainClass += ` global-api-toast-main--bottom`;
    }

    const iconUrl = iconMap[icon];
    let iconClass = 'global-api-toast-icon';
    if (icon === 'loading' && iconUrl === '') {
      iconClass += ' global-api-toast-icon--loading';
    }

    const maskHTML = mask ? '<div class="global-api-toast-overlay"></div>' : '';
    const mainHTMlBegin = `<div class="${mainClass}" style="max-width: ${maxWidth}; ${placeStyle}">`;
    const iconHTML = hasIcon ? `<div class="${iconClass}" style="background-image: url(${iconUrl})"></div>` : '';
    const titleHTML = title ? `<div class="global-api-toast-title">${title}</div>` : '';
    const mainHTMlEnd = '</div>';

    const innerHTML = maskHTML + mainHTMlBegin + iconHTML + titleHTML + mainHTMlEnd;

    this.wrap.innerHTML = innerHTML;
    this.parent.appendChild(this.wrap);
  }
}

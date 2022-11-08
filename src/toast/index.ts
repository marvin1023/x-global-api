export type ToastIconType = 'success' | 'error' | 'warning' | 'custom' | 'none';
export type ToastIconMap = Record<ToastIconType, string>;
export type ToastPlace = 'top' | 'center' | 'bottom';
export type ToastLayout = 'inline' | 'block';
export type ToastAnimation = 'fade' | 'down' | 'up' | string;

export interface ToastOptions {
  icon?: ToastIconType;
  iconUrl?: string;
  title?: string;
  mask?: boolean;
  duration?: number;
  parent?: Element;
  wrapClass?: string;
  maxWidth?: string;
  place?: ToastPlace;
  offset?: string;
  layout?: ToastLayout;
  animation?: ToastAnimation;
}

export class Toast {
  parent: Element = document.body;
  wrap: Element | null = null;
  iconMap: ToastIconMap;
  isHiding = false;
  options!: ToastOptions;

  constructor() {
    this.iconMap = {
      success:
        'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTYgMTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjgiIGZpbGw9IiMxNUQxNzMiPjwvY2lyY2xlPjxwYXRoIGQ9Ik00LjU1MTUxIDcuNjAwMUw3LjE4MjEzIDEwLjIzMDZMMTEuOTE2MSA1LjQ5NjY4IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PC9wYXRoPjwvc3ZnPg==',
      error:
        'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTYgMTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjgiIGZpbGw9IiNGRjU3NjUiPjwvY2lyY2xlPjxwYXRoIGQ9Ik04IDEwVjEyIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiPjwvcGF0aD48cGF0aCBkPSJNOCA0VjkiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiI+PC9wYXRoPjwvc3ZnPg==',
      warning:
        'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTYgMTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjgiIGZpbGw9IiMwMDk5RkYiPjwvY2lyY2xlPjxwYXRoIGQ9Ik04IDdWMTIiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiI+PC9wYXRoPjxwYXRoIGQ9Ik04IDRWNiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIj48L3BhdGg+PC9zdmc+Cg==',
      custom: '',
      none: '',
    };

    this.initOptions();
  }

  initOptions() {
    this.options = {
      icon: 'none',
      mask: false,
      duration: 2000,
      maxWidth: 'auto',
      place: 'center',
      offset: '10px',
      layout: 'block',
      animation: 'fade',
    };
  }

  show(options: ToastOptions) {
    // toast 为单例，如果有正在显示的，则先隐藏老的，再显示新的
    if (this.wrap) {
      this.hide(() => {
        this.show(options);
      });
      return;
    }

    const { animation, place } = options;
    if (!animation && place && place !== 'center') {
      const animationMap = {
        top: 'down',
        bottom: 'up',
      };

      options.animation = animationMap[place];
    }

    Object.assign(this.options, options);
    const { title, iconUrl, parent, duration } = this.options;

    if (iconUrl) {
      this.iconMap.custom = iconUrl;
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
    const { animation } = this.options;

    const animationendHandler = () => {
      this.wrap!.removeEventListener('animationend', animationendHandler);
      this.parent.removeChild(this.wrap!);
      this.wrap = null;
      this.isHiding = false;
      this.initOptions();
      callback?.();
    };

    this.wrap.addEventListener('animationend', animationendHandler);

    this.wrap.classList.add(`global-api-toast-${animation}-out`);
  }

  generateHTML() {
    const { place, offset, layout, mask, icon, maxWidth, title, wrapClass } = this.options;
    const { animation } = this.options;

    this.wrap = document.createElement('div');
    this.wrap.classList.add('global-api-toast', `global-api-toast-${animation}-in`);

    if (wrapClass) {
      this.wrap.classList.add(wrapClass);
    }

    // HTML main
    let mainClass = `global-api-toast-main`;
    if (layout === 'inline') {
      mainClass += ` global-api-toast-main--inline`;
    }

    // place
    let placeStyle = 'top: 50%; ';

    console.log('place', place);

    if (place === 'top') {
      placeStyle = `top: ${offset};`;
      mainClass += ` global-api-toast-main--top`;
    }

    if (place === 'bottom') {
      placeStyle = `bottom: ${offset};`;
      mainClass += ` global-api-toast-main--bottom`;
    }

    const maskHTML = mask ? '<div class="global-api-toast-overlay"></div>' : '';
    const mainHTMlBegin = `<div class="${mainClass}" style="max-width: ${maxWidth}; ${placeStyle}">`;
    const iconHTML =
      icon === 'none'
        ? ''
        : `<div class="global-api-toast-icon" style="background-image: url(${this.iconMap[icon!]})"></div>`;
    const titleHTML = title ? `<div class="global-api-toast-title">${title}</div>` : '';
    const mainHTMlEnd = '</div>';

    const innerHTML = maskHTML + mainHTMlBegin + iconHTML + titleHTML + mainHTMlEnd;

    this.wrap.innerHTML = innerHTML;
    this.parent.appendChild(this.wrap);
  }
}

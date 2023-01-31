// import { showToast, hideLoading } from '../dist/esm/index';
import { showToast, hideLoading } from '../src/toast/index';

const demo = document.querySelector('.demo');

demo?.addEventListener('click', (e: Event) => {
  const target = e.target as HTMLElement;
  if (target.className.includes('btn')) {
    const { place, mask, icon, action, safeArea, layout, title, multiLine } = target.dataset;
    const defaultOptions = {
      // duration: 500000,
      onAfterLeave: () => {
        console.log('hello the world');
      },
    };

    if (action === 'close') {
      hideLoading();
      return;
    }

    if (title) {
      Object.assign(defaultOptions, { title });
    }

    if (place) {
      Object.assign(defaultOptions, { place });
    }
    if (mask) {
      Object.assign(defaultOptions, { mask: true });
    }

    if (icon) {
      Object.assign(defaultOptions, { icon });
    }

    if (safeArea) {
      Object.assign(defaultOptions, { safeArea: true });
    }

    if (layout) {
      Object.assign(defaultOptions, { layout });
    }

    if (multiLine) {
      Object.assign(defaultOptions, { multiLine: true, duration: 0 });
    }

    showToast(defaultOptions);
  }
});

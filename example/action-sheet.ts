// import { showActionSheet } from '../dist/esm/index';

import { showActionSheet } from '../src/action-sheet/index';

document.getElementById('btn')?.addEventListener('click', () => {
  showActionSheet({
    // title: 'hello the world',
    items: ['第一项', '第二项'],
    cancel: 'cancel',
    // maskCanClose: false,

    // lastItem: false,
    callback: (key) => {
      console.log('key：', key);
    },
  });
});

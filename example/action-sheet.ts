// import { showActionSheet } from '../dist/esm/index';

import { showActionSheet } from '../src/action-sheet/index';

document.getElementById('btn')?.addEventListener('click', () => {
  showActionSheet({
    title: 'hello the world',
    itemList: [
      {
        text: 'hello 1',
        color: 'red',
      },
      {
        text: 'hello 2',
        color: 'red',
      },
    ],
    // maskCanClose: false,

    // lastItem: false,
  });
});

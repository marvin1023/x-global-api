import { showModal } from '../src/modal/index';

document.getElementById('btn')?.addEventListener('click', () => {
  showModal({
    title: 'hello the world',
    content: 'sdgksdg sdglskdgj lsdglsdgl ',
    footerButtons: [{ text: '我知道了' }],
  });
});

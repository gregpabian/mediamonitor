export const autoscroll = {
  bind(el, binding) {
    if (!binding.value) {
      return;
    }

    let scrolled = false;

    el.addEventListener('scroll', () => {
      scrolled = el.scrollTop + el.clientHeight + 1 < el.scrollHeight;
    });

    const observer = new MutationObserver((records) => {
      if (scrolled) {
        return;
      }

      let doScroll = false;

      records.forEach((record) => {
        if (!doScroll && (record.addedNodes.length || record.removedNodes.length)) {
          doScroll = true;
        }
      });

      if (doScroll) {
        el.scroll({
          top: el.scrollHeight,
          behavior: 'instant',
        });
      }
    });

    observer.observe(el, {
      childList: true,
      subtree: true,
    });
  },
};

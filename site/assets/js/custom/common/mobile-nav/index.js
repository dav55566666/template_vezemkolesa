function toggleClass(target, className) {
  if (target.classList.contains(className)) {
    target.classList.remove(className);
  } else {
    target.classList.add(className);
  }
}

function initMobileNavVisibilitySwitchers() {
  const mobileNavVisibilitySwitcher = document.querySelectorAll('.mobile__nav__visibility__switcher');
  mobileNavVisibilitySwitcher.forEach(switcher => {
    switcher.addEventListener('click', () => {
      const target = document.querySelector('.mobile__nav__container');

      const className = 'mobile__nav__container-active';

      if (target.classList.contains(className)) {
        setTimeout(function() {
          target.classList.remove('mobile__nav__container-on-top');
        }, 400);
      } else {
        target.classList.add('mobile__nav__container-on-top');
      }

      toggleClass(target, className);
    });
  });
}

function initMobileNavHiders() {
  const mobileNavHideTriggerCollection = document.querySelectorAll('.mobile__nav__visibility__hide__trigger');

  mobileNavHideTriggerCollection.forEach(item => {
    const target = document.querySelector('.mobile__nav__container');
    item.addEventListener('click', () => {
      const targetClassName = 'mobile__nav__container-active';
      if (target.classList.contains(targetClassName)) {
        target.classList.remove(targetClassName);
        setTimeout(function() {
          target.classList.remove('mobile__nav__container-on-top');
        }, 400);
      }
    });
  });
}

initMobileNavVisibilitySwitchers();
initMobileNavHiders();

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================
     1. INSERÇÃO DO MENU (DESKTOP + MOBILE)
  ============================================ */

  const menuTemplate = document.getElementById('menu-conteudo');
  const menuDesktop = document.getElementById('navbar-progress');
  const menuMobile = document.getElementById('menu-mobile');

  if (menuTemplate) {
    const menuHTML = menuTemplate.innerHTML;

    if (menuDesktop) menuDesktop.innerHTML = menuHTML;
    if (menuMobile) menuMobile.innerHTML = menuHTML;

    menuTemplate.remove(); // remove template original
  }

  /* ============================================
     2. COLLAPSES DO MENU (APENAS MENU)
     - Não interfere no accordion de conteúdo
  ============================================ */

  document.querySelectorAll(
    '#navbar-progress [data-bs-toggle="collapse"], #menu-mobile [data-bs-toggle="collapse"]'
  ).forEach(button => {

    button.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();

      const targetId = button.getAttribute('data-bs-target');
      const target = document.querySelector(targetId);
      if (!target) return;

      const parentMenu = button.closest('#navbar-progress, #menu-mobile');

      // Fecha outros submenus abertos no mesmo menu
      parentMenu
        ?.querySelectorAll('.collapse.show')
        .forEach(open => {
          if (open !== target) {
            bootstrap.Collapse.getOrCreateInstance(open, { toggle: false }).hide();
          }
        });

      // Toggle normal do submenu clicado
      bootstrap.Collapse.getOrCreateInstance(target).toggle();
    });

  });

  /* ============================================
     3. MENU → ACCORDION (FERRAMENTAS)
     - Sempre abre
     - Scroll acontece após abertura
  ============================================ */

  document.querySelectorAll('[data-target-collapse]').forEach(trigger => {

    trigger.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();

      const targetId = trigger.getAttribute('data-target-collapse');
      const collapse = document.querySelector(targetId);
      if (!collapse) return;

      const instance = bootstrap.Collapse.getOrCreateInstance(collapse, {
        toggle: false
      });

      instance.show();

      collapse.addEventListener('shown.bs.collapse', function handle() {
        const header = collapse.closest('.accordion-item')
          ?.querySelector('.accordion-header');

        if (header) {
          const navbar = document.querySelector('.fixed-top');
          const offset = navbar ? navbar.offsetHeight + 10 : 140;

          window.scrollTo({
            top: header.getBoundingClientRect().top + window.scrollY - offset,
            behavior: 'smooth'
          });
        }

        collapse.removeEventListener('shown.bs.collapse', handle);
      });
    });

  });

  /* ============================================
     4. SCROLL SUAVE PARA ÂNCORAS
  ============================================ */

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    if (
      anchor.hasAttribute('data-bs-toggle') ||
      anchor.hasAttribute('data-target-collapse') ||
      anchor.getAttribute('href') === '#'
    ) return;

    anchor.addEventListener('click', e => {
      const target = document.getElementById(anchor.getAttribute('href').substring(1));
      if (!target) return;

      e.preventDefault();

      const navbar = document.querySelector('.fixed-top');
      const offset = navbar ? navbar.offsetHeight + 10 : 140;

      window.scrollTo({
        top: target.offsetTop - offset,
        behavior: 'smooth'
      });

      // atualiza a URL
history.pushState(null, null, anchor.getAttribute('href'));

      // Fecha offcanvas no mobile
      const offcanvas = document.getElementById('menuOffcanvas');
      if (offcanvas?.classList.contains('show')) {
        bootstrap.Offcanvas.getInstance(offcanvas)?.hide();
      }
    });

  });

});
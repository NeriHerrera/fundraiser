// Año dinámico en el footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Enviar formulario por mailto (sin backend)
const form = document.getElementById('formContacto');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre')?.value?.trim() || '';
    const email = document.getElementById('email')?.value?.trim() || '';
    const empresa = document.getElementById('empresa')?.value?.trim() || '';
    const mensaje = document.getElementById('mensaje')?.value?.trim() || '';

    const subject = encodeURIComponent(`Consulta web — ${empresa || 'sin empresa'}`);
    const body = encodeURIComponent(
      `Nombre: ${nombre}\nEmail: ${email}\nEmpresa: ${empresa}\n\nMensaje:\n${mensaje}`
    );
    window.location.href = `mailto:hola@fundraiser.com.ar?subject=${subject}&body=${body}`;
  });
}

// Cerrar el menú colapsado al hacer clic en un enlace (mejor UX móvil)
const navCollapseEl = document.getElementById('navMain');
if (navCollapseEl) {
  const links = navCollapseEl.querySelectorAll('.nav-link');
  links.forEach((lnk) => {
    lnk.addEventListener('click', () => {
      // requiere bootstrap.bundle (ya incluido en index.html)
      const instance = window.bootstrap?.Collapse?.getInstance?.(navCollapseEl)
        || (window.bootstrap ? new window.bootstrap.Collapse(navCollapseEl, { toggle: false }) : null);
      if (instance && navCollapseEl.classList.contains('show')) instance.hide();
    });
  });
}


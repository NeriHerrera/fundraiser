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

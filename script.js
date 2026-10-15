const sidebar = document.getElementById('sidebar');
const toggleSidebar = document.getElementById('toggleSidebar');
const app = document.getElementById('app');

const loginRoot = document.getElementById('login-root');
const appRoot   = document.getElementById('app-root');

const vistasValidas = [
    'home',
    'add-hospitales', 'add-departamentos', 'add-unidades',
    'add-doctores', 'add-pacientes', 'add-turnos',
    'gen-consulta', 'gen-informe',
    'rep-pacientes', 'rep-doctores', 'rep-informes',
    'rep-hospitales', 'rep-departamentos', 'rep-unidades', 'rep-turnos',
    'res-proceso', 'res-consultas',
    'acerca', 'logout'
];

const USUARIO = 'admin';
const PASSWORD = '1234';

/* ---------- Sesión ---------- */
function haySesion() {
    return localStorage.getItem('sesion') === 'activa';
}

function iniciarSesion() {
    localStorage.setItem('sesion', 'activa');
    loginRoot.hidden = true;
    appRoot.hidden = false;
    cargarVista('home');
}

function cerrarSesion() {
    localStorage.removeItem('sesion');
    appRoot.hidden = true;
    loginRoot.hidden = false;
    loginRoot.innerHTML = '';
    cargarLogin();
}

/* ---------- Login ---------- */
async function cargarLogin() {
    const res = await fetch('views/login.html');
    const texto = await res.text();
    const doc = new DOMParser().parseFromString(texto, 'text/html');
    loginRoot.innerHTML = doc.body.innerHTML;

    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('login-user').value.trim();
        const pass = document.getElementById('login-pass').value;

        if (user === USUARIO && pass === PASSWORD) {
            iniciarSesion();
        } else {
            document.getElementById('loginError').hidden = false;
        }
    });
}

/* ---------- Sidebar ---------- */
toggleSidebar.addEventListener('click', () => {
    if (window.innerWidth > 768) {
        sidebar.classList.toggle('collapsed');
    } else {
        sidebar.classList.toggle('mobile-open');
    }
});

document.querySelectorAll('.menu-item.has-submenu > .menu-link').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const yaAbierto = item.classList.contains('open');

        document.querySelectorAll('.menu-item.has-submenu.open').forEach(otro => {
            if (otro !== item) {
                otro.classList.remove('open');
                otro.querySelector('.menu-link').setAttribute('aria-expanded', 'false');
            }
        });

        item.classList.toggle('open', !yaAbierto);
        btn.setAttribute('aria-expanded', String(!yaAbierto));
    });
});

/* ---------- Cargar vista ---------- */
async function cargarVista(clave) {
    if (!vistasValidas.includes(clave)) {
        app.innerHTML = '<p>Pantalla no encontrada.</p>';
        return;
    }

    if (clave === 'logout') {
        cerrarSesion();
        return;
    }

    try {
        const res = await fetch(`views/${clave}.html`);
        if (!res.ok) throw new Error('Vista no encontrada');
        const texto = await res.text();
        const doc = new DOMParser().parseFromString(texto, 'text/html');
        app.innerHTML = `<section class="screen active">${doc.body.innerHTML}</section>`;
    } catch {
        app.innerHTML = '<p>No se pudo cargar la pantalla.</p>';
    }
}

/* ---------- Navegación ---------- */
document.querySelectorAll('[data-screen]').forEach(enlace => {
    enlace.addEventListener('click', async (e) => {
        e.preventDefault();

        const clave = enlace.dataset.screen;
        await cargarVista(clave);

        document.querySelectorAll('.submenu a, .menu-link').forEach(a => a.classList.remove('active'));
        enlace.classList.add('active');

        if (window.innerWidth <= 768) {
            sidebar.classList.remove('mobile-open');
        }
    });
});

/* ---------- Arranque ---------- */
if (haySesion()) {
    iniciarSesion();
} else {
    cargarLogin();
}
# Portafolio web — Ronald Hernández

Sitio personal publicado en **GitHub Pages** → `https://idkronald.github.io`
Repositorio: `IDKRonald/IDKRonald.github.io`

Es un portafolio **general** para cualquier oportunidad laboral en software o datos.
No debe mencionar ninguna convocatoria específica (como Talento B).

---

## Quién es

- **Nombre:** Ronald Hernández, de Medellín, Antioquia, Colombia.
- **Estudios:** Ingeniería de Sistemas en la Universidad Nacional de Colombia, sede Medellín (desde oct 2024).
- **Formación técnica:** Tecnólogo en Análisis y Desarrollo de Software del SENA (2022–2023).
- **Experiencia:** Transport Coordinator bilingüe en Exclusive Heavy Haul (dic 2023 – jun 2024). Coordinaba operaciones logísticas en inglés.
- **Idiomas:** español nativo, inglés B2.
- **Comunidad:** ponente en el Semillero de Ciencia de Datos e IA (Aperture Systems), con una charla interactiva de SQL con temática de detectives.
- **Enfoque actual:** se está especializando en **ingeniería de datos** (SQL, Python y nube).
- **Lenguajes:** Python, Java, C++, C, JavaScript, SQL (PostgreSQL / MySQL) y Git.

**Contacto**
- GitHub: https://github.com/IDKRonald
- LinkedIn: https://www.linkedin.com/in/ronald-hernandez-g/
- Email: rohernandezg@unal.edu.co

---

## Proyectos

### PeñolinniPOS · en producción
Punto de venta fullstack para la pizzería **Don Peñolinni** en Guarne, Antioquia. Reemplazó las comandas en papel, que se perdían o se dañaban, por comandas y facturas digitales sincronizadas en tiempo real entre caja y cocina.
**Impacto:** aumentó la eficiencia de la operación en un ~20 %.

- **Frontend:** React 19, Vite, Tailwind CSS 4, React Router 7, react-qr-code, socket.io-client, ESLint.
- **Backend:** Node.js (ES modules), Express 5, Socket.IO, CORS, SQLite con better-sqlite3.
- **Arquitectura:** frontend (Vite) y backend (Express + WebSockets) separados.

### PortónApp · en implementación
Plataforma para la gestión de unidades residenciales.

- **Backend:** Node.js (ES modules) y Express 5, con una API REST organizada en `routes/`, `services/` y `middleware/`. Base de datos MySQL con mysql2.
- **Autenticación:** JWT con refresh tokens, bcryptjs para las contraseñas y cookie-parser.
- **Seguridad:** helmet, cors y express-rate-limit.
- **Otros:** subida de avatares con multer, logs con morgan, un middleware de auditoría propio, dotenv, y scripts de inicialización, reset y migración de la base de datos.
- **Frontend:** sin framework. HTML estático, CSS modular por página, JavaScript con `fetch`, la fuente Inter e íconos Material Symbols.

### Proyecto de datos · próximamente
Será su primer proyecto de datos de punta a punta. Deja una sección o tarjeta lista para agregarlo cuando esté hecho.

### Charla "SQL Detective"
Taller interactivo para el semillero. Los asistentes resuelven un caso escribiendo consultas SQL: JOINs para cruzar coartadas, GROUP BY para encontrar patrones y subconsultas para dar con el culpable.

---

## Diseño (mantenerlo igual al README de GitHub)

- **Estilo:** minimalista, con estética de terminal y desarrollador.
- **Colores:**
  - Fondo `#0D1117`
  - Superficies y bordes `#161B22` / `#30363D`
  - Texto principal `#F0F6FC`, texto secundario `#8B949E`
  - **Acento verde `#22C55E`**. Es un verde normal, no neón, y es el único color de acento.
- **Tipografía:** monoespaciada para títulos y detalles (JetBrains Mono o Fira Code); Inter para el texto corrido.
- **Títulos de sección como comandos:** `$ whoami`, `$ ls ./proyectos`, `$ stack`, `$ contact`.
- **Hero:** un grafo animado de nodos y aristas, con puntos verdes que viajan por las aristas como datos por un pipeline, y un cursor que parpadea. La referencia visual está en `assets/banner-es.svg` y `assets/banner-en.svg`. En la web, conviene que sea un canvas o un SVG a pantalla completa, con una animación sutil.
- **Emojis:** ninguno, salvo 🍕 en PeñolinniPOS y 🏢 en PortónApp.
- **Movimiento:** discreto. Respetar `prefers-reduced-motion`.

## Requisitos

- **Bilingüe español / inglés**, con un selector de idioma visible. El español va por defecto.
- Responsive, pensado primero para móvil.
- Que cargue rápido y sin dependencias pesadas.
- **Secciones:** Hero → Sobre mí → Proyectos → Stack → Experiencia y comunidad → Contacto.
- Enlace a la hoja de vida en PDF (`/cv.pdf`) si se agrega al repo.
- SEO básico y meta tags Open Graph para que se vea bien al compartirlo en LinkedIn.

## Stack técnico del sitio

- **Opción por defecto (rápida y sin build):** HTML, CSS y JavaScript vanilla. GitHub Pages lo sirve directamente desde `main`.
- **Si después se migra a React + Vite:** configurar `base: '/'` y desplegar con GitHub Actions (`actions/deploy-pages`).

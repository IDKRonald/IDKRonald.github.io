/*
 * Traducciones del sitio.
 *
 * - El español es el idioma por defecto y está escrito directamente en
 *   index.html (es lo que leen los buscadores y quien navega sin JavaScript).
 *   main.js lo guarda al cargar para poder volver a él.
 * - `en` tiene el inglés de cada clave `data-i18n` / `data-i18n-attr` del HTML.
 * - `es` solo incluye los textos que genera JavaScript y no están en el HTML.
 *
 * Para cambiar un texto: edita el español en index.html y el inglés aquí.
 */
window.I18N = {
  es: {
    'menu.open': 'Abrir menú',
    'menu.close': 'Cerrar menú',
    'contact.copied': '¡copiado!',
  },

  en: {
    'meta.title': 'Ronald Hernández · Software developer & data engineering',
    'meta.description': 'Portfolio of Ronald Hernández: Systems Engineering student at UNAL (Medellín) and software developer, specializing in data engineering with SQL, Python and the cloud.',

    'skip': 'Skip to content',
    'logo.label': 'Ronald Hernández, go to top',
    'nav.label': 'Main navigation',
    'nav.about': 'about',
    'nav.projects': 'projects',
    'nav.experience': 'experience',
    'nav.contact': 'contact',
    'menu.open': 'Open menu',
    'menu.close': 'Close menu',

    'hero.status': 'open to opportunities',
    'hero.role': '&gt; software developer · data engineering',
    'hero.lead': 'I study Systems Engineering at Universidad Nacional de Colombia and build software that’s used in the real world. I’m currently specializing in data engineering: SQL, Python and the cloud.',
    'hero.projects': 'view projects',
    'hero.contact': 'contact',
    'hero.cv': 'résumé (PDF)',

    'about.title': 'About me',
    'about.sub': '# about me',
    'about.p1': 'I’m <strong>Ronald Hernández</strong>, from Medellín, Colombia. I study <strong>Systems Engineering</strong> at Universidad Nacional de Colombia, Medellín campus, and I hold a <strong>technologist degree in Software Analysis and Development</strong> from SENA.',
    'about.p2': 'I like building software that solves concrete problems. My point-of-sale system, <strong>PeñolinniPOS</strong>, runs today at a pizzeria: it replaced paper order tickets and increased operational efficiency by about 20%.',
    'about.p3': 'I’m now specializing in <strong>data engineering</strong>, focusing on SQL, Python and the cloud. I also worked as a bilingual transport coordinator, so I’m used to working and communicating in English.',
    'about.file': 'profile.yml',
    'about.k.name': 'name',
    'about.k.location': 'location',
    'about.k.university': 'university',
    'about.v.university': 'Systems Engineering · UNAL (2024 – present)',
    'about.k.sena': 'diploma',
    'about.v.sena': 'Software Analysis and Development · SENA (2022 – 2023)',
    'about.k.languages': 'languages',
    'about.v.languages': 'Spanish (native) · English (B2)',
    'about.k.focus': 'focus',
    'about.v.focus': 'data engineering',

    'projects.dir': './projects',
    'projects.title': 'Projects',
    'projects.sub': '# projects',
    'status.live': 'in production',
    'status.wip': 'rolling out',
    'status.soon': 'coming soon',

    'pos.desc': 'Fullstack point-of-sale system for <strong>Don Peñolinni</strong>, a pizzeria in Guarne, Antioquia. It replaced paper order tickets, which got lost or damaged, with digital orders and invoices synced in real time between the counter and the kitchen.',
    'pos.impact': '<strong>~20%</strong> <span>more operational efficiency</span>',
    'pos.flow': 'Counter and kitchen synced in real time with Socket.IO',
    'pos.flow.from': 'counter',
    'pos.flow.to': 'kitchen',
    'pos.f1': 'Real-time orders and invoices over <strong>WebSockets</strong> (Socket.IO).',
    'pos.f2': 'Decoupled frontend (Vite) and backend (Express + WebSockets).',
    'pos.f3': 'Persistence in <strong>SQLite</strong> with better-sqlite3.',

    'porton.desc': 'Web platform for managing residential complexes, with its own REST API and a lightweight, framework-free frontend.',
    'porton.f1': 'REST API with <strong>Express 5</strong> organized into <code>routes/</code>, <code>services/</code> and <code>middleware/</code>, backed by <strong>MySQL</strong> (mysql2).',
    'porton.f2': 'Authentication with <strong>JWT and refresh tokens</strong>, password hashing with bcryptjs and cookie handling with cookie-parser.',
    'porton.f3': 'Security with helmet, cors and express-rate-limit.',
    'porton.f4': 'Avatar uploads with multer, logging with morgan and a custom <strong>audit middleware</strong>.',
    'porton.f5': 'Scripts to initialize, reset and migrate the database.',
    'porton.f6': 'Framework-free frontend: static HTML, per-page modular CSS and JavaScript with <code>fetch</code>.',

    'status.research': 'research · SENA',
    'park.desc': 'Web platform to <strong>automate and manage parking lots</strong> in Guarne, Antioquia, built with Scrum in SENA’s Teleinformatics research group.',
    'park.f1': '<strong>AI license plate capture</strong> and automatic space assignment.',
    'park.f2': '<strong>Machine learning</strong> models (decision trees with scikit-learn and intelligent agents with TensorFlow) to predict space availability, with <strong>over 85% accuracy</strong>.',
    'park.f3': 'Modules for spaces, customers, employees, vehicles, payments and rates. Entry and exit logging, and username and password access.',
    'park.event': 'Presented at the <strong>26th National and 20th International Meeting of Research Groups (RedCOLSI)</strong>, Universidad de Cartagena, October 2023.',
    'park.paper': 'Published in <em>Revista Encuentro SENNOVA del Oriente Antioqueño</em>, 10(1), 5–18 (2024), under the title <em>Plataforma WEB para la automatización y control integral de parqueaderos Arparking</em>.',
    'park.link': '→ read the paper',

    'data.name': 'Data project',
    'data.desc': 'My first end-to-end data project, built with SQL, Python and cloud services. It’s on its way: you’ll find it here very soon.',
    'data.cloud': 'cloud',

    'stack.title': 'Tech stack',
    'stack.sub': '# technologies I work with',
    'stack.languages': 'languages',
    'stack.databases': 'databases',
    'stack.tools': 'tools',
    'stack.focus': 'focus',
    'stack.focus.de': 'data engineering',
    'stack.focus.cloud': 'cloud',

    'exp.title': 'Experience and community',
    'exp.sub': '# experience & community',
    'exp.work.kind': 'work',
    'exp.work.date': 'Dec 2023 – Jun 2024',
    'exp.work.role': 'Bilingual Transport Coordinator',
    'exp.work.desc': 'Coordinated logistics operations in English, in a bilingual work environment. It gave me fluency in professional communication in a second language.',
    'exp.talk.kind': 'community',
    'exp.talk.role': 'Speaker · “SQL Detective” talk',
    'exp.talk.org': 'Data Science & AI student research group · Aperture Systems',
    'exp.talk.desc': 'Interactive workshop where attendees solve a case by writing SQL queries: <strong>JOINs</strong> to cross-check alibis, <strong>GROUP BY</strong> to spot patterns and <strong>subqueries</strong> to find the culprit.',
    'exp.talk.file': 'case.sql',
    'exp.talk.code': [
      '<span class="tok-c">-- who has no alibi?</span>',
      '<span class="tok-k">SELECT</span> s.name',
      '<span class="tok-k">FROM</span> suspects s',
      '<span class="tok-k">LEFT JOIN</span> alibis a',
      '  <span class="tok-k">ON</span> a.suspect_id = s.id',
      '<span class="tok-k">WHERE</span> a.id <span class="tok-k">IS NULL</span>;',
    ].join('\n'),

    'contact.title': 'Contact',
    'contact.sub': '# contact',
    'contact.lead': 'Have an opportunity in software development or data, or want to talk about a project? Write to me: I reply in Spanish or English.',
    'contact.copy': 'copy',
    'contact.copied': 'copied!',
    'contact.cv': 'résumé (PDF)',

    'footer.note': 'handcrafted with HTML, CSS and JavaScript',
    'footer.top': 'back to top ↑',
  },
};

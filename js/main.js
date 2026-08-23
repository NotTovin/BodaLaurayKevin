// =========================================================
// Invitación de Boda - Laura & Kevin
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  const welcomeScreen = document.getElementById('welcome-screen');
  const siteContent = document.getElementById('site-content');
  const enterBtn = document.getElementById('enter-btn');
  const music = document.getElementById('bg-music');

  function enterSite() {
    music.volume = 0.5;
    music.play().catch(() => {
      // Autoplay bloqueado por el navegador; el usuario puede activarla desde el reproductor.
    });
    welcomeScreen.classList.add('fade-out');
    siteContent.classList.remove('hidden');
    setTimeout(() => welcomeScreen.remove(), 900);
  }

  enterBtn.addEventListener('click', enterSite);

  // ===== Reproductor "Nuestra canción" (controles superpuestos sobre la imagen) =====
  const playerPlayBtn = document.getElementById('player-play');
  const playerPrevBtn = document.getElementById('player-prev');
  const playerNextBtn = document.getElementById('player-next');
  const playerProgress = document.getElementById('player-progress');
  const playerDot = document.getElementById('player-dot');

  playerPlayBtn.addEventListener('click', () => {
    if (music.paused) {
      music.play().catch(() => {});
    } else {
      music.pause();
    }
  });
  playerPrevBtn.addEventListener('click', () => { music.currentTime = 0; });
  playerNextBtn.addEventListener('click', () => {
    music.currentTime = Math.min(music.currentTime + 10, music.duration || music.currentTime + 10);
  });
  playerProgress.addEventListener('click', (e) => {
    if (!music.duration) return;
    const rect = playerProgress.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    music.currentTime = ratio * music.duration;
  });
  music.addEventListener('timeupdate', () => {
    if (music.duration) {
      playerDot.style.left = `${(music.currentTime / music.duration) * 100}%`;
    }
  });

  // ===== Agregar al calendario (Google Calendar / Apple Calendar / etc.) =====
  const addToCalendarBtn = document.getElementById('add-to-calendar');

  const EVENT_TITLE = 'Boda de Laura & Kevin';
  const EVENT_LOCATION = 'Iglesia San Pedro Apóstol, Santa Bárbara de Heredia';
  const EVENT_DESCRIPTION = '¡Nos casamos! Ceremonia 3:00 PM, recepción a continuación en Sala de Eventos Santa Mónica, Rosales de Alajuela.';
  // Horario del evento en UTC (Costa Rica es UTC-6), usado para el link de Google Calendar.
  const EVENT_START_UTC = '20261018T210000Z';
  const EVENT_END_UTC = '20261019T050000Z';

  function getDevicePlatform() {
    const ua = navigator.userAgent || navigator.vendor || window.opera || '';
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    const isMac = /Macintosh/.test(ua) && navigator.maxTouchPoints <= 1;
    if (isIOS || isMac) return 'apple';
    if (/android/i.test(ua)) return 'android';
    return 'other';
  }

  function buildGoogleCalendarUrl() {
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: EVENT_TITLE,
      dates: `${EVENT_START_UTC}/${EVENT_END_UTC}`,
      details: EVENT_DESCRIPTION,
      location: EVENT_LOCATION,
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  addToCalendarBtn.addEventListener('click', () => {
    const platform = getDevicePlatform();

    if (platform === 'apple') {
      // Navegar a un .ics real alojado en el sitio (en vez de un data: URI)
      // es lo que hace que iOS Safari abra Apple Calendar de forma confiable.
      window.location.href = '/assets/wedding-event.ics';
    } else {
      // Android, Windows y el resto: directo a Google Calendar con el evento prellenado.
      window.open(buildGoogleCalendarUrl(), '_blank', 'noopener');
    }
  });

  // ===== Cuenta regresiva =====
  const weddingDate = new Date('2026-10-18T15:00:00');
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');

  function updateCountdown() {
    const diff = weddingDate.getTime() - Date.now();
    if (diff <= 0) {
      cdDays.textContent = cdHours.textContent = cdMinutes.textContent = cdSeconds.textContent = '00';
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    cdDays.textContent = String(days).padStart(2, '0');
    cdHours.textContent = String(hours).padStart(2, '0');
    cdMinutes.textContent = String(minutes).padStart(2, '0');
    cdSeconds.textContent = String(seconds).padStart(2, '0');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ===== Lista de invitados y cupos reservados =====
  // Edita esta lista con los nombres reales y los cupos (personas) que le corresponden
  // a cada invitación. "alias" es opcional, para que también se encuentre por apodos.
  const GUEST_LIST = [
    { nombre: 'Carmen Rivera', cupos: 1, alias: ['Rivera Carmen'] },
    { nombre: 'Sarah Alfaro', cupos: 1, alias: ['Alfaro Sarah'] },
    { nombre: 'Gravin Alfaro', cupos: 2, alias: ['Alfaro Gravin'] },
    { nombre: 'Elena Rivera', cupos: 5, alias: ['Rivera Elena'] },
    { nombre: 'Maria Cascante', cupos: 1, alias: ['Cascante Maria'] },
    { nombre: 'Carlos Salazar', cupos: 1, alias: ['Salazar Carlos'] },
    { nombre: 'Ana Cascante', cupos: 1, alias: ['Cascante Ana'] },
    { nombre: 'Emmanuel Rivera', cupos: 1, alias: ['Rivera Emmanuel'] },
    { nombre: 'Luis Rivera', cupos: 1, alias: ['Rivera Luis'] },
    { nombre: 'Manuel Rivera', cupos: 1, alias: ['Rivera Manuel'] },
    { nombre: 'Hazel Rivera', cupos: 2, alias: ['Rivera Hazel'] },
    { nombre: 'Marta Cascante', cupos: 1, alias: ['Cascante Marta'] },
    { nombre: 'Kattia Vargas', cupos: 1, alias: ['Vargas Kattia', 'Katia Vargas'] },
    { nombre: 'Raudyn Alfaro', cupos: 2, alias: ['Alfaro Raudyn'] },
    { nombre: 'Gerardo Herrera', cupos: 2, alias: ['Herrera Gerardo'] },
    { nombre: 'Esteban Herrera', cupos: 2, alias: ['Herrera Esteban'] },
    { nombre: 'Brenda Herrera', cupos: 1, alias: ['Herrera Brenda'] },
    { nombre: 'Donnovan Vasques', cupos: 1, alias: ['Vasques Donnovan', 'Donovan Vasques'] },
    { nombre: 'Amber Vasques', cupos: 1, alias: ['Vasques Amber'] },
    { nombre: 'Victoria Flores', cupos: 2, alias: ['Flores Victoria'] },
    { nombre: 'Franklin Tinoco', cupos: 2, alias: ['Tinoco Franklin'] },
    { nombre: 'Shirley Saborio', cupos: 4, alias: ['Saborio Shirley'] },
    { nombre: 'Evelyn Saborio', cupos: 2, alias: ['Saborio Evelyn'] },
    { nombre: 'Jostein Solano', cupos: 2, alias: ['Solano Jostein'] },
    { nombre: 'Diego Fonseca', cupos: 2, alias: ['Fonseca Diego'] },
    { nombre: 'Efrain Rojas', cupos: 1, alias: ['Rojas Efrain'] },
    { nombre: 'Nicole Barquero', cupos: 2, alias: ['Barquero Nicole'] },
    { nombre: 'Eladio Madrigal', cupos: 2, alias: ['Madrigal Eladio'] },
    { nombre: 'Jessika Ortega', cupos: 2, alias: ['Ortega Jessika', 'Jessica Ortega'] },
    { nombre: 'Natalia Sequeira', cupos: 2, alias: ['Sequeira Natalia'] },
    { nombre: 'Fernanda Vargas', cupos: 1, alias: ['Vargas Fernanda'] },
    { nombre: 'Alexandro Alfaro', cupos: 1, alias: ['Alfaro Alexandro', 'Alejandro Alfaro'] },
    { nombre: 'Lorena Carballo', cupos: 1, alias: ['Carballo Lorena'] },
    { nombre: 'Katherine Mena', cupos: 1, alias: ['Mena Katherine', 'Kathy Mena'] },
    { nombre: 'Franciny Mena', cupos: 2, alias: ['Mena Franciny'] },
    { nombre: 'Maria Ramos', cupos: 2, alias: ['Ramos Maria'] },
    { nombre: 'Julissa Ramos', cupos: 2, alias: ['Ramos Julissa', 'Julisa Ramos'] },
    { nombre: 'Mayela Vargas', cupos: 2, alias: ['Vargas Mayela'] },
    { nombre: 'Marta Alfaro', cupos: 1, alias: ['Alfaro Marta'] },
    { nombre: 'Dennis Saborio', cupos: 2, alias: ['Saborio Dennis', 'Denis Saborio'] },
    { nombre: 'Josue Araya', cupos: 1, alias: ['Araya Josue'] },
    { nombre: 'Mary Marchena', cupos: 1, alias: ['Tita'] },
    { nombre: 'Jose Gonzalez', cupos: 1, alias: ['Gonzalez Jose'] },
  ];

  function normalize(text) {
    return text
      .toString()
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function findGuest(query) {
    const q = normalize(query);
    if (!q) return null;
    return GUEST_LIST.find((guest) => {
      const names = [guest.nombre, ...(guest.alias || [])];
      return names.some((n) => normalize(n) === q || normalize(n).includes(q) || q.includes(normalize(n)));
    }) || null;
  }

  // ===== Modal de confirmación de asistencia =====
  const modal = document.getElementById('rsvp-modal');
  const openModalBtn = document.getElementById('open-rsvp-modal');
  const modalCloseBtn = document.getElementById('modal-close');

  const stepSearch = document.getElementById('modal-step-search');
  const stepForm = document.getElementById('modal-step-form');
  const searchInput = document.getElementById('guest-search-input');
  const searchBtn = document.getElementById('guest-search-btn');
  const searchStatus = document.getElementById('guest-search-status');

  const guestGreeting = document.getElementById('guest-greeting');
  const guestLugaresImg = document.getElementById('guest-lugares-img');
  const asistenciaSelect = document.getElementById('asistencia');
  const cuposGroup = document.getElementById('cupos-group');
  const cuposSelect = document.getElementById('cupos-asisten');
  const nombresGroup = document.getElementById('nombres-group');
  const invitadoNombreInput = document.getElementById('invitado-nombre');
  const invitadoCuposInput = document.getElementById('invitado-cupos');

  function resetModal() {
    stepForm.classList.add('hidden');
    stepSearch.classList.remove('hidden');
    searchInput.value = '';
    searchStatus.textContent = '';
    searchStatus.className = 'rsvp-status';
    rsvpForm.reset();
  }

  function openModal() {
    modal.classList.remove('hidden');
  }

  function closeModal() {
    modal.classList.add('hidden');
    resetModal();
  }

  openModalBtn.addEventListener('click', openModal);
  modalCloseBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  function showGuestForm(guest) {
    guestGreeting.textContent = `¡Hola, ${guest.nombre}!`;
    const cuposClamped = Math.min(5, Math.max(1, guest.cupos));
    guestLugaresImg.src = `assets/Pngs/lugares ${cuposClamped}.png`;

    cuposSelect.innerHTML = '';
    for (let i = 0; i <= guest.cupos; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = i === 1 ? '1 persona' : `${i} personas`;
      cuposSelect.appendChild(option);
    }
    cuposSelect.value = guest.cupos;

    invitadoNombreInput.value = guest.nombre;
    invitadoCuposInput.value = guest.cupos;

    stepSearch.classList.add('hidden');
    stepForm.classList.remove('hidden');
  }

  function handleSearch() {
    const guest = findGuest(searchInput.value);
    if (!guest) {
      searchStatus.textContent = 'No encontramos tu invitación. Verifica cómo escribiste tu nombre o contáctanos directamente.';
      searchStatus.className = 'rsvp-status error';
      return;
    }
    searchStatus.textContent = '';
    showGuestForm(guest);
  }

  searchBtn.addEventListener('click', handleSearch);
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  });

  asistenciaSelect.addEventListener('change', () => {
    const noAsiste = asistenciaSelect.value === 'No podremos asistir';
    cuposGroup.classList.toggle('hidden', noAsiste);
    nombresGroup.classList.toggle('hidden', noAsiste);
  });

  // ===== RSVP Form =====
  // Para recibir las confirmaciones por correo, crea una cuenta gratis en
  // https://formspree.io, obtén tu endpoint y reemplaza la URL de abajo.
  const RSVP_ENDPOINT = 'https://formspree.io/f/xppangrg';

  const rsvpForm = document.getElementById('rsvp-form');
  const rsvpStatus = document.getElementById('rsvp-status');

  rsvpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    rsvpStatus.textContent = 'Enviando...';

    const formData = new FormData(rsvpForm);

    if (RSVP_ENDPOINT.includes('TU_ID_AQUI')) {
      rsvpStatus.textContent = 'Configura tu formulario de RSVP (ver README) para recibir esta confirmación.';
      return;
    }

    try {
      const response = await fetch(RSVP_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });
      if (response.ok) {
        rsvpStatus.textContent = '¡Gracias por confirmar tu asistencia!';
        rsvpForm.reset();
        setTimeout(closeModal, 2500);
      } else {
        rsvpStatus.textContent = 'Ocurrió un error, intenta de nuevo.';
      }
    } catch (err) {
      rsvpStatus.textContent = 'Ocurrió un error, intenta de nuevo.';
    }
  });
});
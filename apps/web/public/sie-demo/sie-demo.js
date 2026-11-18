(() => {
  const students = [
    { code: 'DEMO-0001', ci: '8472910', paternal: 'Pérez', maternal: 'López', first: 'Ana', birth: '14/03/2018' },
    { code: 'DEMO-0002', ci: '8591024', paternal: 'Rojas', maternal: 'Vargas', first: 'Luis', birth: '22/07/2018' },
    { code: 'DEMO-0003', ci: '8614309', paternal: 'Mamani', maternal: 'Quispe', first: 'María', birth: '09/11/2018' },
  ];

  const subjects = [
    'COMUNICACIÓN Y LENGUAJES (CASTELLANA, ORIGINARIA Y LENGUA EXTRANJERA)',
    'CIENCIAS SOCIALES',
    'EDUCACIÓN FÍSICA Y DEPORTES',
    'EDUCACIÓN MUSICAL',
    'ARTES PLÁSTICAS Y VISUALES',
    'MATEMÁTICAS',
    'TÉCNICA TECNOLÓGICA',
    'CIENCIAS NATURALES',
    'VALORES, ESPIRITUALIDAD Y RELIGIONES',
  ];
  const subjectCodes = ['COM-LEN', 'SOC-SEC', 'EDU-FIS', 'EDU-MUS', 'ART-VIS', 'MAT-SEC', 'TEC-TEC', 'CIEN-NAT', 'VAL-REL'];
  const screens = ['home', 'received', 'regular', 'module', 'students'];
  const titles = {
    home: ['Principal', '', 'Inicio', 'Principal'],
    received: ['Recibidos', 'Solicitudes usuario', 'Recibidos', 'Menú'],
    regular: ['U.E. Regular', 'Módulos disponibles', 'Recibidos', 'U.E. Regular'],
    module: ['Estudiante', 'Seleccione módulo', 'Estudiante', 'U.E. Regular'],
    students: ['Estudiantes', 'Lista de inscritos y calificaciones', 'U.E. Regular', 'Estudiantes'],
  };

  const gradesByStudent = {
    'DEMO-0001:0': 82, 'DEMO-0001:1': 78, 'DEMO-0001:2': 90, 'DEMO-0001:3': 86, 'DEMO-0001:4': 88, 'DEMO-0001:6': 91, 'DEMO-0001:7': 84, 'DEMO-0001:8': 89,
    'DEMO-0002:0': 76, 'DEMO-0002:1': 74, 'DEMO-0002:2': 82, 'DEMO-0002:3': 79, 'DEMO-0002:4': 88, 'DEMO-0002:6': 73, 'DEMO-0002:7': 84, 'DEMO-0002:8': 77,
    'DEMO-0003:0': 92, 'DEMO-0003:1': 87, 'DEMO-0003:2': 89, 'DEMO-0003:3': 91, 'DEMO-0003:4': 94, 'DEMO-0003:6': 82, 'DEMO-0003:7': 88, 'DEMO-0003:8': 90,
  };

  const syncStatusByStudent = {
    'DEMO-0001': 'pending',
    'DEMO-0002': 'pending',
    'DEMO-0003': 'pending',
  };

  const syncStatusLabels = {
    verified: 'Verificada',
    discrepancy: 'Diferencia',
    missing: 'Sin nota',
    pending: 'Pendiente',
  };

  let currentStudent = null;
  let currentGrade = 'Segundo';
  let currentSection = 'B';
  let currentLevel = 'Primaria Comunitaria Vocacional';
  let currentTurn = 'Mañana';
  let toastTimer;

  const loginView = document.getElementById('login-view');
  const portal = document.getElementById('portal');
  const gradeBackdrop = document.getElementById('grade-backdrop');
  const localTestLabel = document.querySelector('.local-test-label');

  document.querySelectorAll('[data-login-info]').forEach((button) => {
    button.addEventListener('click', () => {
      const warning = document.getElementById('login-warning');
      if (warning) warning.textContent = button.dataset.loginInfo + ' no está conectada en esta réplica de demostración.';
    });
  });

  function navigate(screen) {
    if (!screens.includes(screen)) return;
    for (const name of screens) {
      document.getElementById(name + '-screen')?.classList.toggle('hidden', name !== screen);
    }
    const [title, subtitle, crumbOne, crumbTwo] = titles[screen];
    document.getElementById('page-title').textContent = title;
    document.getElementById('page-subtitle').textContent = subtitle;
    document.getElementById('crumb-one').textContent = crumbOne;
    document.getElementById('crumb-two').textContent = crumbTwo;
    document.querySelectorAll('.nav-link').forEach((link) => link.classList.remove('active'));
    if (screen === 'students' || screen === 'module') {
      document.getElementById('student-nav')?.classList.add('active');
    }
  }

  document.getElementById('login-form').addEventListener('submit', (event) => {
    event.preventDefault();
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    loginView.classList.add('hidden');
    portal.classList.remove('hidden');
    localTestLabel?.classList.add('hidden');
    navigate('students');
    showToast('Sesión iniciada · Lista de inscritos lista para el asistente SIGCE.');
  });

  document.getElementById('logout').addEventListener('click', () => {
    portal.classList.add('hidden');
    loginView.classList.remove('hidden');
    localTestLabel?.classList.remove('hidden');
  });

  document.getElementById('collapse-sidebar').addEventListener('click', () => {
    document.body.classList.toggle('collapsed');
  });

  document.getElementById('student-nav').addEventListener('click', () => {
    const submenu = document.getElementById('student-submenu');
    const open = submenu.classList.toggle('open');
    document.getElementById('student-nav').setAttribute('aria-expanded', String(open));
  });

  document.querySelectorAll('[data-screen]').forEach((button) => {
    button.addEventListener('click', () => navigate(button.dataset.screen));
  });

  document.getElementById('options-toggle').addEventListener('click', () => {
    document.getElementById('options-menu').classList.toggle('open');
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('#options-toggle') && !event.target.closest('#options-menu')) {
      document.getElementById('options-menu').classList.remove('open');
    }
    const actionButton = event.target.closest('[data-action]');
    if (actionButton) performAction(actionButton.dataset.action, actionButton.dataset.studentIndex);
    const levelButton = event.target.closest('[data-level]');
    if (levelButton) {
      currentLevel = levelButton.dataset.level;
      document.querySelectorAll('[data-level]').forEach((node) => node.classList.toggle('selected', node === levelButton));
      document.getElementById('level-label').textContent = currentLevel;
      showToast('Nivel seleccionado: ' + currentLevel);
    }
    const gradeButton = event.target.closest('[data-grade]');
    if (gradeButton) {
      currentGrade = gradeButton.dataset.grade;
      document.querySelectorAll('[data-grade]').forEach((node) => node.classList.toggle('selected', node === gradeButton));
      gradeButton.parentElement.appendChild(document.getElementById('section-options'));
      document.getElementById('section-options').classList.add('open');
      updateCourseLabel();
      showToast('Curso seleccionado: ' + currentGrade);
    }
    const sectionButton = event.target.closest('[data-section]');
    if (sectionButton) {
      currentSection = sectionButton.dataset.section;
      document.querySelectorAll('[data-section]').forEach((node) => node.classList.toggle('selected', node === sectionButton));
      updateCourseLabel();
    }
    const turnButton = event.target.closest('[data-turn]');
    if (turnButton) {
      currentTurn = turnButton.dataset.turn;
      showToast('Turno seleccionado: ' + currentTurn);
    }
  });

  function updateCourseLabel() {
    document.getElementById('course-label').textContent = '▤   ' + currentGrade + ' - ' + currentSection;
    document.getElementById('modal-grade').textContent = currentGrade.toUpperCase();
    document.getElementById('modal-section').textContent = currentSection;
    document.getElementById('modal-level').textContent = currentLevel.toUpperCase();
    document.getElementById('modal-turn').textContent = currentTurn.toUpperCase();
  }

  function renderStudents() {
    document.getElementById('student-rows').innerHTML = students
      .map((student, index) => {
        const syncStatus = syncStatusByStudent[student.code] || 'pending';
        const isVerified = syncStatus === 'verified';
        const grade = gradesByStudent[student.code + ':5'];
        return (
          '<tr>' +
          '<td>' + (index + 1) + '</td>' +
          '<td>' + student.code + '</td>' +
          '<td>' + student.ci + '</td>' +
          '<td>' + student.paternal.toUpperCase() + '</td>' +
          '<td>' + student.maternal.toUpperCase() + '</td>' +
          '<td>' + student.first.toUpperCase() + '</td>' +
          '<td>' + student.birth + '</td>' +
          '<td><span class="status-label">EFECTIVO</span></td>' +
          '<td><span class="segip-label">✓ Válido SEGIP</span></td>' +
          '<td class="grade-value">' + (grade == null || grade === '' ? '—' : grade) + '</td>' +
          '<td><span class="sync-cell sync-' + syncStatus + '"><span class="sync-check" role="checkbox" aria-checked="' + (isVerified ? 'true' : 'false') + '" aria-disabled="true" aria-label="' + (isVerified ? 'Sincronización verificada' : 'Sincronización no verificada') + '"></span><span class="sync-label">' + syncStatusLabels[syncStatus] + '</span></span></td>' +
          '<td><div class="row-actions">' +
          '<button class="row-action" type="button" data-action="list" title="Información del estudiante" aria-label="Información del estudiante">▣</button>' +
          '<button class="row-action grade" type="button" data-action="grade" data-student-index="' + index + '" title="Registrar calificaciones" aria-label="Registrar calificaciones">☷</button>' +
          '</div></td>' +
          '</tr>'
        );
      })
      .join('');
  }

  function renderSections() {
    document.getElementById('section-options').innerHTML = ['A', 'B']
      .map(
        (section) =>
          '<div class="section-row">' +
          '<button class="section-btn' + (section === currentSection ? ' selected' : '') + '" type="button" data-section="' + section + '">' + section + '</button>' +
          '<button class="tree-action" type="button" data-action="list" title="Lista de inscritos" aria-label="Lista de inscritos">♧</button>' +
          '<button class="tree-action" type="button" data-action="grades" title="Registrar calificaciones" aria-label="Registrar calificaciones">☷</button>' +
          '<button class="tree-action blue" type="button" data-action="list" title="Información del curso" aria-label="Información del curso">⌂</button>' +
          '<button class="tree-action" type="button" data-action="export" title="Reporte" aria-label="Reporte">▣</button>' +
          '</div>',
      )
      .join('');
  }

  function performAction(action, index) {
    if (action === 'grade') {
      openGradeModal(Number(index));
    } else if (action === 'grades') {
      openGradeModal(0);
    } else if (action === 'list') {
      showToast('Lista de inscritos · ' + currentGrade + ' - ' + currentSection);
    } else if (action === 'export') {
      const csv = [
        'N°,Código Rude,C.I.,Paterno,Materno,Nombre(s),Fecha nac.,Estado',
        ...students.map((s, i) => [i + 1, s.code, s.ci, s.paternal, s.maternal, s.first, s.birth, 'EFECTIVO'].join(',')),
      ].join('\n');
      const link = document.createElement('a');
      link.href = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }));
      link.download = 'lista-inscritos-demostracion.csv';
      link.click();
      URL.revokeObjectURL(link.href);
      showToast('Se descargó el listado de demostración.');
    }
  }

  function openGradeModal(index) {
    currentStudent = students[index];
    if (!currentStudent) return;
    document.getElementById('modal-code').textContent = currentStudent.code;
    document.getElementById('modal-student').textContent =
      currentStudent.first.toUpperCase() + ' ' + currentStudent.paternal.toUpperCase() + ' ' + currentStudent.maternal.toUpperCase();
    updateCourseLabel();
    document.getElementById('marks-rows').innerHTML = subjects
      .map((subject, subjectIndex) => {
        const key = currentStudent.code + ':' + subjectIndex;
        const value = gradesByStudent[key] == null ? '' : gradesByStudent[key];
        return (
          '<tr><td>' +
          subject +
          '</td><td><input type="number" min="0" max="100" inputmode="numeric" aria-label="' +
          subject +
          ', primer trimestre" data-subject-index="' +
          subjectIndex +
          '" data-sie-subject-code="' +
          subjectCodes[subjectIndex] +
          '" value="' +
          value +
          '"></td></tr>'
        );
      })
      .join('');
    gradeBackdrop.classList.remove('hidden');
    document.querySelector('#marks-rows input')?.focus();
  }

  function closeGradeModal() {
    gradeBackdrop.classList.add('hidden');
  }

  document.querySelectorAll('[data-close-modal]').forEach((button) => button.addEventListener('click', closeGradeModal));
  gradeBackdrop.addEventListener('click', (event) => {
    if (event.target === gradeBackdrop) closeGradeModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeGradeModal();
  });

  document.getElementById('save-grades').addEventListener('click', () => {
    if (!currentStudent) return;
    document.querySelectorAll('#marks-rows input').forEach((input) => {
      const key = currentStudent.code + ':' + input.dataset.subjectIndex;
      gradesByStudent[key] = input.value;
    });
    if (gradesByStudent[currentStudent.code + ':5']) {
      syncStatusByStudent[currentStudent.code] = 'verified';
    }
    renderStudents();
    closeGradeModal();
    showToast('Cambios guardados correctamente en la réplica del SIE.');
  });

  function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
  }

  renderStudents();
  renderSections();
  updateCourseLabel();
})();

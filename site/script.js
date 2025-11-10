// Dynamic year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Send form via mailto (no backend)
const form = document.getElementById('formContacto');
if (form) {
  const tc = document.getElementById('aceptoTerminos');
  // Mensaje de validación personalizado para el checkbox (también en mobile)
  if (tc) {
    const getTermsMsg = () => {
      const lang = localStorage.getItem('lang') || 'es';
      const t = I18N[lang] || I18N.es;
      return t.checkTermsMsg || 'Marque esta casilla si desea continuar.';
    };
    tc.addEventListener('invalid', (e) => {
      tc.setCustomValidity(getTermsMsg());
      tc.classList.add('is-invalid');
    });
    tc.addEventListener('change', () => { tc.setCustomValidity(''); tc.classList.remove('is-invalid'); });
  }
  form.addEventListener('submit', (e) => {
    // Validación nativa (incluye checkbox de términos requerido)
    if (!form.checkValidity()) {
      e.preventDefault();
      form.classList.add('was-validated');
      if (tc && !tc.checked) {
        tc.classList.add('is-invalid');
        try { tc.focus({ preventScroll: true }); } catch(_) { tc.focus(); }
        tc.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    e.preventDefault();
    const nombre = document.getElementById('nombre')?.value?.trim() || '';
    const email = document.getElementById('email')?.value?.trim() || '';
    const empresa = document.getElementById('empresa')?.value?.trim() || '';
    const mensaje = document.getElementById('mensaje')?.value?.trim() || '';

    const subject = encodeURIComponent(`Consulta web - ${empresa || 'sin empresa'}`);
    const body = encodeURIComponent(
      `Nombre: ${nombre}\nEmail: ${email}\nEmpresa: ${empresa}\n\nMensaje:\n${mensaje}`
    );
    window.location.href = `mailto:hola@fundraiser.com.ar?subject=${subject}&body=${body}`;
  });
}

// Close collapsed navbar on link click (mobile UX)
const navCollapseEl = document.getElementById('navMain');
if (navCollapseEl) {
  const links = navCollapseEl.querySelectorAll('.nav-link, .dropdown-item');
  links.forEach((lnk) => {
    lnk.addEventListener('click', (e) => {
      // No cerrar si es un toggle de dropdown (secciones/idioma en mobile)
      if (lnk.classList.contains('dropdown-toggle') || lnk.getAttribute('data-bs-toggle') === 'dropdown') {
        return;
      }
      const instance = window.bootstrap?.Collapse?.getInstance?.(navCollapseEl)
        || (window.bootstrap ? new window.bootstrap.Collapse(navCollapseEl, { toggle: false }) : null);
      if (instance && navCollapseEl.classList.contains('show')) instance.hide();
    });
  });
}

// Back-to-top button with gentle scroll speed
(function(){
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const linear = (t) => t; // velocidad continua (sin easing)

  function smoothScrollToTop(durationMs){
    const el = document.scrollingElement || document.documentElement;
    const start = el.scrollTop || window.pageYOffset || 0;
    if (start <= 0) return;
    const startTime = performance.now();
    let cancelled = false;
    const cancel = () => { cancelled = true; cleanup(); };
    const cleanup = () => {
      window.removeEventListener('wheel', cancel, { passive: true });
      window.removeEventListener('touchstart', cancel, { passive: true });
      window.removeEventListener('keydown', cancel, { passive: true });
    };
    window.addEventListener('wheel', cancel, { passive: true });
    window.addEventListener('touchstart', cancel, { passive: true });
    window.addEventListener('keydown', cancel, { passive: true });

    const step = (now) => {
      if (cancelled) return;
      const elapsed = now - startTime;
      const t = Math.min(elapsed / durationMs, 1);
      const y = Math.round(start * (1 - linear(t)));
      el.scrollTo({ top: y, left: 0, behavior: 'auto' });
      if (t < 1) requestAnimationFrame(step); else cleanup();
    };
    requestAnimationFrame(step);
  }

  btn.addEventListener('click', (e)=>{
    e.preventDefault();
    if (prefersReduced) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    } else {
      // Duración dinámica a velocidad media (≈ 900 px/s)
      const el = document.scrollingElement || document.documentElement;
      const distance = (el.scrollTop || window.pageYOffset || 0);
      const pxPerSec = 900;
      const duration = Math.max(900, Math.min(2800, Math.round((distance / pxPerSec) * 1000)));
      smoothScrollToTop(duration);
    }
  });
})();

// --- Simple i18n (es/en/pt) ---
const I18N = {
  es: {
    headTitle: 'Fundraiser SAS \u2014 Cobranza, pagos y tecnolog\u00EDa',
    headDesc: 'Cobranza, pagos y soluciones tecnol\u00F3gicas omnicanal para organizaciones con alta volumetr\u00EDa. PCI DSS, KYC/AML, conciliaci\u00F3n y reportes en tiempo real.',
    navSections: 'Secciones',
    navDesarrollo: 'Desarrollo tecnol\u00F3gico',
    navValor: 'Propuesta de valor',
    navServicios: 'Servicios',
    navSectores: 'Sectores',
    navCumpl: 'Cumplimiento',
    navTerminos: 'Términos y condiciones',
    navContacto: 'Contacto',
    termsTitle: 'Términos y condiciones',
    termsClose: 'Cerrar y volver',
    checkTermsMsg: 'Marque esta casilla si desea continuar.',
    heroTitle: 'Cobranza, pagos y tecnolog\u00EDa para organizaciones de alta volumetr\u00EDa',
    heroLead: 'Somos una sociedad argentina especializada en soluciones de punta a punta: plataforma multisistemas, locales a la calle, pasarelas de pago con checkout para e-commerce y equipos expertos. Trazabilidad, seguridad y cumplimiento normativo en cada operaci\u00F3n.',
    stat1Title: 'Cobranza omnicanal',
    stat1Desc: 'Online + locales f\u00EDsicos',
    stat2Title: 'PCI DSS',
    stat2Desc: 'Seguridad de datos de pago',
    stat3Title: 'Reportes en tiempo real',
    stat3Desc: 'Conciliaci\u00F3n autom\u00E1tica',
    serviciosH2: 'Servicios',
    tabCobranza: 'Cobranza de impuestos y servicios',
    tabRemesas: 'Remesas familiares',
    tabOutsourcing: 'Outsourcing de cobranza',
    tabRecuento: 'Recuento y control de billetes',
    pCobranza: 'Brindamos el servicio integral de recepci\u00F3n y acreditaci\u00F3n de pagos de tasas, impuestos y servicios. Nuestra tecnolog\u00EDa multisistemas integra distintas fuentes y formatos (APIs, SFTP, lotes) para validar, cobrar y conciliar en tiempo real. Disponemos de m\u00FAltiples locales a la calle para atenci\u00F3n presencial y recepci\u00F3n de efectivo, adem\u00E1s de canales digitales.',
    pRemesas: 'Atendemos remesas en nuestros locales, con verificaci\u00F3n de identidad, registro de operaciones y recibos estandarizados, siguiendo pr\u00E1cticas de KYC/AML y l\u00EDmites operativos seg\u00FAn normativa vigente. Operaciones hacia y desde el exterior con trazabilidad completa.',
    pOutsourcing: 'Operamos como outsourcer de tecnolog\u00EDa y procesos: generamos avisos, links de cobro, recaudo, conciliaciones, devengamientos y reportes; administramos medios de pago y reglas de ruteo, y entregamos cuentas claras: qu\u00E9 se cobr\u00F3, cu\u00E1ndo y a qui\u00E9n se acredit\u00F3, con SLA y m\u00E9tricas. Sumado a un completo webclient para acceso y control de cuentas corrientes.',
    pRecuento: 'Servicio especializado para transportadoras de caudales, supermercados y negocios de alto efectivo. Incluye recuento, clasificaci\u00F3n, detecci\u00F3n de falsos, identificaci\u00F3n de billetes deteriorados y categorizaci\u00F3n por calidad para su tratamiento adecuado. Entregamos actas y reportes operativos.',
    desH2: 'Desarrollo tecnol\u00F3gico',
    desH5: 'Software de gesti\u00F3n de cobranza y pagos por WhatsApp/redes',
    desP: 'Construimos e integramos m\u00F3dulos y procesos de cobro que permiten iniciar y completar pagos directamente desde WhatsApp, Instagram, Facebook y links de pago, con seguimiento del estado, recordatorios autom\u00E1ticos, comprobantes en l\u00EDnea y conciliaci\u00F3n y exportaci\u00F3n contable. Ofrecemos SDKs, APIs y flujos conversacionales con bots y agentes humanos.',
    sectoresH2: 'Sectores que atendemos',
    sectoresP: 'A trav\u00E9s de nuestros sistemas y equipos especializados:',
    cumplH2: 'Cumplimiento y seguridad',
    cumplList: [
      'Controles de prevenci\u00F3n de lavado <strong>(KYC/AML)</strong> y listas restrictivas.',
      'Verificaci\u00F3n de identidad, segregaci\u00F3n de funciones y trazabilidad de fondos.',
      'Protecci\u00F3n de datos personales conforme a la Ley 25.326.',
      '<strong>PCI DSS</strong> habilitados para el tratamiento seguro de datos de pago.'
    ],
    transH5: 'Transparencia operativa',
    transP: 'Reportes en tiempo real, conciliaci\u00F3n autom\u00E1tica y m\u00E9tricas con SLA.',
    contactoH2: '\u00BfQuer\u00E9s integrar o visitar un local?',
    contactoLead: 'Escribinos a <a href="mailto:hola@fundraiser.com.ar" class="link-body-emphasis">hola@fundraiser.com.ar</a> o complet\u00E1 el formulario y te contactamos.',
    labelNombre: 'Nombre',
    labelEmail: 'Email',
    labelEmpresa: 'Empresa',
    labelMensaje: 'Mensaje',
    phNombre: 'Tu nombre',
    phEmail: 'tu@email.com',
    phEmpresa: 'Raz\u00F3n social / marca',
    phMensaje: 'Contanos brevemente tu necesidad',
    ctaEnviar: 'Enviar consulta',
    footerCopy: '\u00A9 {year} Fundraiser SAS \u2014 Todos los derechos reservados',
    flag: 'ES'
  },
  en: {
    headTitle: 'Fundraiser SAS \u2014 Collections, payments and technology',
    headDesc: 'Omnichannel collections, payments, and technology solutions for high\u2011volume organizations. PCI DSS, KYC/AML, reconciliation and real\u2011time reporting.',
    navSections: 'Sections',
    navDesarrollo: 'Technology development',
    navValor: 'Value proposition',
    navServicios: 'Services',
    navSectores: 'Sectors',
    navCumpl: 'Compliance',
    navTerminos: 'Terms & Conditions',
    navContacto: 'Contact',
    termsTitle: 'Terms & Conditions',
    termsClose: 'Close and return',
    checkTermsMsg: 'Please check this box to continue.',
    heroTitle: 'Collections, payments, and technology for high\u2011volume organizations',
    heroLead: 'We are an Argentine company specialized in end\u2011to\u2011end solutions: multi\u2011system platform, storefront locations, payment gateways with checkout, and expert teams. Traceability, security, and regulatory compliance in every operation.',
    stat1Title: 'Omnichannel collections',
    stat1Desc: 'Online + physical locations',
    stat2Title: 'PCI DSS',
    stat2Desc: 'Payment data security',
    stat3Title: 'Real\u2011time reporting',
    stat3Desc: 'Automatic reconciliation',
    serviciosH2: 'Services',
    tabCobranza: 'Tax and services collection',
    tabRemesas: 'Family remittances',
    tabOutsourcing: 'Collections outsourcing',
    tabRecuento: 'Cash counting and control',
    pCobranza: 'We provide end\u2011to\u2011end receipt and credit of taxes, fees, and services. Our multi\u2011system technology integrates diverse sources (APIs, SFTP, batch) to validate, collect, and reconcile in real time. Multiple storefronts for in\u2011person cash handling and digital channels.',
    pRemesas: 'We process remittances in our locations with identity checks, operation logging, and standardized receipts, following KYC/AML practices and regulatory limits. Cross\u2011border operations with full traceability.',
    pOutsourcing: 'We operate as a technology and process outsourcer: notifications, payment links, collection, reconciliation, accruals, and reports; we manage payment methods and routing rules, delivering clear accounts with SLAs and metrics, plus a complete web client for access and control.',
    pRecuento: 'Specialized service for cash\u2011intensive businesses. Includes counting, sorting, counterfeit detection, and quality categorization for proper handling. We deliver records and operational reports.',
    desH2: 'Technology development',
    desH5: 'Collections and payments software for WhatsApp/social',
    desP: 'We build and integrate modules and flows to start and complete payments directly from WhatsApp, Instagram, Facebook and payment links \u2014 with status tracking, automatic reminders, online receipts, and reconciliation/export to accounting. SDKs, APIs and conversational flows with bots and agents.',
    sectoresH2: 'Sectors we serve',
    sectoresP: 'Through our systems and specialized teams:',
    cumplH2: 'Compliance and security',
    cumplList: [
      'Anti\u2011money\u2011laundering controls <strong>(KYC/AML)</strong> and restricted lists.',
      'Identity verification, segregation of duties, and funds traceability.',
      'Personal data protection according to Law 25.326.',
      '<strong>PCI DSS</strong> enabled for secure payment data handling.'
    ],
    transH5: 'Operational transparency',
    transP: 'Real\u2011time reporting, automatic reconciliation, and SLA\u2011backed metrics.',
    contactoH2: 'Want to integrate or visit a branch?',
    contactoLead: 'Write to <a href=\"mailto:hola@fundraiser.com.ar\" class=\"link-body-emphasis\">hola@fundraiser.com.ar</a> or fill in the form and we will contact you.',
    labelNombre: 'Name',
    labelEmail: 'Email',
    labelEmpresa: 'Company',
    labelMensaje: 'Message',
    phNombre: 'Your name',
    phEmail: 'your@email.com',
    phEmpresa: 'Company / brand',
    phMensaje: 'Tell us briefly your need',
    ctaEnviar: 'Send inquiry',
    footerCopy: '\u00A9 {year} Fundraiser SAS \u2014 All rights reserved',
    flag: 'EN'
  },
  pt: {
    headTitle: 'Fundraiser SAS \u2014 Cobran\u00E7a, pagamentos e tecnologia',
    headDesc: 'Solu\u00E7\u00F5es omnichannel de cobran\u00E7a, pagamentos e tecnologia para organiza\u00E7\u00F5es de alto volume. PCI DSS, KYC/AML, concilia\u00E7\u00E3o e relat\u00F3rios em tempo real.',
    navSections: 'Se\u00E7\u00F5es',
    navDesarrollo: 'Desenvolvimento tecnol\u00F3gico',
    navValor: 'Proposta de valor',
    navServicios: 'Servi\u00E7os',
    navSectores: 'Setores',
    navCumpl: 'Conformidade',
    navTerminos: 'Termos e condições',
    navContacto: 'Contato',
    termsTitle: 'Termos e condições',
    termsClose: 'Fechar e voltar',
    checkTermsMsg: 'Marque esta caixa para continuar.',
    heroTitle: 'Cobran\u00E7a, pagamentos e tecnologia para organiza\u00E7\u00F5es de alto volume',
    heroLead: 'Somos uma empresa argentina especializada em solu\u00E7\u00F5es ponta\u2011a\u2011ponta: plataforma multisistemas, lojas f\u00EDsicas, gateways de pagamento com checkout e equipes especialistas. Rastreabilidade, seguran\u00E7a e conformidade regulat\u00F3ria em cada opera\u00E7\u00E3o.',
    stat1Title: 'Cobran\u00E7a omnichannel',
    stat1Desc: 'Online + lojas f\u00EDsicas',
    stat2Title: 'PCI DSS',
    stat2Desc: 'Seguran\u00E7a de dados de pagamento',
    stat3Title: 'Relat\u00F3rios em tempo real',
    stat3Desc: 'Concilia\u00E7\u00E3o autom\u00E1tica',
    serviciosH2: 'Servi\u00E7os',
    tabCobranza: 'Cobran\u00E7a de impostos e servi\u00E7os',
    tabRemesas: 'Remessas familiares',
    tabOutsourcing: 'Outsourcing de cobran\u00E7a',
    tabRecuento: 'Contagem e controle de numer\u00E1rio',
    pCobranza: 'Prestamos o servi\u00E7o integral de recebimento e cr\u00E9dito de taxas, impostos e servi\u00E7os. Nossa tecnologia multisistemas integra diversas fontes (APIs, SFTP, lotes) para validar, cobrar e conciliar em tempo real. V\u00E1rias lojas f\u00EDsicas para atendimento presencial e canais digitais.',
    pRemesas: 'Atendemos remessas em nossas lojas, com verifica\u00E7\u00E3o de identidade, registro das opera\u00E7\u00F5es e recibos padronizados, seguindo pr\u00E1ticas de KYC/AML e limites regulat\u00F3rios. Opera\u00E7\u00F5es de/para o exterior com rastreabilidade total.',
    pOutsourcing: 'Atuamos como outsourcer de tecnologia e processos: avisos, links de pagamento, arrecada\u00E7\u00E3o, concilia\u00E7\u00F5es, apropria\u00E7\u00F5es e relat\u00F3rios; gerimos meios de pagamento e regras de roteamento, entregando contas claras com SLA e m\u00E9tricas, al\u00E9m de webclient para acesso e controle.',
    pRecuento: 'Servi\u00E7o especializado para neg\u00F3cios com alto volume de dinheiro. Inclui contagem, classifica\u00E7\u00E3o, detec\u00E7\u00E3o de falsos e categoriza\u00E7\u00E3o por qualidade. Entregamos atas e relat\u00F3rios operacionais.',
    desH2: 'Desenvolvimento tecnol\u00F3gico',
    desH5: 'Software de cobran\u00E7a e pagamentos para WhatsApp/redes',
    desP: 'Constru\u00EDmos e integramos m\u00F3dulos e fluxos de cobran\u00E7a que permitem iniciar e concluir pagamentos diretamente do WhatsApp, Instagram, Facebook e links de pagamento, com acompanhamento de status, lembretes autom\u00E1ticos, recibos online e concilia\u00E7\u00E3o/exporta\u00E7\u00E3o cont\u00E1bil. Oferecemos SDKs, APIs e fluxos conversacionais.',
    sectoresH2: 'Setores atendidos',
    sectoresP: 'Atrav\u00E9s de nossos sistemas e equipes especializadas:',
    cumplH2: 'Conformidade e seguran\u00E7a',
    cumplList: [
      'Controles de preven\u00E7\u00E3o \u00E0 lavagem <strong>(KYC/AML)</strong> e listas restritivas.',
      'Verifica\u00E7\u00E3o de identidade, segrega\u00E7\u00E3o de fun\u00E7\u00F5es e rastreabilidade de fundos.',
      'Prote\u00E7\u00E3o de dados pessoais conforme a Lei 25.326.',
      '<strong>PCI DSS</strong> habilitado para tratamento seguro de dados de pagamento.'
    ],
    transH5: 'Transpar\u00EAncia operacional',
    transP: 'Relat\u00F3rios em tempo real, concilia\u00E7\u00E3o autom\u00E1tica e m\u00E9tricas com SLA.',
    contactoH2: 'Quer integrar ou visitar uma unidade?',
    contactoLead: 'Escreva para <a href=\"mailto:hola@fundraiser.com.ar\" class=\"link-body-emphasis\">hola@fundraiser.com.ar</a> ou preencha o formul\u00E1rio que entraremos em contato.',
    labelNombre: 'Nome',
    labelEmail: 'Email',
    labelEmpresa: 'Empresa',
    labelMensaje: 'Mensagem',
    phNombre: 'Seu nome',
    phEmail: 'seu@email.com',
    phEmpresa: 'Raz\u00E3o social / marca',
    phMensaje: 'Conte brevemente sua necessidade',
    ctaEnviar: 'Enviar consulta',
    footerCopy: '\u00A9 {year} Fundraiser SAS \u2014 Todos os direitos reservados',
    flag: 'PT'
  }
};

// Extend with additional keys to cover all visible texts
const I18N_EXTRA = {
  es: {
    ctaWriteNow: 'Escribir ahora',
    heroCert: 'Habilitados y certificados PCI DSS.',
    sectoresBadges: [
      'Gobiernos y entes recaudadores',
      'Utilities y telcos',
      'Retail y supermercados',
      'Transportadoras de caudales',
      'Clubes, cámaras y asociaciones',
      'E-commerce y SaaS'
    ]
  },
  en: {
    ctaWriteNow: 'Write now',
    heroCert: 'PCI DSS certified and authorized.',
    sectoresBadges: [
      'Governments and tax agencies',
      'Utilities and telcos',
      'Retail and supermarkets',
      'Cash-in-transit companies',
      'Clubs, chambers and associations',
      'E-commerce and SaaS'
    ]
  },
  pt: {
    ctaWriteNow: 'Escrever agora',
    heroCert: 'Habilitados e certificados PCI DSS.',
    sectoresBadges: [
      'Governos e órgãos arrecadadores',
      'Utilities e telecom',
      'Varejo e supermercados',
      'Transportadoras de valores',
      'Clubes, câmaras e associações',
      'E-commerce e SaaS'
    ]
  }
};
    ['es','en','pt'].forEach((lng)=>{ if (I18N[lng]) Object.assign(I18N[lng], I18N_EXTRA[lng]); });

    // Additional translations to reach full coverage
    const I18N_EXTRA2 = {
      es: {
        heroCtaWrite: 'Escribir a {email}',
        heroCtaForm: 'Completar formulario',
        heroGateway: 'Pasarela de pagos para E-commerces. Ofrecemos un sistema de cobranza para integraci\u00F3n por cuenta y orden para empresas nacionales y extranjeras. Con nuestra pasarela procesas pagos con tarjetas de debito, credito, prepagas y QR Code.',
        valorH2: 'Propuesta de valor',
        valorLead: 'Integramos canales físicos y digitales para cobrar, conciliar y reportar con velocidad y precisión.',
        valorCardsTitles: [
          'Plataforma propia interoperable',
          'Operación omnicanal',
          'KYC/AML y antifraude',
          'Reportes en tiempo real',
          'Alta volumetría y efectivo'
        ],
        valorCardsTexts: [
          'APIs, archivos, WhatsApp y redes para integraciones rápidas y robustas.',
          'Online + locales físicos para recaudo con efectivo y medios digitales.',
          'Cumplimiento normativo, listas restrictivas y verificación de identidad.',
          'Conciliación automática y saldos claros con métricas operativas.',
          'Equipo con experiencia en operaciones masivas y manejo de efectivo.'
        ]
      },
      en: {
        heroCtaWrite: 'Write to {email}',
        heroCtaForm: 'Fill in the form',
        heroGateway: 'Payment gateway for e-commerce. We offer a collection system for account-and-order integration for domestic and foreign companies. With our gateway you process payments with debit, credit, prepaid cards and QR Code.',
        valorH2: 'Value Proposition',
        valorLead: 'We integrate physical and digital channels to collect, reconcile, and report quickly and accurately.',
        valorCardsTitles: [
          'In-house interoperable platform',
          'Omnichannel operation',
          'KYC/AML and anti-fraud',
          'Real-time reporting',
          'High volume and cash'
        ],
        valorCardsTexts: [
          'APIs, files, WhatsApp and social networks for fast, robust integrations.',
          'Online + physical points for cash collection and digital payments.',
          'Regulatory compliance, watchlists and identity verification.',
          'Automatic reconciliation and clear balances with operational metrics.',
          'Experienced team for large-scale operations and cash handling.'
        ]
      },
      pt: {
        heroCtaWrite: 'Escrever para {email}',
        heroGateway: 'Gateway de pagamento para e-commerce. Oferecemos um sistema de cobran\u00E7a para integra\u00E7\u00E3o por conta e ordem para empresas nacionais e estrangeiras. Com nosso gateway voc\u00EA processa pagamentos com cart\u00F5es de d\u00E9bito, cr\u00E9dito, pr\u00E9-pagos e QR Code.',
        heroCtaForm: 'Preencher formulário',
        valorH2: 'Proposta de valor',
        valorLead: 'Integramos canais físicos e digitais para cobrar, conciliar e reportar com rapidez e precisão.',
        valorCardsTitles: [
          'Plataforma própria interoperável',
          'Operação omnichannel',
          'KYC/AML e antifraude',
          'Relatórios em tempo real',
          'Alto volume e numerário'
        ],
        valorCardsTexts: [
          'APIs, arquivos, WhatsApp e redes sociais para integrações rápidas e robustas.',
          'Online + lojas físicas para arrecadação em dinheiro e meios digitais.',
          'Conformidade regulatória, listas restritivas e verificação de identidade.',
          'Conciliação automática e saldos claros com métricas operacionais.',
          'Equipe experiente em operações de grande escala e manuseio de numerário.'
        ]
      }
    };
    ['es','en','pt'].forEach((lng)=>{ if (I18N[lng]) Object.assign(I18N[lng], I18N_EXTRA2[lng]); });

function applyI18n() {
  const lang = localStorage.getItem('lang') || 'es';
  const t = I18N[lang] || I18N.es;
  document.documentElement.lang = lang;
  // Head
  if (t.headTitle) document.title = t.headTitle;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && t.headDesc) metaDesc.setAttribute('content', t.headDesc);
  // Navbar
  const $ = (id) => document.getElementById(id);
  if ($('navSections')) $('navSections').textContent = t.navSections;
  const mapping = [
    ['nav-item-desarrollo', 'navDesarrollo'],
    ['nav-item-valor', 'navValor'],
    ['nav-item-servicios', 'navServicios'],
    ['nav-item-sectores', 'navSectores'],
    ['nav-item-cumplimiento', 'navCumpl'],
    ['nav-item-terminos', 'navTerminos'],
    ['nav-item-contacto', 'navContacto']
  ];
  mapping.forEach(([id, key]) => { if ($(id) && t[key]) $(id).textContent = t[key]; });
      // Update current language indicator with requested codes
      const flagEl = document.getElementById('current-lang-flag');
          if (flagEl) {
            const flagMap = { es: 'ES:', en: 'US:', pt: 'BRA:' };
            flagEl.textContent = flagMap[lang] || 'ES:';
          }
          // Language dropdown labels
          document.querySelectorAll('.lang-select').forEach((a)=>{
            const dl = a.getAttribute('data-lang');
            const labelMap = { es: 'ES: Español', en: 'US: English', pt: 'BRA: Português' };
            if (labelMap[dl]) a.textContent = labelMap[dl];
          });
          // Also translate section links inside dropdown by href (no IDs needed)
      const byHref = [
        ['#desarrollo', 'navDesarrollo'],
        ['#valor', 'navValor'],
        ['#servicios', 'navServicios'],
        ['#sectores', 'navSectores'],
        ['#cumplimiento', 'navCumpl'],
        ['/terminos.html', 'navTerminos'],
        ['#contacto', 'navContacto']
      ];
      byHref.forEach(([href, key]) => {
        const node = document.querySelector(`a.dropdown-item[href="${href}"]`);
        if (node && t[key]) node.textContent = t[key];
      });
      // Hero
      if ($('hero-title')) $('hero-title').textContent = t.heroTitle;
      if ($('hero-lead')) $('hero-lead').textContent = t.heroLead;
      // Hero certification note just beneath the title
      const heroCert = document.querySelector('.hero-brand p.small');
      if (heroCert && t.heroCert) heroCert.textContent = t.heroCert;
      // Hero CTAs
      const heroMail = document.querySelector('.hero-brand a.btn.btn-light[href^="mailto:"]');
      if (heroMail && t.heroCtaWrite) {
        const href = heroMail.getAttribute('href') || '';
        const m = href.match(/mailto:([^?]+)/);
        const email = m ? m[1] : 'hola@fundraiser.com.ar';
        heroMail.textContent = t.heroCtaWrite.replace('{email}', email);
      }
      const heroForm = document.querySelector('.hero-brand a.btn.btn-outline-light[href="#contacto"]');
      if (heroForm && t.heroCtaForm) heroForm.textContent = t.heroCtaForm;
      // Hero wide card text (full-width rectangle)
      const heroGateway = document.querySelector('.hero-brand .hero-stats p.mb-0');
      if (heroGateway && t.heroGateway) heroGateway.textContent = t.heroGateway;
  const statTitles = document.querySelectorAll('.hero-stats .stat-title');
  const statDescs  = document.querySelectorAll('.hero-stats .stat-desc');
  const sT = [t.stat1Title, t.stat2Title, t.stat3Title];
  const sD = [t.stat1Desc, t.stat2Desc, t.stat3Desc];
  statTitles.forEach((n, i) => { if (sT[i]) n.textContent = sT[i]; });
  statDescs.forEach((n, i) => { if (sD[i]) n.textContent = sD[i]; });
  // Servicios + tabs
  if ($('servicios-h2')) $('servicios-h2').textContent = t.serviciosH2;
  const tabMap = [ ['tab-cobranza','tabCobranza'], ['tab-remesas','tabRemesas'], ['tab-outsourcing','tabOutsourcing'], ['tab-recuento','tabRecuento'] ];
  tabMap.forEach(([id,key])=>{ const n=$(id); if(n && t[key]) n.textContent = t[key]; });
  if ($('p-cobranza')) $('p-cobranza').textContent = t.pCobranza;
  if ($('p-remesas')) $('p-remesas').textContent = t.pRemesas;
  if ($('p-outsourcing')) $('p-outsourcing').innerHTML = t.pOutsourcing;
  if ($('p-recuento')) $('p-recuento').textContent = t.pRecuento;
      // Desarrollo
      if ($('desarrollo-h2')) $('desarrollo-h2').textContent = t.desH2;
      if ($('desarrollo-h5')) $('desarrollo-h5').textContent = t.desH5;
      if ($('desarrollo-p')) $('desarrollo-p').textContent = t.desP;
      // Propuesta de valor
      const secValor = document.getElementById('valor');
      if (secValor) {
        const h2v = secValor.querySelector('h2.h1'); if (h2v && t.valorH2) h2v.textContent = t.valorH2;
        const lv = secValor.querySelector('p.text-secondary'); if (lv && t.valorLead) lv.textContent = t.valorLead;
        const vTitles = secValor.querySelectorAll('.card .card-title');
        const vTexts  = secValor.querySelectorAll('.card .card-text');
        if (vTitles && t.valorCardsTitles) vTitles.forEach((n,i)=>{ if (t.valorCardsTitles[i]) n.textContent = t.valorCardsTitles[i]; });
        if (vTexts && t.valorCardsTexts)  vTexts.forEach((n,i)=>{ if (t.valorCardsTexts[i])  n.textContent = t.valorCardsTexts[i];  });
      }
  // Sectores
  if ($('sectores-h2')) $('sectores-h2').textContent = t.sectoresH2;
  if ($('sectores-p')) $('sectores-p').textContent = t.sectoresP;
  const badges = document.querySelectorAll('#sectores .badge');
  if (badges && t.sectoresBadges) badges.forEach((b, i) => { if (t.sectoresBadges[i]) b.textContent = t.sectoresBadges[i]; });
  // Cumplimiento
  if ($('cumpl-h2')) $('cumpl-h2').textContent = t.cumplH2;
  const cumplLis = document.querySelectorAll('#cumplimiento .list-checked li');
  if (cumplLis && t.cumplList) cumplLis.forEach((li, i)=>{ if (t.cumplList[i]) li.innerHTML = t.cumplList[i]; });
  if ($('transparencia-h5')) $('transparencia-h5').textContent = t.transH5;
  if ($('transparencia-p')) $('transparencia-p').textContent = t.transP;
  // Contacto
  if ($('contacto-title')) $('contacto-title').textContent = t.contactoH2;
  if ($('contacto-lead')) $('contacto-lead').innerHTML = t.contactoLead;
  else {
    const leadEl = document.querySelector('#contacto .lead.text-secondary');
    if (leadEl && t.contactoLead) leadEl.innerHTML = t.contactoLead;
  }
  const labels = [ ['nombre','labelNombre'], ['email','labelEmail'], ['empresa','labelEmpresa'], ['mensaje','labelMensaje'] ];
  labels.forEach(([forId,key])=>{ const node = document.querySelector(`label[for="${forId}"]`); if (node && t[key]) node.textContent = t[key]; });
  const ph = [ ['nombre','phNombre'], ['email','phEmail'], ['empresa','phEmpresa'], ['mensaje','phMensaje'] ];
  ph.forEach(([id,key])=>{ const inp = document.getElementById(id); if (inp && t[key]) inp.setAttribute('placeholder', t[key]); });
  const btn = document.getElementById('ctaFooter'); if (btn && t.ctaEnviar) btn.textContent = t.ctaEnviar;
  const writeNow = document.querySelector('#contacto a.btn.btn-brand[href^="mailto:"]');
  if (writeNow && t.ctaWriteNow) writeNow.textContent = t.ctaWriteNow;
  // Footer copy
  const copy = document.querySelector('footer .container div');
  if (copy && t.footerCopy) copy.textContent = t.footerCopy.replace('{year}', new Date().getFullYear());
  // Terms standalone page
  const termsTitle = document.getElementById('terms-title');
  if (termsTitle && t.termsTitle) termsTitle.textContent = t.termsTitle;
  const termsClose = document.querySelector('.terms-close');
  if (termsClose && t.termsClose) {
    termsClose.setAttribute('title', t.termsClose);
    termsClose.setAttribute('aria-label', t.termsClose);
  }
  // Terms accept label in contact form
  const lbl = document.getElementById('label-terminos');
  if (lbl && t.termsTitle) {
    const linkText = t.termsTitle || 'Términos y condiciones';
    const phraseMap = {
      es: `He leído y acepto los <a href="#terminos" class="link-body-emphasis">${linkText}</a>.`,
      en: `I have read and accept the <a href="#terminos" class="link-body-emphasis">${linkText}</a>.`,
      pt: `Li e aceito os <a href="#terminos" class="link-body-emphasis">${linkText}</a>.`
    };
    const lang = document.documentElement.lang || 'es';
    lbl.innerHTML = phraseMap[lang] || phraseMap.es;
  }
}

function setLang(lang){ localStorage.setItem('lang', lang); applyI18n(); }

document.querySelectorAll('.lang-select').forEach(a => {
  a.addEventListener('click', (e)=>{ e.preventDefault(); const lang = a.getAttribute('data-lang'); if (lang) setLang(lang); });
});

applyI18n();

// Bloquear scroll del fondo cuando el overlay de términos (#terminos) está abierto en index
(function(){
  function updateTermsState(){
    const open = (window.location.hash === '#terminos');
    document.documentElement.classList.toggle('terms-open', open);
    document.body.classList.toggle('terms-open', open);
  }
  window.addEventListener('hashchange', updateTermsState);
  updateTermsState();
})();

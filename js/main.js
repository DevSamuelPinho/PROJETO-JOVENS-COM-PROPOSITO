/**
 * ==============================================================================
 * PROJETO JOVENS COM PROPÓSITO — JCP | LANDING PAGE SCRIPT
 * ==============================================================================
 * Interatividade editorial, menu de navegação responsivo, scroll spy,
 * animações suaves, integração Supabase e modais de contribuição.
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initProgressBar();
  initHeaderAndMenu();
  initScrollSpy();
  initScrollReveal();
  initModals();
  initPixCopy();
  initSupabaseData();
});

/* ==============================================================================
   1. BARRA DE PROGRESSO DE SCROLL NO TOPO
   ============================================================================== */
function initProgressBar() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = `${progress}%`;
  }, { passive: true });
}

/* ==============================================================================
   2. HEADER & MENU RESPONSIVO (DRAWER MOBILE + DESKTOP)
   ============================================================================== */
function initHeaderAndMenu() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.getElementById('mobile-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (toggleBtn && drawer) {
    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : !drawer.classList.contains('open');
      if (isOpen) {
        drawer.classList.add('open');
        toggleBtn.classList.add('active');
        toggleBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      } else {
        drawer.classList.remove('open');
        toggleBtn.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    };

    toggleBtn.addEventListener('click', () => toggleMenu());

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });
  }
}

/* ==============================================================================
   3. SCROLL SPY (INDICADOR DE SEÇÃO ATIVA NO MENU)
   ============================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const onScroll = () => {
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ==============================================================================
   4. REVEAL SUAVE NO SCROLL (DISCRETO & SOFISTICADO)
   ============================================================================== */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-on-scroll, .reveal-left, .reveal-right');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -30px 0px'
    }
  );

  elements.forEach(el => {
    if (!el.classList.contains('reveal-left') && !el.classList.contains('reveal-right')) {
      el.classList.add('reveal-init');
    }
    observer.observe(el);
  });
}

/* ==============================================================================
   5. SISTEMA DE MODAIS (ORAÇÃO, PIX, QUERO PARTICIPAR / INDO)
   ============================================================================== */
function initModals() {
  const modalButtons = document.querySelectorAll('[data-open-modal]');
  const closeButtons = document.querySelectorAll('[data-close-modal]');
  const modals = document.querySelectorAll('.jcp-modal');

  modalButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = btn.getAttribute('data-open-modal');
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        // Se o menu mobile estiver aberto, fecha
        const drawer = document.getElementById('mobile-drawer');
        const toggleBtn = document.getElementById('mobile-toggle');
        if (drawer?.classList.contains('open')) {
          drawer.classList.remove('open');
          toggleBtn?.classList.remove('active');
        }
        openModal(targetModal);
      }
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.jcp-modal');
      if (modal) closeModal(modal);
    });
  });

  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.jcp-modal.active');
      if (activeModal) closeModal(activeModal);
    }
  });

  // Manipulador formulário de Oração
  const formOracao = document.getElementById('form-orando');
  if (formOracao) {
    formOracao.addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal(document.getElementById('modal-orando'));
      showToast('Glória a Deus! Sua intercessão fortalece esse propósito.');
      formOracao.reset();
    });
  }

  // Manipulador formulário Participar / Indo
  const formParticipar = document.getElementById('form-participar');
  if (formParticipar) {
    formParticipar.addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal(document.getElementById('modal-participar'));
      showToast('Obrigado! Entraremos em contato para os próximos passos.');
      formParticipar.reset();
    });
  }
}

function openModal(modal) {
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

/* ==============================================================================
   6. CÓPIA DE CHAVE PIX
   ============================================================================== */
function initPixCopy() {
  const copyBtn = document.getElementById('btn-copy-pix');
  const pixKeyEl = document.getElementById('pix-key-val');

  if (copyBtn && pixKeyEl) {
    copyBtn.addEventListener('click', () => {
      const key = pixKeyEl.textContent.trim();
      navigator.clipboard.writeText(key).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'COPIADO!';
        showToast('Chave PIX copiada para a área de transferência.');
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 3000);
      }).catch(err => {
        console.error('Falha ao copiar:', err);
      });
    });
  }
}

/* ==============================================================================
   7. NOTIFICAÇÃO TOAST
   ============================================================================== */
function showToast(message) {
  let toast = document.querySelector('.jcp-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'jcp-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>✓</span> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/* ==============================================================================
   8. INTEGRAÇÃO COM SUPABASE (CARREGAMENTO DINÂMICO DE PRÓXIMA EDIÇÃO)
   ============================================================================== */
async function initSupabaseData() {
  const editionContainer = document.getElementById('proxima-edicao-wrapper');
  if (!editionContainer) return;

  const STORAGE_KEYS = {
    URL: 'jcp_supabase_url',
    ANON_KEY: 'jcp_supabase_anon_key'
  };

  const storedUrl = localStorage.getItem(STORAGE_KEYS.URL);
  const storedKey = localStorage.getItem(STORAGE_KEYS.ANON_KEY);

  // Se houver cliente Supabase configurado
  if (typeof window.supabase !== 'undefined' && storedUrl && storedKey) {
    try {
      const client = window.supabase.createClient(storedUrl, storedKey);
      const { data: editions, error } = await client
        .from('editions')
        .select('*')
        .in('status', ['inscricoes_abertas', 'em_breve', 'planejada'])
        .order('date_start', { ascending: true })
        .limit(1);

      if (!error && editions && editions.length > 0) {
        renderEdition(editions[0]);
        return;
      }
    } catch (e) {
      console.info('Supabase dynamic query fallback to official seed.');
    }
  }

  // Fallback baseado nos registros oficiais do Seed JCP (2ª Edição)
  const officialUpcomingEdition = {
    name: '2ª Edição — Qual é o Seu Propósito?',
    theme: 'Qual é o seu propósito?',
    date_start: '10 a 12 de Outubro de 2026',
    location: 'Pombal — Paraíba',
    verse: 'Jeremias 29:11',
    description: 'A segunda edição do JCP convoca toda a juventude cristã a discernir o seu chamado específico no Reino. Teremos oficinas ministeriais de Louvor, Mídia, Ação Social e Missões no Sertão, além de ministrações com pastores e líderes convidados.'
  };

  renderEdition(officialUpcomingEdition);
}

function renderEdition(edition) {
  const editionContainer = document.getElementById('proxima-edicao-wrapper');
  if (!editionContainer) return;

  const sectionEl = document.getElementById('proxima-edicao');
  if (sectionEl) sectionEl.style.display = 'block';

  editionContainer.innerHTML = `
    <div class="edition-card-editorial reveal-on-scroll">
      <div class="edition-image-side">
        <img src="assets/images/noite_clamor.jpg" alt="${edition.name}" loading="lazy" />
      </div>
      <div class="edition-content-side">
        <div class="edition-status-badge">
          <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#008CFF;"></span>
          PRÓXIMA EDIÇÃO CONFIRMADA
        </div>
        <h3 class="edition-title">${edition.name}</h3>
        
        <div class="edition-meta-row">
          <div class="edition-meta-item">
            <span class="edition-meta-label">Data</span>
            <span class="edition-meta-value">${edition.date_start}</span>
          </div>
          <div class="edition-meta-item">
            <span class="edition-meta-label">Local</span>
            <span class="edition-meta-value">${edition.location}</span>
          </div>
          <div class="edition-meta-item">
            <span class="edition-meta-label">Tema Oficial</span>
            <span class="edition-meta-value">${edition.theme}</span>
          </div>
        </div>

        <p class="text-editorial" style="margin-bottom: 22px;">
          ${edition.description}
        </p>

        <div>
          <button class="btn-primary" data-open-modal="modal-participar">
            QUERO PARTICIPAR
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </button>
        </div>
      </div>
    </div>
  `;

  // Re-vincula modais para botões criados dinamicamente
  const btn = editionContainer.querySelector('[data-open-modal]');
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modal = document.getElementById(btn.getAttribute('data-open-modal'));
      if (modal) openModal(modal);
    });
  }
}

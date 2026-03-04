/* ═══════════════════════════════════════════════════
   SOET Portal — Main JavaScript
   KR Mangalam University
═══════════════════════════════════════════════════ */

// ─── Toast Notification System ─────────────────────
const Toast = {
  container: null,

  init() {
    this.container = document.createElement('div');
    this.container.className = 'toast-container';
    document.body.appendChild(this.container);
  },

  icons: {
    success: 'bi-check-circle-fill',
    error:   'bi-exclamation-triangle-fill',
    info:    'bi-info-circle-fill',
    warning: 'bi-exclamation-circle-fill',
  },

  show(message, type = 'info', duration = 4000) {
    if (!this.container) this.init();

    const toast = document.createElement('div');
    toast.className = `soet-toast toast-${type}`;
    toast.innerHTML = `
      <i class="bi ${this.icons[type]} toast-icon"></i>
      <span class="flex-grow-1">${message}</span>
      <button class="toast-close" onclick="this.closest('.soet-toast').remove()">
        <i class="bi bi-x-lg"></i>
      </button>
    `;
    this.container.appendChild(toast);

    // Auto dismiss
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  success(msg, dur) { this.show(msg, 'success', dur); },
  error(msg, dur)   { this.show(msg, 'error',   dur); },
  info(msg, dur)    { this.show(msg, 'info',     dur); },
  warning(msg, dur) { this.show(msg, 'warning',  dur); },
};

// ─── Loading Overlay ────────────────────────────────
const Loader = {
  overlay: null,

  show(text = 'Please wait...') {
    if (this.overlay) return;
    this.overlay = document.createElement('div');
    this.overlay.className = 'soet-loading-overlay';
    this.overlay.innerHTML = `
      <div class="soet-spinner"></div>
      <div class="soet-loading-text">${text}</div>
    `;
    document.body.appendChild(this.overlay);
  },

  hide() {
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
  }
};

// ─── Session Timeout Warning ────────────────────────
// JWT expires in 7 days — warn 10 minutes before
const SessionManager = {
  warningTimeout: null,
  logoutTimeout: null,

  init(expiresInMs) {
    const warnAt = expiresInMs - (10 * 60 * 1000); // warn 10 min before
    if (warnAt > 0) {
      this.warningTimeout = setTimeout(() => this.showWarning(), warnAt);
    }
    this.logoutTimeout = setTimeout(() => {
      window.location.href = '/auth/logout';
    }, expiresInMs);
  },

  showWarning() {
    const banner = document.createElement('div');
    banner.className = 'session-warning-banner';
    banner.innerHTML = `
      <i class="bi bi-clock-history fs-5"></i>
      <span>Your session expires in <strong>10 minutes</strong></span>
      <a href="/auth/logout" 
         style="color:white;text-decoration:underline;font-weight:700;white-space:nowrap;">
        Logout now
      </a>
      <button onclick="this.closest('.session-warning-banner').remove()"
              style="background:none;border:none;color:rgba(255,255,255,0.8);cursor:pointer;padding:0;">
        <i class="bi bi-x-lg"></i>
      </button>
    `;
    document.body.appendChild(banner);
  },

  clear() {
    clearTimeout(this.warningTimeout);
    clearTimeout(this.logoutTimeout);
  }
};

// ─── File Validation ────────────────────────────────
const FileValidator = {
  MAX_SIZE_MB: 20,

  validate(input, msgElementId) {
    const msgEl = document.getElementById(msgElementId);
    if (!input.files || !input.files[0]) return true;

    const file = input.files[0];
    const sizeMB = file.size / (1024 * 1024);
    const ext = file.name.split('.').pop().toLowerCase();

    if (ext !== 'pdf' || file.type !== 'application/pdf') {
      if (msgEl) {
        msgEl.textContent = '❌ Only PDF files are allowed.';
        msgEl.className = 'file-validation-msg show invalid';
      }
      input.value = '';
      return false;
    }

    if (sizeMB > this.MAX_SIZE_MB) {
      if (msgEl) {
        msgEl.textContent = `❌ File too large (${sizeMB.toFixed(1)}MB). Maximum allowed: ${this.MAX_SIZE_MB}MB.`;
        msgEl.className = 'file-validation-msg show invalid';
      }
      input.value = '';
      return false;
    }

    if (msgEl) {
      msgEl.textContent = `✅ ${file.name} · ${sizeMB.toFixed(2)}MB · PDF`;
      msgEl.className = 'file-validation-msg show valid';
    }
    return true;
  }
};

// ─── Form Submit with Loader ────────────────────────
function initFormLoaders() {
  document.querySelectorAll('form[data-loading]').forEach(form => {
    form.addEventListener('submit', function(e) {
      // Don't show loader if form is invalid
      if (!this.checkValidity()) return;
      const msg = this.dataset.loading || 'Uploading... Please wait';
      Loader.show(msg);
    });
  });
}

// ─── Page Transition ────────────────────────────────
function initPageTransitions() {
  document.querySelectorAll('a[data-fade]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const href = this.href;
      document.body.classList.add('fade-out');
      setTimeout(() => { window.location.href = href; }, 150);
    });
  });
}

// ─── Confirm Delete ─────────────────────────────────
function initDeleteConfirms() {
  document.querySelectorAll('form[data-confirm]').forEach(form => {
    form.addEventListener('submit', function(e) {
      const msg = this.dataset.confirm || 'Are you sure you want to delete this?';
      if (!confirm(msg)) e.preventDefault();
    });
  });
}

// ─── Auto-dismiss Bootstrap Alerts ──────────────────
function initAlertDismiss() {
  document.querySelectorAll('.alert-auto-dismiss').forEach(alert => {
    setTimeout(() => {
      alert.style.transition = 'opacity 0.5s';
      alert.style.opacity = '0';
      setTimeout(() => alert.remove(), 500);
    }, 4000);
  });
}

// ─── Initialise on DOM Ready ────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  Toast.init();
  initFormLoaders();
  initPageTransitions();
  initDeleteConfirms();
  initAlertDismiss();

  // Show toasts from data attributes (set by EJS)
  const toastEl = document.getElementById('page-toast');
  if (toastEl) {
    Toast.show(toastEl.dataset.message, toastEl.dataset.type || 'info');
  }

  // Session timer (7 days in ms, minus time already elapsed)
  // Only on authenticated pages
  if (document.body.dataset.authenticated === 'true') {
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    SessionManager.init(sevenDays);
  }
});
(function() {
  function applyAesthetics(theme, color, radius) {
    const root = document.documentElement;
    root.style.setProperty('--accent', color);
    root.style.setProperty('--card-radius', radius + 'px');
    
    const themeMap = {
      dark: { bg: '#0f0f0f', card: '#1a1a1a', input: '#1f1f23', glass: 'rgba(255,255,255,0.03)', text: '#ffffff', border: '#27272a', sub: '#d4d4d8' },
      night: { bg: '#000000', card: '#0a0a0a', input: '#121212', glass: 'rgba(255,255,255,0.03)', text: '#ffffff', border: '#1a1a1a', sub: '#a1a1aa' },
      light: { bg: '#f8fafc', card: '#ffffff', input: '#f1f5f9', glass: 'rgba(0,0,0,0.03)', text: '#0f172a', border: '#e2e8f0', sub: '#64748b' },
      contrast: { bg: '#000000', card: '#000000', input: '#000000', glass: 'rgba(255,255,255,0.05)', text: '#ffffff', border: '#ffffff', sub: '#ffffff' }
    };

    const t = themeMap[theme] || themeMap.dark;
    root.style.setProperty('--bg-primary', t.bg);
    root.style.setProperty('--bg-secondary', t.card);
    root.style.setProperty('--bg-input', t.input);
    root.style.setProperty('--glass', t.glass);
    root.style.setProperty('--text-primary', t.text);
    root.style.setProperty('--border', t.border);
    root.style.setProperty('--text-secondary', t.sub);
    document.body.style.color = t.text;
    document.body.style.backgroundColor = t.bg;
  }

  function initGlobalTheme() {
    const ps = JSON.parse(localStorage.getItem('user_prefs') || '{"name":"Alex Doe","theme":"dark","color":"#8b5cf6","radius":16,"lock":true}');
    applyAesthetics(ps.theme || 'dark', ps.color || '#8b5cf6', ps.radius || 16);
  }

  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobalTheme);
  } else {
    initGlobalTheme();
  }

  // Export for manual calls (like in settings)
  window.refreshGlobalTheme = initGlobalTheme;
  window.applyAesthetics = applyAesthetics;
})();

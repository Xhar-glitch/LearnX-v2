(() => {
  const I={
    learnx:'<path d="M4 17V7l8 7 8-7v10"/><path d="M8 17V9l4 4 4-4v8"/>',arrow:'<path d="M5 12h13"/><path d="m13 6 6 6-6 6"/>',back:'<path d="M19 12H5"/><path d="m11 18-6-6 6-6"/>',
    volume:'<path d="M4 10v4h4l5 4V6l-5 4H4Z"/><path d="M17 9a5 5 0 0 1 0 6"/>',
    'volume-off':'<path d="M4 10v4h4l5 4V6l-5 4H4Z"/><path d="m17 9 4 6M21 9l-4 6"/>',music:'<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="3"/><circle cx="16.5" cy="16" r="3"/>',
    brain:'<path d="M9 5a3 3 0 0 0-5 2.2A3 3 0 0 0 5 13a3.2 3.2 0 0 0 4 4v-5M15 5a3 3 0 0 1 5 2.2A3 3 0 0 1 19 13a3.2 3.2 0 0 1-4 4v-5"/><path d="M9 8h2m2 0h2M9 12h2m2 0h2"/>',
    japan:'<path d="M5 5h14M12 3v18M6 9c2 2 4 3 6 3s4-1 6-3M6 17c2-2 4-3 6-3s4 1 6 3"/>',note:'<path d="M6 3h9l3 3v15H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',focus:'<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',chart:'<path d="M4 19V9M10 19V5M16 19v-8M22 19H2"/>',
    book:'<path d="M4 5a2 2 0 0 1 2-2h14v17H6a2 2 0 0 0-2 2V5Z"/><path d="M4 19a2 2 0 0 1 2-2h14"/>',chat:'<path d="M4 5h16v11H8l-4 4V5Z"/><path d="M8 9h8M8 12h5"/>',math:'<path d="M6 5h12M6 12h12M6 19h12"/><path d="M9 8v8m6-8v8"/>',english:'<path d="M6 4h12M6 20h12M8 4l4 8 4-8M8 20l4-8 4 8"/>',
    indonesia:'<path d="M5 4h14v16H5z"/><path d="M8 8h8M8 12h8M8 16h5"/>',science:'<path d="M9 3v6l-5 9a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-5-9V3"/><path d="M8 13h8"/>',social:'<circle cx="12" cy="7" r="3"/><circle cx="6" cy="15" r="3"/><circle cx="18" cy="15" r="3"/><path d="M10 9.5 7.8 12M14 9.5l2.2 2M9 16h6"/>',
    civics:'<path d="M4 7h16M5 7v11M9 7v11M15 7v11M19 7v11M3 20h18M12 3l9 4H3l9-4Z"/>',code:'<path d="m9 7-5 5 5 5M15 7l5 5-5 5M13 4l-2 16"/>',art:'<path d="M12 4a8 8 0 1 0 0 16h2a2 2 0 0 0 0-4h-1a2 2 0 0 1 0-4h3a4 4 0 0 0 4-4 8 8 0 0 0-8-4Z"/><circle cx="7.5" cy="10" r=".8"/><circle cx="10" cy="7.5" r=".8"/><circle cx="14" cy="7.5" r=".8"/>',sport:'<circle cx="12" cy="12" r="9"/><path d="m8 5 4 3 4-3M5 15l5-1 2 5M19 15l-5-1-2 5"/>',philosophy:'<path d="M4 9h16M6 9v9M10 9v9M14 9v9M18 9v9M3 20h18M12 4l9 5H3l9-5Z"/>',strategy:'<path d="M5 19 19 5M7 5h12v12"/><circle cx="6" cy="18" r="2"/><path d="M12 12h7"/>',shield:'<path d="M12 3 20 6v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3Z"/><path d="m8 12 2.5 2.5L16 9"/>',search:'<circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/>'
  };
  function mount(root=document){root.querySelectorAll('[data-icon]').forEach(el=>{const k=el.dataset.icon;if(!I[k])return;el.innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true">${I[k]}</svg>`})}
  window.LearnXIcons={mount};mount();
})();

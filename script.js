// Tailwind customization for CDN runtime
window.tailwind = window.tailwind || {};
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Space Grotesk', 'Inter', 'sans-serif']
            },
            colors: {
                galileoDark: '#0b0f19'
            }
        }
    }
};

// Palette + utilities
const TRACK_COLORS = {
    discovery: { base: '#3b82f6', light: '#60a5fa', text: '#bfdbfe' },
    delivery: { base: '#10b981', light: '#34d399', text: '#bbf7d0' },
    operations: { base: '#ec4899', light: '#f472b6', text: '#fbcfe8' }
};

const ENABLE_FOCUS = () => {
    document.querySelectorAll('[data-focusable="true"]').forEach(el => {
        el.setAttribute('tabindex', '0');
        el.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                el.click();
            }
        });
    });
};

// Smooth anchor navigation
function bindAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// View switcher
function switchView(view, evt) {
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    if (evt && evt.currentTarget) evt.currentTarget.classList.add('active');

    document.querySelectorAll('.view-container').forEach(v => v.classList.remove('active'));
    const target = document.getElementById(`${view}-view`);
    if (target) target.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(checkReveal, 150);
}

// Reveal on scroll (IntersectionObserver + fallback)
function initReveal() {
    const items = document.querySelectorAll('.reveal-on-scroll');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        items.forEach(i => observer.observe(i));
    } else {
        window.addEventListener('scroll', checkReveal);
        checkReveal();
    }
}

function checkReveal() {
    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        const rect = el.getBoundingClientRect();
        const threshold = (window.innerHeight || document.documentElement.clientHeight) * 0.85;
        if (rect.top <= threshold) el.classList.add('revealed');
    });
}

// ===============================
// WOW – Continuous Flow Diagram
// ===============================
const wowConfig = {
    width: 1200,
    height: 675,
    tracks: [
        { id: 'discovery', label: 'A. Discovery · Clarify', y: 150, amplitude: 40, color: TRACK_COLORS.discovery },
        { id: 'delivery', label: 'B. Delivery · Build', y: 337.5, amplitude: -40, color: TRACK_COLORS.delivery },
        { id: 'operations', label: 'C. Operations · Prove', y: 525, amplitude: 40, color: TRACK_COLORS.operations }
    ],
    loops: [
        { id: 'insight', from: { x: 640, y: 505 }, cp: { x: 520, y: 337.5 }, to: { x: 640, y: 170 }, color: TRACK_COLORS.operations.base, label: 'Insight loop' },
        { id: 'feasibility', from: { x: 760, y: 317 }, cp: { x: 680, y: 240 }, to: { x: 760, y: 165 }, color: TRACK_COLORS.delivery.base, label: 'Feasibility loop' },
        { id: 'stability', from: { x: 520, y: 357 }, cp: { x: 600, y: 430 }, to: { x: 520, y: 505 }, color: TRACK_COLORS.delivery.base, label: 'Stability loop' }
    ],
    residualZones: [
        { x: 0, y: 80, width: 1200, height: 80, text: 'Unknown unknowns – early Discovery and real life constraints' },
        { x: 260, y: 345, r: 8, label: 'Stressors' }
    ]
};

const wowTrackInfo = {
    discovery: {
        title: 'Discovery – Clarify problem and context',
        desc: 'Make assumptions explicit, frame the problem, understand jobs to be done, define impact and constraints. Enough certainty to decide.'
    },
    delivery: {
        title: 'Delivery – Build operable solutions',
        desc: 'Choose delivery modes, run spikes, design architecture with fitness functions, and instrument observability so the system can live in production.'
    },
    operations: {
        title: 'Operations – Prove value in reality',
        desc: 'Track SLIs/SLOs, error budgets, incidents, and user behavior. Operations reveals fragility and value, feeding Discovery and Delivery.'
    }
};

function trackPath(y, amplitude) {
    return `M -120,${y} C 200,${y} 400,${y - amplitude} 600,${y} C 800,${y + amplitude} 1000,${y} 1320,${y}`;
}

function buildWowDiagram() {
    const container = document.getElementById('wow-flow-diagram');
    if (!container) return;

    const defs = `
        <defs>
            <pattern id="wow-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(148,163,184,0.12)" stroke-width="1" />
            </pattern>
            ${Object.entries(TRACK_COLORS).map(([key, val]) => `
                <linearGradient id="wow-grad-${key}" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="${val.base}" stop-opacity="0.16" />
                    <stop offset="50%" stop-color="${val.light}" stop-opacity="0.32" />
                    <stop offset="100%" stop-color="${val.base}" stop-opacity="0.16" />
                </linearGradient>`).join('')}
            <marker id="wow-arrow" markerWidth="14" markerHeight="14" refX="12" refY="5" orient="auto" markerUnits="userSpaceOnUse">
                <path d="M0,0 L0,10 L12,5 z" fill="#f472b6"></path>
            </marker>
            <linearGradient id="wow-fog" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#ffffff" stop-opacity="0.16" />
                <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
            </linearGradient>
        </defs>`;

    const tracks = wowConfig.tracks.map(track => `
        <g class="wow-track" data-track="${track.id}" role="button" aria-label="${track.label}" data-focusable="true" data-tooltip="${track.label}">
            <path d="${trackPath(track.y, track.amplitude)}" fill="none" stroke="url(#wow-grad-${track.id})" stroke-width="64" stroke-opacity="0.25"></path>
            <path d="${trackPath(track.y, track.amplitude)}" fill="none" stroke="${track.color.light}" stroke-width="3" stroke-dasharray="20 10" class="animate-flow-fast"></path>
            <text x="90" y="${track.y - 42}" fill="${track.color.text}" font-size="20" font-weight="600">${track.label}</text>
        </g>`).join('');

    const loops = wowConfig.loops.map(loop => `
        <path d="M ${loop.from.x},${loop.from.y} Q ${loop.cp.x},${loop.cp.y} ${loop.to.x},${loop.to.y}" fill="none" stroke="${loop.color}" stroke-width="2" stroke-dasharray="6 6" marker-end="url(#wow-arrow)">
            <animate attributeName="stroke-dashoffset" from="120" to="0" dur="2s" repeatCount="indefinite"></animate>
        </path>`).join('');

    const residuals = `
        <rect x="0" y="80" width="1200" height="80" fill="url(#wow-fog)" opacity="0.18"></rect>
        <text x="80" y="110" fill="#fca5a5" font-size="12">Unknown unknowns – early Discovery and real life constraints</text>
        <g>
            <circle cx="260" cy="345" r="8" fill="#fb7185" class="animate-soft-pulse"></circle>
            <circle cx="310" cy="355" r="6" fill="#fb7185" class="animate-soft-pulse" style="animation-delay:0.3s"></circle>
            <circle cx="290" cy="375" r="7" fill="#fb7185" class="animate-soft-pulse" style="animation-delay:0.6s"></circle>
            <text x="248" y="330" fill="#fecaca" font-size="10">Stressors</text>
        </g>`;

    const svg = `
        <svg viewBox="0 0 ${wowConfig.width} ${wowConfig.height}" role="img" aria-label="Continuous flow diagram">
            ${defs}
            <rect width="100%" height="100%" fill="url(#wow-grid)"></rect>
            ${tracks}
            <g id="wow-loops-layer" class="transition-opacity duration-500 opacity-0">${loops}</g>
            <g id="wow-residuality-layer" class="transition-opacity duration-500 opacity-0">${residuals}</g>
        </svg>`;

    container.innerHTML = svg;

    // Bind tooltip + info
    container.querySelectorAll('.wow-track').forEach(g => {
        g.addEventListener('click', () => wowShowDetail(g.dataset.track));
        g.addEventListener('mouseenter', () => wowShowDetail(g.dataset.track));
    });
}

function wowSetMode(mode) {
    const loopsLayer = document.getElementById('wow-loops-layer');
    const residualityLayer = document.getElementById('wow-residuality-layer');
    const titleEl = document.getElementById('wow-overlay-title');
    const descEl = document.getElementById('wow-overlay-desc');

    if (!loopsLayer || !residualityLayer) return;
    loopsLayer.classList.add('opacity-0');
    residualityLayer.classList.add('opacity-0');

    const modes = {
        default: {
            title: 'Three parallel tracks',
            desc: 'Discovery, Delivery, and Operations run in parallel. Information flows continuously, not through handoffs.'
        },
        insight: {
            title: 'Insight loop – Operations → Discovery',
            desc: 'Ops brings production reality back into Discovery. Incidents, data, and behavior refine assumptions.',
            layer: loopsLayer
        },
        stability: {
            title: 'Stability loop – Delivery ↔ Operations',
            desc: 'Delivery and Ops collaborate to keep error budgets healthy and services resilient.',
            layer: loopsLayer
        },
        residuality: {
            title: 'Residuality view',
            desc: 'Visualize where uncertainty lives and where stressors appear to guide prioritization.',
            layer: residualityLayer
        }
    };

    const cfg = modes[mode] || modes.default;
    if (cfg.layer) cfg.layer.classList.remove('opacity-0');
    titleEl.textContent = cfg.title;
    descEl.textContent = cfg.desc;
}

function wowShowDetail(track) {
    const info = wowTrackInfo[track];
    if (!info) return;
    document.getElementById('wow-overlay-title').textContent = info.title;
    document.getElementById('wow-overlay-desc').textContent = info.desc;
}

// ===============================
// POM – Product Operative Model
// ===============================
const pomConfig = {
    tracks: [
        { id: 'discovery', y: 150, label: 'A. Discovery · Clarify', color: TRACK_COLORS.discovery },
        { id: 'delivery', y: 350, label: 'B. Delivery · Build', color: TRACK_COLORS.delivery },
        { id: 'operations', y: 550, label: 'C. Operations · Prove', color: TRACK_COLORS.operations }
    ],
    loops: [
        {
            id: 'insight',
            from: { x: 660, y: 540 },
            cp: { x: 540, y: 350 },
            to: { x: 660, y: 190 },
            color: TRACK_COLORS.operations.base,
            label: 'Insight loop (Ops → Discovery)',
            text: { x: 610, y: 330 }
        },
        {
            id: 'feasibility',
            from: { x: 820, y: 360 },
            cp: { x: 760, y: 250 },
            to: { x: 820, y: 160 },
            color: TRACK_COLORS.delivery.base,
            label: 'Feasibility loop (Delivery → Discovery)',
            text: { x: 790, y: 240 }
        },
        {
            id: 'stability',
            from: { x: 500, y: 220 },
            cp: { x: 580, y: 320 },
            to: { x: 500, y: 430 },
            color: TRACK_COLORS.delivery.base,
            label: 'Stability loop (Ops → Delivery)',
            text: { x: 520, y: 320 }
        }
    ]
};

function buildPomDiagram() {
    const container = document.getElementById('pom-flow-diagram');
    if (!container) return;

    const tracks = pomConfig.tracks.map(t => `
        <g class="pom-track" data-track="${t.id}" role="button" aria-label="${t.label}" data-focusable="true" data-tooltip="${t.label}">
            <path d="${t.id === 'discovery' ? 'M -80,150 C 260,100 540,210 1280,150' : t.id === 'delivery' ? 'M -80,350 C 260,350 540,350 1280,350' : 'M -80,550 C 260,600 540,500 1280,550'}" stroke="url(#pom-grad-${t.id})" stroke-width="130" fill="none"></path>
            <text x="130" y="${t.y}" fill="${t.color.text}" font-size="22" font-weight="700">${t.label}</text>
        </g>`).join('');

    const loops = pomConfig.loops.map(loop => {
        const markerId = loop.color === TRACK_COLORS.operations.base ? 'pom-arrow-pink' : 'pom-arrow-green';
        return `
        <g>
            <path d="M ${loop.from.x},${loop.from.y} Q ${loop.cp.x},${loop.cp.y} ${loop.to.x},${loop.to.y}" fill="none" stroke="${loop.color}" stroke-width="2" stroke-dasharray="6 6" marker-end="url(#${markerId})">
                <animate attributeName="stroke-dashoffset" from="110" to="0" dur="2s" repeatCount="indefinite"></animate>
            </path>
            <text x="${loop.text.x}" y="${loop.text.y}" fill="${loop.color}" font-size="11" font-weight="600">${loop.label}</text>
        </g>`;
    }).join('');

    const overlays = `
        <g id="pom-layer-teams" class="transition-opacity duration-500">
            <rect x="410" y="60" width="380" height="580" fill="black" opacity="0.3" stroke="#fbbf24" stroke-width="2" stroke-dasharray="10 7"></rect>
            <text x="430" y="88" fill="#fbbf24" font-size="13" font-weight="600">
                Stream aligned team
            </text>
            <text x="430" y="108" fill="#facc15" font-size="11">
                End to end owner of one bounded context
            </text>

            <text x="430" y="160" fill="#facc15" font-size="11">
                Discovery members: PM, Design, Data, Tech Lead, Quality
            </text>
            <text x="430" y="360" fill="#facc15" font-size="11">
                Delivery members: Tech Lead, Engineers, Quality, Platform
            </text>
            <text x="430" y="560" fill="#facc15" font-size="11">
                Operations lens enabling members: SRE, Support, Ops partners
            </text>

            <rect x="60" y="60" width="210" height="52" rx="10" fill="rgba(129, 140, 248, 0.10)" stroke="#a78bfa" stroke-width="1"></rect>
            <text x="78" y="85" fill="#e9d5ff" font-size="12" font-weight="600">
                Enabling team
            </text>
            <text x="78" y="101" fill="#c4b5fd" font-size="11">
                Design, Quality, Delivery coaching
            </text>

            <rect x="60" y="620" width="210" height="52" rx="10" fill="rgba(56, 189, 248, 0.10)" stroke="#38bdf8" stroke-width="1"></rect>
            <text x="78" y="645" fill="#e0f2fe" font-size="12" font-weight="600">
                Platform team
            </text>
            <text x="78" y="661" fill="#bae6fd" font-size="11">
                Paved roads for infra, data, DevEx
            </text>
        </g>
        <g id="pom-layer-loops" class="opacity-0 transition-opacity duration-500">${loops}</g>
        <g id="pom-layer-residuality" class="opacity-0 transition-opacity duration-500">
            <rect x="0" y="80" width="1200" height="70" fill="url(#pom-fog)" opacity="0.18"></rect>
            <text x="90" y="105" fill="#fca5a5" font-size="11">
                Unknown unknowns and early assumptions
            </text>
            <rect x="0" y="260" width="1200" height="180" fill="url(#rt-residual-gradient)" opacity="0.26"></rect>
            <text x="90" y="280" fill="#a5f3fc" font-size="11">
                Residual uncertainty is absorbed by Technical and Data Platforms
            </text>
            <g transform="translate(780, 490)">
                <circle cx="0" cy="0" r="9" fill="#ef4444" class="animate-soft-pulse"></circle>
                <circle cx="20" cy="-10" r="6" fill="#ef4444" class="animate-soft-pulse" style="animation-delay:0.3s"></circle>
                <circle cx="28" cy="12" r="7" fill="#ef4444" class="animate-soft-pulse" style="animation-delay:0.6s"></circle>
                <text x="-4" y="32" fill="#fecaca" font-size="10">Stressors and fragility</text>
            </g>
        </g>`;

    const defs = `
        <defs>
            <pattern id="pom-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(148,163,184,0.08)" stroke-width="1"></path>
            </pattern>
            <linearGradient id="pom-fog" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#ffffff" stop-opacity="0.14"></stop>
                <stop offset="100%" stop-color="#ffffff" stop-opacity="0"></stop>
            </linearGradient>
            <marker id="pom-arrow-pink" markerWidth="14" markerHeight="14" refX="12" refY="5" orient="auto" markerUnits="userSpaceOnUse">
                <path d="M0,0 L0,10 L12,5 z" fill="#f472b6"></path>
            </marker>
            <marker id="pom-arrow-green" markerWidth="14" markerHeight="14" refX="12" refY="5" orient="auto" markerUnits="userSpaceOnUse">
                <path d="M0,0 L0,10 L12,5 z" fill="#34d399"></path>
            </marker>
            <linearGradient id="pom-grad-discovery" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#1d4ed8" stop-opacity="0.16"></stop>
                <stop offset="50%" stop-color="#3b82f6" stop-opacity="0.32"></stop>
                <stop offset="100%" stop-color="#1d4ed8" stop-opacity="0.16"></stop>
            </linearGradient>
            <linearGradient id="pom-grad-delivery" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#047857" stop-opacity="0.16"></stop>
                <stop offset="50%" stop-color="#10b981" stop-opacity="0.32"></stop>
                <stop offset="100%" stop-color="#047857" stop-opacity="0.16"></stop>
            </linearGradient>
            <linearGradient id="pom-grad-operations" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#9d174d" stop-opacity="0.16"></stop>
                <stop offset="50%" stop-color="#ec4899" stop-opacity="0.32"></stop>
                <stop offset="100%" stop-color="#9d174d" stop-opacity="0.16"></stop>
            </linearGradient>
        </defs>`;

    const svg = `
        <svg id="pom-flow-svg" viewBox="0 0 1200 700" role="img" aria-label="Product operative model diagram">
            ${defs}
            <rect width="100%" height="100%" fill="url(#pom-grid)"></rect>
            ${tracks}
            ${overlays}
            <g id="pom-behavior-overlay" class="opacity-0 transition-opacity duration-500">
                <rect id="pom-mode-bg" x="0" y="0" width="1200" height="700" fill="transparent"></rect>
                <text id="pom-mode-label" x="600" y="70" fill="#f9fafb" font-size="24" font-weight="700" text-anchor="middle"></text>
                <text id="pom-mode-desc" x="600" y="100" fill="#e5e7eb" font-size="12" text-anchor="middle"></text>
            </g>
        </svg>`;

    container.innerHTML = svg;

    container.querySelectorAll('.pom-track').forEach(el => {
        el.addEventListener('mouseenter', () => pomShowTrackInfo(el.dataset.track));
        el.addEventListener('click', () => pomShowTrackInfo(el.dataset.track));
    });
}

const pomTrackData = {
    discovery: {
        title: 'Discovery track',
        desc: 'Clarifies problem, context and impact. Product + Design + Tech Lead + Data reduce uncertainty enough to choose a direction.'
    },
    delivery: {
        title: 'Delivery track',
        desc: 'Builds solutions that can operate in production from day one. Balances risk, speed and coherence.'
    },
    operations: {
        title: 'Operations track',
        desc: 'Proves value in reality. Tracks error budgets, SLIs and SLOs, reveals where the system is fragile or robust.'
    }
};

function pomToggleLayer(layer) {
    ['pom-layer-teams', 'pom-layer-loops', 'pom-layer-residuality'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('opacity-0');
    });

    const target = document.getElementById(`pom-layer-${layer === 'all' ? '' : layer}`);
    if (target) target.classList.remove('opacity-0');
    archToggleResiduality(layer === 'residuality');
}

function pomShowTrackInfo(track) {
    const data = pomTrackData[track];
    const overlay = document.getElementById('pom-info-overlay');
    const titleEl = document.getElementById('pom-info-title');
    const descEl = document.getElementById('pom-info-desc');
    if (!data || !overlay) return;
    titleEl.textContent = data.title;
    descEl.textContent = data.desc;
    overlay.classList.remove('opacity-0');
    setTimeout(() => overlay.classList.add('opacity-0'), 3200);
}

function pomToggleBehaviorMode(mode) {
    const overlay = document.getElementById('pom-behavior-overlay');
    const label = document.getElementById('pom-mode-label');
    const desc = document.getElementById('pom-mode-desc');
    const bg = document.getElementById('pom-mode-bg');
    if (!overlay) return;

    const modes = {
        adaptive: {
            label: 'Adaptive mode',
            desc: 'Low residual exposure. Fast learning, stable flow. Good for experiments.',
            color: 'rgba(16, 185, 129, 0.18)'
        },
        reinforced: {
            label: 'Reinforced mode',
            desc: 'Preparing for higher load or risk. We reinforce tests, observability, and paved roads.',
            color: 'rgba(59, 130, 246, 0.20)'
        },
        overloaded: {
            label: 'Overloaded mode',
            desc: 'Cognitive or operational load is high. Constrain scope, reduce WIP, stabilize.',
            color: 'rgba(234, 179, 8, 0.22)'
        },
        fragile: {
            label: 'Fragile mode',
            desc: 'Unknown unknowns and stressors dominate. Stop, stabilize, redesign.',
            color: 'rgba(239, 68, 68, 0.25)'
        }
    };

    const cfg = modes[mode];
    if (!cfg) return;
    label.textContent = cfg.label;
    desc.textContent = cfg.desc;
    bg.setAttribute('fill', cfg.color);
    overlay.classList.remove('opacity-0');
    setTimeout(() => overlay.classList.add('opacity-0'), 4200);
}

// Architecture residual overlay toggle reuse
function archToggleResiduality(on) {
    const rt = document.getElementById('arch-layer-rt');
    if (rt) rt.classList.toggle('opacity-0', !on);
}

// ===============================
// STA – Socio-Technical Architecture
// ===============================
const staLayers = [
    { id: 5, title: 'Layer 5 · Core Business Value Streams', color: TRACK_COLORS.discovery, contexts: 'FashionEyewearContext · CommerceFlowContext · VisionProfileContext · CustomerCareContext', team: 'Stream-Aligned Teams', desc: 'End-to-end value delivery · Customer outcomes' },
    { id: 4, title: 'Layer 4 · Transversal Services', color: TRACK_COLORS.delivery, contexts: 'InventoryCapability · ManufacturingOpsContext · LogisticsContext · FinanceOpsContext · WorkforceContext', team: 'Stream-Aligned + Complicated Subsystem', desc: 'Shared operational services · High-complexity subsystems' },
    { id: 3, title: 'Layer 3 · Vertical Enabling', color: { base: '#a855f7', light: '#d8b4fe', text: '#f3e8ff' }, contexts: 'DesignExperienceContext · QualityAgileContext · Architecture guidance', team: 'Enabling Teams (Facilitation mode)', desc: 'Capability raising · Coaching · Patterns and practices' },
    { id: 2, title: 'Layer 2 · Data Platform', color: { base: '#0ea5e9', light: '#7dd3fc', text: '#e0f2fe' }, contexts: 'DataAIPlatformContext · Medallion architecture · Governance', team: 'Platform Team (X-as-a-Service)', desc: 'Data contracts · Lineage · Streaming · Quality · Governance' },
    { id: 1, title: 'Layer 1 · Technical Platform', color: { base: '#6b7280', light: '#9ca3af', text: '#e5e7eb' }, contexts: 'DevPlatformContext · SecurityComplianceContext · Observability · CI/CD', team: 'Platform Team (X-as-a-Service)', desc: 'Infrastructure · Identity · Security · Observability · CI/CD · DevEx' }
];

function buildStaDiagram() {
    const container = document.getElementById('sta-arch-diagram');
    if (!container) return;

    const baseX = 150;
    const width = 900;
    const height = 82;
    const gap = 110;
    const startY = 140;

    const layerRects = staLayers.map((layer, idx) => {
        const y = startY + idx * gap;
        const textColor = layer.color.text || '#e5e7eb';
        const subColor = layer.color.light || '#cbd5f5';
        return `
        <g class="sta-layer" data-layer="${layer.id}" role="button" aria-label="${layer.title}" data-focusable="true" data-tooltip="${layer.title}">
            <rect x="${baseX}" y="${y}" width="${width}" height="${height}" rx="16" fill="${layer.color.base}" fill-opacity="0.28" stroke="${layer.color.base}" stroke-opacity="0.55" stroke-width="1.6"></rect>
            <text x="${baseX + 18}" y="${y + 24}" fill="${textColor}" font-size="15" font-weight="700">${layer.title}</text>
            <text x="${baseX + 18}" y="${y + 44}" fill="${subColor}" font-size="12">${layer.team} · ${layer.desc}</text>
            <text x="${baseX + 18}" y="${y + 62}" fill="${subColor}" font-size="11">${layer.contexts}</text>
        </g>`;
    }).join('');

    const ddoOverlay = `
        <g id="sta-layer-ddo" class="opacity-0 transition-opacity duration-500" pointer-events="none">
            <rect x="${baseX + 120}" y="${startY - 30}" width="160" height="${gap * (staLayers.length - 1) + height + 30}" rx="12" fill="rgba(59,130,246,0.10)" stroke="#3b82f6" stroke-width="2" stroke-dasharray="8 5"></rect>
            <rect x="${baseX + 320}" y="${startY - 30}" width="160" height="${gap * (staLayers.length - 1) + height + 30}" rx="12" fill="rgba(16,185,129,0.10)" stroke="#10b981" stroke-width="2" stroke-dasharray="8 5"></rect>
            <rect x="${baseX + 520}" y="${startY - 30}" width="160" height="${gap * (staLayers.length - 1) + height + 30}" rx="12" fill="rgba(236,72,153,0.10)" stroke="#ec4899" stroke-width="2" stroke-dasharray="8 5"></rect>
        </g>`;

    const teamsOverlay = `
        <g id="sta-layer-teams" class="opacity-0 transition-opacity duration-500" pointer-events="none">
            <rect x="${baseX + 100}" y="${startY - 20}" width="460" height="${gap * (staLayers.length - 1) + height}" fill="transparent" stroke="#fbbf24" stroke-width="3" stroke-dasharray="12 8" rx="14"></rect>
            <text x="${baseX + 330}" y="${startY - 26}" fill="#fcd34d" font-size="12" font-weight="600" text-anchor="middle">Stream-Aligned Team · End-to-End Value</text>
        </g>`;

    const residualOverlay = `
        <g id="sta-layer-rt" class="opacity-0 transition-opacity duration-500" pointer-events="none">
            <rect x="${baseX - 40}" y="${startY - 80}" width="${width + 80}" height="70" fill="url(#sta-fog)" opacity="0.6"></rect>
            <text x="${baseX + width/2}" y="${startY - 40}" fill="#fecaca" font-size="11" text-anchor="middle">Unknown Unknowns — customer behavior, market shifts, external shocks</text>
            <path d="M ${baseX + width/2} ${startY - 20} L ${baseX + width/2} ${startY + gap * (staLayers.length - 1) + height + 20}" stroke="#fb7185" stroke-width="2" stroke-dasharray="8 6" class="animate-flow-fast"></path>
            <text x="${baseX + width/2 + 15}" y="${startY + gap}" transform="rotate(90 ${baseX + width/2 + 15} ${startY + gap})" fill="#fca5a5" font-size="10">Fragility signal propagation</text>
        </g>`;

    const defs = `
        <defs>
            <pattern id="sta-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(148,163,184,0.08)" stroke-width="1"></path>
            </pattern>
            <linearGradient id="sta-fog" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#ffffff" stop-opacity="0.2"></stop>
                <stop offset="100%" stop-color="#ffffff" stop-opacity="0"></stop>
            </linearGradient>
        </defs>`;

    const svg = `
        <svg viewBox="0 0 1200 720" role="img" aria-label="Five-layer architecture model">
            ${defs}
            <rect width="100%" height="100%" fill="url(#sta-grid)"></rect>
            ${layerRects}
            ${ddoOverlay}
            ${teamsOverlay}
            ${residualOverlay}
            <g id="sta-cognitive-arrow">
                <path d="M ${baseX - 60} ${startY - 30} L ${baseX - 60} ${startY + gap * (staLayers.length - 1) + height + 20}" stroke="#94a3b8" stroke-width="2" stroke-dasharray="6 4"></path>
                <polygon points="${baseX - 60},${startY + gap * (staLayers.length - 1) + height + 30} ${baseX - 68},${startY + gap * (staLayers.length - 1) + height + 10} ${baseX - 52},${startY + gap * (staLayers.length - 1) + height + 10}" fill="#94a3b8"></polygon>
                <text x="${baseX - 76}" y="${startY + 150}" transform="rotate(-90 ${baseX - 76} ${startY + 150})" fill="#94a3b8" font-size="11" text-anchor="middle">Cognitive load reduction ↓</text>
            </g>
            <g id="sta-value-arrow">
                <path d="M ${baseX + width + 60} ${startY + gap * (staLayers.length - 1) + height + 20} L ${baseX + width + 60} ${startY - 30}" stroke="#10b981" stroke-width="2" stroke-dasharray="6 4"></path>
                <polygon points="${baseX + width + 60},${startY - 40} ${baseX + width + 52},${startY - 20} ${baseX + width + 68},${startY - 20}" fill="#10b981"></polygon>
                <text x="${baseX + width + 76}" y="${startY + 150}" transform="rotate(90 ${baseX + width + 76} ${startY + 150})" fill="#10b981" font-size="11" text-anchor="middle">Customer value flow ↑</text>
            </g>
        </svg>`;

    container.innerHTML = svg;

    container.querySelectorAll('.sta-layer').forEach(el => {
        el.addEventListener('click', () => staShowLayer(Number(el.dataset.layer)));
    });
}

const staLayerData = {
    5: {
        title: 'Layer 5 · Core Business Value Streams',
        desc: 'Stream-aligned teams own complete value streams end to end. They run Discovery, Delivery, and Operations for their bounded context. Highest exposure to unknown unknowns.',
        contexts: 'FashionEyewear, CommerceFlow, VisionProfile, CustomerCare',
        teamType: 'Stream-Aligned Teams'
    },
    4: {
        title: 'Layer 4 · Transversal Services',
        desc: 'Shared operational capabilities. Mix of stream-aligned teams and complicated subsystem teams (ManufacturingOps, Odoo).',
        contexts: 'Inventory, ManufacturingOps, Logistics, Finance, Workforce',
        teamType: 'Stream-Aligned + Complicated Subsystem'
    },
    3: {
        title: 'Layer 3 · Vertical Enabling',
        desc: 'Enabling teams raise capabilities and exit. No production ownership; success measured by independence of teams helped.',
        contexts: 'DesignExperience, QualityAgile, Architecture guidance',
        teamType: 'Enabling Teams (Facilitation mode)'
    },
    2: {
        title: 'Layer 2 · Data Platform',
        desc: 'Platform team providing data infrastructure as a service. Data contracts, lineage, quality gates, governance.',
        contexts: 'DataAIPlatform, Analytics, ML capabilities',
        teamType: 'Platform Team (X-as-a-Service)'
    },
    1: {
        title: 'Layer 1 · Technical Platform',
        desc: 'Foundation layer. Infrastructure, identity, security, observability, CI/CD. Paved roads reduce cognitive load.',
        contexts: 'DevPlatform, SecurityCompliance, Infrastructure',
        teamType: 'Platform Team (X-as-a-Service)'
    }
};

function staShowLayer(layer) {
    const data = staLayerData[layer];
    if (!data) return;
    const titleEl = document.getElementById('sta-overlay-title');
    const descEl = document.getElementById('sta-overlay-desc');
    if (titleEl) titleEl.textContent = data.title;
    if (descEl) descEl.innerHTML = `${data.desc}<br><span class="text-slate-400 text-[10px] mt-1 block"><strong>Contexts:</strong> ${data.contexts}<br><strong>Team type:</strong> ${data.teamType}</span>`;
}

function staSetMode(mode) {
    const ddoLayer = document.getElementById('sta-layer-ddo');
    const teamsLayer = document.getElementById('sta-layer-teams');
    const rtLayer = document.getElementById('sta-layer-rt');
    const titleEl = document.getElementById('sta-overlay-title');
    const descEl = document.getElementById('sta-overlay-desc');

    [ddoLayer, teamsLayer, rtLayer].forEach(el => el && el.classList.add('opacity-0'));

    const info = {
        standard: { title: 'Five-layer architecture', desc: 'Click any layer to see details or use mode buttons to overlay DDO tracks, team topologies, or Residuality.' },
        ddo: { title: 'Discovery–Delivery–Operations tracks', desc: 'DDO runs vertically through all layers. Insight, Feasibility, and Stability loops connect the tracks.', layer: ddoLayer },
        teams: { title: 'Team Topologies overlay', desc: 'Four team types and interaction modes. Stream-aligned own value; Platform provides X-as-a-Service; Enabling uses Facilitation mode.', layer: teamsLayer },
        residuality: { title: 'Residuality Theory overlay', desc: 'Unknown unknowns at the top, fragility spine through the system. Platform layers dampen residual uncertainty.', layer: rtLayer }
    };
    const cfg = info[mode] || info.standard;
    if (titleEl) titleEl.textContent = cfg.title;
    if (descEl) descEl.textContent = cfg.desc;
    if (cfg.layer) cfg.layer.classList.remove('opacity-0');
}

// ===============================
// Context Stress Grid (cards) – data driven
// ===============================
const contextStressModel = {
    CommerceFlowContext: {
        name: 'CommerceFlowContext',
        layer: 'Core business',
        owner: 'Customer Value Stream Team',
        score: 0.35,
        mode: 'reinforced',
        drivers: [
            'Checkout and conversion flows across countries',
            'Dependency on Identity and Inventory',
            'Campaign and seasonality spikes'
        ]
    },
    VisionProfileContext: {
        name: 'VisionProfileContext',
        layer: 'Core business',
        owner: 'Customer Value Stream Team',
        score: 0.25,
        mode: 'adaptive',
        drivers: [
            'Clinical and prescription data quality',
            'Consistency with lab and manufacturing operations',
            'UX complexity in RX capture and review'
        ]
    },
    ManufacturingOperationsContext: {
        name: 'ManufacturingOperationsContext',
        layer: 'Transversal services',
        owner: 'Lab Services Stream Team',
        score: 0.72,
        mode: 'overloaded',
        drivers: [
            'Manufacturing order backlog and throughput',
            'Machine and shift constraints in the lab',
            'Integration between Odoo, lab equipment and logistics'
        ]
    },
    IdentityPlatformContext: {
        name: 'IdentityPlatformContext',
        layer: 'Technical platform',
        owner: 'Technical Platform Team',
        score: 0.55,
        mode: 'reinforced',
        drivers: [
            'Authentication for ecommerce and PoS',
            'Cross country and multi channel identity consistency',
            'Security and compliance requirements'
        ]
    },
    InventoryCapability: {
        name: 'InventoryCapability',
        layer: 'Transversal services',
        owner: 'Transversal Services Core Team',
        score: 0.68,
        mode: 'overloaded',
        drivers: [
            'Multi country stock visibility and accuracy',
            'Synchronization between lab, warehouses and stores',
            'Constraints in Odoo and Commercetools integration'
        ]
    }
};

function getModeConfig(mode) {
    const configs = {
        adaptive: { label: 'Adaptive', color: 'bg-emerald-500', border: 'border-emerald-500/40', text: 'text-emerald-200' },
        reinforced: { label: 'Reinforced', color: 'bg-blue-500', border: 'border-blue-500/40', text: 'text-blue-200' },
        overloaded: { label: 'Overloaded', color: 'bg-yellow-400', border: 'border-yellow-500/40', text: 'text-yellow-100' },
        fragile: { label: 'Fragile', color: 'bg-red-500', border: 'border-red-500/40', text: 'text-red-200' }
    };
    return configs[mode] || configs.reinforced;
}

function renderContextStressGrid() {
    const container = document.getElementById('context-stress-grid');
    if (!container) return;
    container.innerHTML = '';

    Object.values(contextStressModel).forEach(ctx => {
        const modeCfg = getModeConfig(ctx.mode);
        const percent = Math.round(ctx.score * 100);

        const card = document.createElement('div');
        card.className = `glass-panel rounded-2xl p-4 border ${modeCfg.border} hover:bg-slate-800/70 transition`;
        card.innerHTML = `
            <div class="flex items-start justify-between gap-2 mb-2">
                <div>
                    <h4 class="text-sm font-semibold text-slate-100">${ctx.name}</h4>
                    <p class="text-[11px] text-slate-400">${ctx.layer} · Owner: ${ctx.owner}</p>
                </div>
                <span class="px-2 py-1 rounded-full text-[10px] font-semibold ${modeCfg.text} border border-white/10 bg-slate-900/70">${modeCfg.label}</span>
            </div>
            <div class="mt-2">
                <div class="flex items-center justify-between mb-1 text-[10px] text-slate-400"><span>Residual exposure</span><span>${percent} %</span></div>
                <div class="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div class="h-2 ${modeCfg.color} transition-all duration-500" style="width:${percent}%;"></div>
                </div>
            </div>
            <div class="mt-3">
                <p class="text-[11px] text-slate-400 mb-1">Main drivers:</p>
                <ul class="text-[11px] text-slate-400 space-y-1">
                    ${ctx.drivers.map(d => `<li class="flex gap-1"><span class="mt-[4px] w-1.5 h-1.5 rounded-full ${modeCfg.color}"></span><span>${d}</span></li>`).join('')}
                </ul>
            </div>`;
        container.appendChild(card);
    });
}

// ===============================
// Context Map SVG (simplified positions)
// ===============================
const contextMapPositions = [
    // Core verticals (L5)
    { id: 'fashion', label: 'FashionEyewearContext', x: 170, y: 80, width: 150, height: 340, rotate: true, topology: 'SA', color: '#4f7ff3', detailKey: 'fashion' },
    { id: 'commerce', label: 'CommerceFlowContext', x: 340, y: 80, width: 150, height: 340, rotate: true, topology: 'SA', color: '#4f7ff3', detailKey: 'commerce' },
    { id: 'vision', label: 'VisionProfileContext', x: 510, y: 80, width: 150, height: 340, rotate: true, topology: 'SA', color: '#4f7ff3', detailKey: 'vision' },
    { id: 'care', label: 'CustomerCareContext', x: 680, y: 80, width: 150, height: 340, rotate: true, topology: 'SA', color: '#4f7ff3', detailKey: 'care' },
    // Supporting verticals
    { id: 'manufacturing', label: 'ManufacturingOperationsContext', x: 850, y: 80, width: 170, height: 340, rotate: true, topology: 'CS', color: '#c94646', detailKey: 'manufacturing' },
    { id: 'logistics', label: 'LogisticsContext', x: 1040, y: 80, width: 140, height: 340, rotate: true, topology: 'SA', color: '#c94646', detailKey: 'logistics' },
    // Horizontal supporting bars
    { id: 'workforce', label: 'WorkforceContext', x: 150, y: 470, width: 900, height: 32, rotate: false, topology: 'SA', color: '#c94646', detailKey: 'workforce' },
    { id: 'finance', label: 'FinanceOpsContext', x: 150, y: 512, width: 900, height: 32, rotate: false, topology: 'SA', color: '#c94646', detailKey: 'finance' },
    { id: 'transversal', label: 'Transversal Services Layer', x: 150, y: 554, width: 900, height: 32, rotate: false, topology: 'SA', color: '#c94646', detailKey: 'transversal' },
    // Platform layers
    { id: 'data', label: 'Data Platform', x: 150, y: 596, width: 900, height: 38, rotate: false, topology: 'PL', color: '#5c55e6', detailKey: 'dataplatform' },
    { id: 'tech', label: 'Technical Platform', x: 150, y: 644, width: 900, height: 38, rotate: false, topology: 'PL', color: '#1fa16b', detailKey: 'techplatform' },
    // Enabling vertical
    { id: 'enabling', label: 'Vertical Enabling Layer', x: 1070, y: 300, width: 90, height: 380, rotate: true, topology: 'EN', color: '#dd7b24', detailKey: 'enabling' }
];

const contextData = {
    fashion: {
        name: 'FashionEyewearContext',
        layer: 'L5 · Core Business',
        team: 'Inspiration & Trust Team',
        topology: 'Stream-Aligned',
        discovery: 'Catalog strategy, trend analysis, brand positioning',
        delivery: 'Catalog UX, recommendations, content workflows',
        operations: 'Conversion + freshness SLAs, inventory sync signals',
        loops: 'Insight loop from Ops; Feasibility with Delivery'
    },
    commerce: {
        name: 'CommerceFlowContext',
        layer: 'L5 · Core Business',
        team: 'Commerce Flow Team',
        topology: 'Stream-Aligned',
        discovery: 'Journey mapping, checkout assumptions, payment constraints',
        delivery: 'Cart, checkout, PoS integration, feature flags',
        operations: 'Error budgets, drop-off analytics, regression watch',
        loops: 'Insight loop from Ops; Feasibility with Delivery'
    },
    vision: {
        name: 'VisionProfileContext',
        layer: 'L5 · Core Business',
        team: 'Vision Profile Team',
        topology: 'Stream-Aligned',
        discovery: 'Clinical hypotheses, constraints from lab and compliance',
        delivery: 'RX capture flows, data contracts, validation rules',
        operations: 'Data quality SLIs, clinical error patterns',
        loops: 'Stability loop with Delivery; insight to Discovery'
    },
    care: {
        name: 'CustomerCareContext',
        layer: 'L5 · Core Business',
        team: 'Customer Care Team',
        topology: 'Stream-Aligned',
        discovery: 'Voice of customer, care journeys, escalation mapping',
        delivery: 'Service tooling, runbooks, omnichannel integrations',
        operations: 'CSAT, time-to-resolution, deflection signals',
        loops: 'Insight to Discovery; stability with Delivery'
    },
    manufacturing: {
        name: 'ManufacturingOperationsContext',
        layer: 'L4 · Transversal',
        team: 'Lab Services Stream Team',
        topology: 'Complicated Subsystem',
        discovery: 'Throughput constraints, shift patterns, machine capability',
        delivery: 'MES integrations, scheduling, quality control',
        operations: 'Queue depth, spoilage, machine downtime, takt time',
        loops: 'Stability loop with Delivery; operational signals to Discovery'
    },
    logistics: {
        name: 'LogisticsContext',
        layer: 'L4 · Transversal',
        team: 'Logistics Stream Team',
        topology: 'Stream-Aligned',
        discovery: 'Routing constraints, carrier SLAs, promise-to-deliver dates',
        delivery: 'Fulfillment services, tracking, notifications',
        operations: 'Delay signals, SLA breaches, cost per shipment',
        loops: 'Stability loop with Delivery; insight to Discovery'
    },
    dataplatform: {
        name: 'Data Platform',
        layer: 'L2 · Platform',
        team: 'Data Platform Team',
        topology: 'Platform',
        discovery: 'Data domain discovery, contracts, semantic layer',
        delivery: 'Pipelines, quality gates, governance as code',
        operations: 'Freshness SLAs, anomaly detection, lineage health',
        loops: 'Insight loop to Discovery; stability with Delivery'
    },
    techplatform: {
        name: 'Technical Platform',
        layer: 'L1 · Platform',
        team: 'Technical Platform Team',
        topology: 'Platform',
        discovery: 'Developer pain research, paved road backlog',
        delivery: 'CI/CD, IaC, identity, security, observability',
        operations: 'Reliability, cost, compliance posture, toil reduction',
        loops: 'Platform signals inform Discovery and Delivery readiness'
    },
    enabling: {
        name: 'Vertical Enabling',
        layer: 'L3 · Enabling',
        team: 'Design/Quality/Architecture Enablement',
        topology: 'Enabling',
        discovery: 'Capability assessments, risk reviews, coaching plans',
        delivery: 'Playbooks, facilitation, pairing, guilds',
        operations: 'Quality metrics, regression patterns, learning reviews',
        loops: 'Facilitation mode reduces residual uncertainty for SATs'
    },
    workforce: {
        name: 'WorkforceContext',
        layer: 'L4 · Supporting',
        team: 'Workforce Stream Team',
        topology: 'Stream-Aligned',
        discovery: 'Hiring demand signals, shift planning hypotheses, role capability mapping',
        delivery: 'Scheduling services, staffing tools, access control, compliance workflows',
        operations: 'Scheduling accuracy, staffing fulfillment, compliance alerts',
        loops: 'Stability loop with Delivery; insight loop into Discovery for capacity assumptions'
    },
    finance: {
        name: 'FinanceOpsContext',
        layer: 'L4 · Supporting',
        team: 'Finance Ops Team',
        topology: 'Stream-Aligned',
        discovery: 'Billing/payout assumptions, tax constraints, payment risk models',
        delivery: 'Invoicing services, reconciliation, fiscal integrations (Odoo/PoS)',
        operations: 'Invoice latency, reconciliation health, fraud/chargeback signals',
        loops: 'Insight loop to Discovery on viability; stability loop with Delivery'
    },
    transversal: {
        name: 'Transversal Services Layer',
        layer: 'L4 · Supporting',
        team: 'Transversal Services Core',
        topology: 'Stream-Aligned + Complicated Subsystem',
        discovery: 'Cross-domain constraints, shared SLAs, integration risks',
        delivery: 'Shared services (identity, catalog, inventory), integration patterns',
        operations: 'Shared SLA adherence, incident blast radius, cross-team dependencies',
        loops: 'Insight loops across domains; stability loops with Delivery and Ops'
    }
};

function buildContextMap() {
    const container = document.getElementById('sta-context-map');
    if (!container) return;

    const svg = `
        <svg id="ctx-map-svg" viewBox="0 0 1200 700" class="w-full h-full" role="img" aria-label="Context map">
            <defs>
                <linearGradient id="ctx-grad-core" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.9"></stop>
                    <stop offset="100%" stop-color="#2563eb" stop-opacity="0.9"></stop>
                </linearGradient>
                <linearGradient id="ctx-grad-supporting" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#dc2626" stop-opacity="0.85"></stop>
                    <stop offset="100%" stop-color="#b91c1c" stop-opacity="0.85"></stop>
                </linearGradient>
                <linearGradient id="ctx-grad-transversal" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#dc2626" stop-opacity="0.75"></stop>
                    <stop offset="100%" stop-color="#ef4444" stop-opacity="0.75"></stop>
                </linearGradient>
                <linearGradient id="ctx-grad-data" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#4338ca" stop-opacity="0.9"></stop>
                    <stop offset="100%" stop-color="#6366f1" stop-opacity="0.9"></stop>
                </linearGradient>
                <linearGradient id="ctx-grad-tech" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#16a34a" stop-opacity="0.9"></stop>
                    <stop offset="100%" stop-color="#22c55e" stop-opacity="0.9"></stop>
                </linearGradient>
                <linearGradient id="ctx-grad-enabling" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#f97316" stop-opacity="0.9"></stop>
                    <stop offset="100%" stop-color="#ea580c" stop-opacity="0.9"></stop>
                </linearGradient>
                <filter id="ctx-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur"></feGaussianBlur>
                    <feComposite in="SourceGraphic" in2="blur" operator="over"></feComposite>
                </filter>
                <marker id="ctx-arrow" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="userSpaceOnUse">
                    <path d="M0,0 L0,12 L12,6 z" fill="#94a3b8"></path>
                </marker>
            </defs>

            <text x="25" y="125" fill="#93c5fd" font-size="10" font-weight="600" text-anchor="middle" transform="rotate(-90 25 125)">L5 · CORE</text>
            <text x="25" y="340" fill="#fca5a5" font-size="10" font-weight="600" text-anchor="middle" transform="rotate(-90 25 340)">L4 · SUPPORTING</text>
            <text x="25" y="525" fill="#a5b4fc" font-size="10" font-weight="600" text-anchor="middle" transform="rotate(-90 25 525)">L2 · DATA</text>
            <text x="25" y="620" fill="#86efac" font-size="10" font-weight="600" text-anchor="middle" transform="rotate(-90 25 620)">L1 · TECH</text>

            <g id="ctx-fashion" class="cursor-pointer ctx-clickable" data-context="fashion">
                <rect x="60" y="30" width="130" height="270" rx="8" fill="url(#ctx-grad-core)" stroke="#60a5fa" stroke-width="2"></rect>
                <text x="125" y="170" fill="white" font-size="11" font-weight="600" text-anchor="middle" transform="rotate(-90 125 170)">FashionEyewearContext</text>
                <circle cx="80" cy="50" r="8" fill="#3b82f6" stroke="white" stroke-width="1.5"></circle>
                <text x="80" y="54" fill="white" font-size="8" font-weight="700" text-anchor="middle">SA</text>
            </g>
            <g id="ctx-commerce" class="cursor-pointer ctx-clickable" data-context="commerce">
                <rect x="200" y="30" width="130" height="270" rx="8" fill="url(#ctx-grad-core)" stroke="#60a5fa" stroke-width="2"></rect>
                <text x="265" y="170" fill="white" font-size="11" font-weight="600" text-anchor="middle" transform="rotate(-90 265 170)">CommerceFlowContext</text>
                <circle cx="220" cy="50" r="8" fill="#3b82f6" stroke="white" stroke-width="1.5"></circle>
                <text x="220" y="54" fill="white" font-size="8" font-weight="700" text-anchor="middle">SA</text>
            </g>
            <g id="ctx-vision" class="cursor-pointer ctx-clickable" data-context="vision">
                <rect x="340" y="30" width="130" height="270" rx="8" fill="url(#ctx-grad-core)" stroke="#60a5fa" stroke-width="2"></rect>
                <text x="405" y="170" fill="white" font-size="11" font-weight="600" text-anchor="middle" transform="rotate(-90 405 170)">VisionProfileContext</text>
                <circle cx="360" cy="50" r="8" fill="#3b82f6" stroke="white" stroke-width="1.5"></circle>
                <text x="360" y="54" fill="white" font-size="8" font-weight="700" text-anchor="middle">SA</text>
            </g>
            <g id="ctx-care" class="cursor-pointer ctx-clickable" data-context="care">
                <rect x="480" y="30" width="130" height="270" rx="8" fill="url(#ctx-grad-core)" stroke="#60a5fa" stroke-width="2"></rect>
                <text x="545" y="170" fill="white" font-size="11" font-weight="600" text-anchor="middle" transform="rotate(-90 545 170)">CustomerCareContext</text>
                <circle cx="500" cy="50" r="8" fill="#3b82f6" stroke="white" stroke-width="1.5"></circle>
                <text x="500" y="54" fill="white" font-size="8" font-weight="700" text-anchor="middle">SA</text>
            </g>

            <g id="ctx-manufacturing" class="cursor-pointer ctx-clickable" data-context="manufacturing">
                <rect x="640" y="30" width="150" height="270" rx="8" fill="url(#ctx-grad-supporting)" stroke="#f87171" stroke-width="2"></rect>
                <text x="715" y="130" fill="white" font-size="10" font-weight="600" text-anchor="middle" transform="rotate(-90 715 130)">Manufacturing</text>
                <text x="715" y="200" fill="white" font-size="10" font-weight="600" text-anchor="middle" transform="rotate(-90 715 200)">OperationsContext</text>
                <circle cx="660" cy="50" r="8" fill="#dc2626" stroke="white" stroke-width="1.5"></circle>
                <text x="660" y="54" fill="white" font-size="7" font-weight="700" text-anchor="middle">CS</text>
            </g>
            <g id="ctx-logistics" class="cursor-pointer ctx-clickable" data-context="logistics">
                <rect x="800" y="30" width="110" height="270" rx="8" fill="url(#ctx-grad-supporting)" stroke="#f87171" stroke-width="2"></rect>
                <text x="855" y="170" fill="white" font-size="11" font-weight="600" text-anchor="middle" transform="rotate(-90 855 170)">LogisticsContext</text>
                <circle cx="820" cy="50" r="8" fill="#dc2626" stroke="white" stroke-width="1.5"></circle>
                <text x="820" y="54" fill="white" font-size="8" font-weight="700" text-anchor="middle">SA</text>
            </g>

            <g id="ctx-workforce" class="cursor-pointer ctx-clickable" data-context="workforce">
                <rect x="60" y="310" width="850" height="50" rx="6" fill="url(#ctx-grad-transversal)" stroke="#f87171" stroke-width="1.5"></rect>
                <text x="485" y="342" fill="white" font-size="13" font-weight="600" text-anchor="middle">WorkforceContext</text>
                <circle cx="890" cy="335" r="8" fill="#dc2626" stroke="white" stroke-width="1.5"></circle>
                <text x="890" y="339" fill="white" font-size="8" font-weight="700" text-anchor="middle">SA</text>
            </g>
            <g id="ctx-finance" class="cursor-pointer ctx-clickable" data-context="finance">
                <rect x="60" y="370" width="850" height="50" rx="6" fill="url(#ctx-grad-transversal)" stroke="#f87171" stroke-width="1.5"></rect>
                <text x="485" y="402" fill="white" font-size="13" font-weight="600" text-anchor="middle">FinanceOpsContext</text>
                <circle cx="890" cy="395" r="8" fill="#dc2626" stroke="white" stroke-width="1.5"></circle>
                <text x="890" y="399" fill="white" font-size="8" font-weight="700" text-anchor="middle">SA</text>
            </g>
            <g id="ctx-transversal" class="cursor-pointer ctx-clickable" data-context="transversal">
                <rect x="60" y="430" width="850" height="55" rx="6" fill="url(#ctx-grad-transversal)" stroke="#f87171" stroke-width="1.5"></rect>
                <text x="485" y="465" fill="white" font-size="14" font-weight="600" text-anchor="middle">Transversal Services Layer</text>
            </g>

            <g id="ctx-data" class="cursor-pointer ctx-clickable" data-context="dataplatform">
                <rect x="60" y="495" width="850" height="60" rx="6" fill="url(#ctx-grad-data)" stroke="#818cf8" stroke-width="2"></rect>
                <text x="485" y="532" fill="white" font-size="15" font-weight="700" text-anchor="middle">Data Platform</text>
                <circle cx="890" cy="525" r="10" fill="#4f46e5" stroke="white" stroke-width="1.5"></circle>
                <text x="890" y="529" fill="white" font-size="8" font-weight="700" text-anchor="middle">PL</text>
            </g>

            <g id="ctx-tech" class="cursor-pointer ctx-clickable" data-context="techplatform">
                <rect x="60" y="565" width="850" height="60" rx="6" fill="url(#ctx-grad-tech)" stroke="#4ade80" stroke-width="2"></rect>
                <text x="485" y="602" fill="white" font-size="15" font-weight="700" text-anchor="middle">Technical Platform</text>
                <circle cx="890" cy="595" r="10" fill="#16a34a" stroke="white" stroke-width="1.5"></circle>
                <text x="890" y="599" fill="white" font-size="8" font-weight="700" text-anchor="middle">PL</text>
            </g>

            <g id="ctx-enabling" class="cursor-pointer ctx-clickable" data-context="enabling">
                <rect x="930" y="30" width="70" height="595" rx="8" fill="url(#ctx-grad-enabling)" stroke="#fb923c" stroke-width="2"></rect>
                <text x="965" y="330" fill="white" font-size="12" font-weight="700" text-anchor="middle" transform="rotate(90 965 330)">Vertical Enabling Layer</text>
                <circle cx="965" cy="60" r="10" fill="#ea580c" stroke="white" stroke-width="1.5"></circle>
                <text x="965" y="64" fill="white" font-size="8" font-weight="700" text-anchor="middle">EN</text>
            </g>

            <g transform="translate(1020, 40)">
                <text x="0" y="0" fill="#94a3b8" font-size="10" font-weight="600">Team Topology</text>
                <circle cx="10" cy="20" r="7" fill="#3b82f6" stroke="white" stroke-width="1"></circle>
                <text x="10" y="24" fill="white" font-size="6" font-weight="700" text-anchor="middle">SA</text>
                <text x="25" y="24" fill="#93c5fd" font-size="9">Stream-Aligned</text>

                <circle cx="10" cy="45" r="7" fill="#dc2626" stroke="white" stroke-width="1"></circle>
                <text x="10" y="49" fill="white" font-size="6" font-weight="700" text-anchor="middle">CS</text>
                <text x="25" y="49" fill="#fca5a5" font-size="9">Complicated Sub.</text>

                <circle cx="10" cy="70" r="7" fill="#4f46e5" stroke="white" stroke-width="1"></circle>
                <text x="10" y="74" fill="white" font-size="6" font-weight="700" text-anchor="middle">PL</text>
                <text x="25" y="74" fill="#a5b4fc" font-size="9">Platform</text>

                <circle cx="10" cy="95" r="7" fill="#ea580c" stroke="white" stroke-width="1"></circle>
                <text x="10" y="99" fill="white" font-size="6" font-weight="700" text-anchor="middle">EN</text>
                <text x="25" y="99" fill="#fdba74" font-size="9">Enabling</text>
            </g>

            <rect x="60" y="640" width="940" height="50" rx="8" fill="rgba(15,23,42,0.8)" stroke="#475569" stroke-width="1"></rect>
            <rect x="70" y="650" width="280" height="30" rx="5" fill="rgba(59,130,246,0.2)" stroke="#3b82f6" stroke-width="1"></rect>
            <text x="210" y="670" fill="#93c5fd" font-size="11" font-weight="600" text-anchor="middle">Discovery</text>
            <rect x="370" y="650" width="280" height="30" rx="5" fill="rgba(16,185,129,0.2)" stroke="#10b981" stroke-width="1"></rect>
            <text x="510" y="670" fill="#6ee7b7" font-size="11" font-weight="600" text-anchor="middle">Delivery</text>
            <rect x="670" y="650" width="280" height="30" rx="5" fill="rgba(236,72,153,0.2)" stroke="#ec4899" stroke-width="1"></rect>
            <text x="810" y="670" fill="#f9a8d4" font-size="11" font-weight="600" text-anchor="middle">Operations</text>

            <path d="M 350 665 L 370 665" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#ctx-arrow)"></path>
            <path d="M 650 665 L 670 665" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#ctx-arrow)"></path>
            <path d="M 810 680 Q 510 720 210 680" fill="none" stroke="#f472b6" stroke-width="1.5" stroke-dasharray="4 3">
                <animate attributeName="stroke-dashoffset" from="50" to="0" dur="2s" repeatCount="indefinite"></animate>
            </path>
            <text x="510" y="710" fill="#f9a8d4" font-size="8" text-anchor="middle">Insight Loop</text>
        </svg>`;

    container.innerHTML = svg;

    container.querySelectorAll('.ctx-clickable').forEach(el => {
        el.addEventListener('click', () => showContextDetail(el.dataset.context));
        el.addEventListener('mouseenter', () => showContextDetail(el.dataset.context));
    });
}

function showContextDetail(key) {
    const data = contextData[key];
    if (!data) return;
    const panel = document.getElementById('sta-context-detail');
    const title = document.getElementById('ctx-detail-title');
    const subtitle = document.getElementById('ctx-detail-subtitle');
    const team = document.getElementById('ctx-detail-team');
    const topology = document.getElementById('ctx-detail-topology');
    const disc = document.getElementById('ctx-detail-discovery');
    const del = document.getElementById('ctx-detail-delivery');
    const ops = document.getElementById('ctx-detail-operations');
    const loops = document.getElementById('ctx-detail-loops');

    title.textContent = data.name;
    subtitle.textContent = `${data.layer} · ${data.team}`;
    team.textContent = data.team;
    topology.textContent = data.topology;
    disc.textContent = data.discovery;
    del.textContent = data.delivery;
    ops.textContent = data.operations;
    loops.textContent = data.loops;

    panel.classList.remove('opacity-0', 'translate-y-4');
    panel.classList.add('opacity-100', 'translate-y-0');
}

function closeContextDetail() {
    const panel = document.getElementById('sta-context-detail');
    panel.classList.add('opacity-0', 'translate-y-4');
}

// ===============================
// POV – Role activities
// ===============================
const roleActivitiesData = {
    pm: {
        name: 'Product Manager', icon: 'target', color: 'blue', teamType: 'Stream-Aligned',
        discovery: { practices: ['Frame the problem & intent', 'JTBD + domain modeling', 'Assumption mapping'], techniques: ['Opportunity sizing', 'Hypothesis backlog', 'Service blueprint'], tools: ['Figma', 'Miro', 'Notion'] },
        delivery: { practices: ['Outcome slicing', 'Backlog cohesion', 'Risk trade-offs'], techniques: ['Feature flags', 'Scope constraint', 'Story mapping'], tools: ['Linear', 'Jira', 'Unleash'] },
        operations: { practices: ['Outcome review', 'Signal triage', 'Experiment readouts'], techniques: ['Cohort analysis', 'A/B design', 'SLI health'], tools: ['Looker', 'Grafana', 'Amplitude'] }
    },
    designer: {
        name: 'Product Designer', icon: 'palette', color: 'blue', teamType: 'Stream-Aligned',
        discovery: { practices: ['Research & interviews', 'JTBD validation', 'Experience principles'], techniques: ['Journey mapping', 'Concept testing', 'Prototyping'], tools: ['Figma', 'Maze', 'FullStory'] },
        delivery: { practices: ['Design QA', 'Design system stewardship', 'Accessibility coverage'], techniques: ['Atomic design', 'Design tokens', 'Responsive audits'], tools: ['Storybook', 'Chromatic', 'axe'] },
        operations: { practices: ['UX telemetry review', 'NPS correlation', 'Usability debt tracking'], techniques: ['Task success rate', 'Time-on-task', 'Error rate analysis'], tools: ['Hotjar', 'Analytics', 'Maze'] }
    },
    eng: {
        name: 'Engineer (FE/BE)', icon: 'code', color: 'emerald', teamType: 'Stream-Aligned',
        discovery: { practices: ['Technical spikes', 'Domain modeling', 'Risk assessment'], techniques: ['EventStorming', 'API design', 'Data modeling'], tools: ['Swagger', 'Postman', 'Mermaid'] },
        delivery: { practices: ['TDD/BDD', 'Pairing/code reviews', 'Fitness functions'], techniques: ['Feature flags', 'Trunk-based dev', 'Contract testing'], tools: ['Jest', 'Playwright', 'Pact'] },
        operations: { practices: ['On-call', 'Incident response', 'Perf tuning'], techniques: ['Observability (traces/logs/metrics)', 'Chaos drills', 'Runbooks'], tools: ['Grafana', 'PagerDuty', 'Sentry'] }
    },
    platform: {
        name: 'Platform Team', icon: 'cloud', color: 'cyan', teamType: 'Platform',
        discovery: { practices: ['Developer pain research', 'Platform roadmap'], techniques: ['Platform as product', 'Self-service design'], tools: ['Backstage', 'Notion', 'Surveys'] },
        delivery: { practices: ['IaC & pipelines', 'Security guardrails', 'Docs'], techniques: ['GitOps', 'Policy as code', 'Golden paths'], tools: ['Terraform', 'ArgoCD', 'GitHub Actions'] },
        operations: { practices: ['Reliability', 'FinOps', 'Security posture'], techniques: ['Toil reduction', 'Capacity mgmt', 'Automated compliance'], tools: ['Datadog', 'Snyk', 'Kubecost'] }
    },
    data: {
        name: 'Data Platform', icon: 'database', color: 'cyan', teamType: 'Platform',
        discovery: { practices: ['Data domain discovery', 'Contract design'], techniques: ['Semantic layer planning', 'Mesh principles'], tools: ['Data catalog', 'FigJam', 'Notion'] },
        delivery: { practices: ['Pipelines', 'Quality gates', 'Docs'], techniques: ['Medallion architecture', 'dbt modeling', 'Schema evolution'], tools: ['dbt', 'Airflow', 'Great Expectations'] },
        operations: { practices: ['Freshness SLAs', 'Anomaly detection', 'Cost management'], techniques: ['Lineage tracking', 'Data observability'], tools: ['Datadog', 'Monte Carlo', 'Datafold'] }
    },
    staff: {
        name: 'Staff+ Engineer', icon: 'psychology', color: 'purple', teamType: 'Enabling',
        discovery: { practices: ['Capability mapping', 'Architecture options'], techniques: ['Wardley mapping', 'Trade-off analysis'], tools: ['Structurizr', 'Miro', 'Backstage'] },
        delivery: { practices: ['Paved road design', 'Refactoring', 'Technical writing'], techniques: ['Golden paths', 'Platform primitives'], tools: ['Backstage', 'GitHub', 'ClickUp'] },
        operations: { practices: ['Reliability posture', 'Cross-domain incidents'], techniques: ['Resilience patterns', 'Chaos strategy'], tools: ['Grafana', 'Gremlin', 'Litmus'] }
    },
    servicedesk: {
        name: 'Service Desk', icon: 'support_agent', color: 'pink', teamType: 'Stream-Aligned',
        discovery: { practices: ['Issue pattern analysis', 'Voice of customer'], techniques: ['Root cause categorization', 'Trend identification'], tools: ['Zendesk', 'Intercom', 'Sheets'] },
        delivery: { practices: ['Runbooks', 'KB updates', 'Training'], techniques: ['Escalation paths', 'Self-service enablement'], tools: ['Confluence', 'Guru', 'Notion'] },
        operations: { practices: ['Triage', 'Incident escalation', 'Communication'], techniques: ['First-response optimization', 'SLA monitoring'], tools: ['PagerDuty', 'Statuspage', 'Slack'] }
    },
    qa: {
        name: 'QA Enablement', icon: 'verified', color: 'purple', teamType: 'Enabling',
        discovery: { practices: ['Risk assessment', 'Testability reviews'], techniques: ['Risk-based testing', 'Quality gates'], tools: ['TestRail', 'Notion', 'Xray'] },
        delivery: { practices: ['Test automation', 'Frameworks', 'Coaching'], techniques: ['BDD/TDD', 'Contract testing', 'Visual regression'], tools: ['Playwright', 'Cypress', 'Pact'] },
        operations: { practices: ['Quality metrics', 'Bug pattern analysis'], techniques: ['Defect clustering', 'Escape analysis'], tools: ['Sentry', 'Datadog', 'Grafana'] }
    },
    ptl: {
        name: 'Product Tech Lead', icon: 'architecture', color: 'blue', teamType: 'Stream-Aligned',
        discovery: { practices: ['Architecture reviews', 'Domain modeling'], techniques: ['ADRs', 'C4 diagrams', 'Fitness functions'], tools: ['Structurizr', 'Mermaid', 'GitHub Discussions'] },
        delivery: { practices: ['Technical mentoring', 'Cross-team alignment'], techniques: ['Evolutionary architecture', 'Strangler fig pattern'], tools: ['SonarQube', 'Pact', 'Backstage'] },
        operations: { practices: ['System health reviews', 'Capacity planning'], techniques: ['Error budgets', 'Blast radius analysis'], tools: ['Grafana', 'ServiceNow', 'PagerDuty'] }
    }
};

function renderTrackActivities(trackData, color) {
    const colorClasses = { blue: 'text-blue-400', emerald: 'text-emerald-400', pink: 'text-pink-400', cyan: 'text-cyan-400', purple: 'text-purple-400' };
    const dot = colorClasses[color] || 'text-slate-400';
    return `
        <div class="mb-3">
            <p class="text-xs font-semibold ${dot} uppercase tracking-wide mb-1">Practices</p>
            <ul class="text-xs text-slate-300 space-y-0.5">${trackData.practices.map(p => `<li class="flex gap-1.5"><span class="${dot}">•</span>${p}</li>`).join('')}</ul>
        </div>
        <div class="mb-3">
            <p class="text-xs font-semibold ${dot} uppercase tracking-wide mb-1">Techniques</p>
            <ul class="text-xs text-slate-300 space-y-0.5">${trackData.techniques.map(t => `<li class="flex gap-1.5"><span class="${dot}">•</span>${t}</li>`).join('')}</ul>
        </div>
        <div>
            <p class="text-xs font-semibold ${dot} uppercase tracking-wide mb-1">Tools</p>
            <div class="flex flex-wrap gap-1">${trackData.tools.map(tool => `<span class="px-2 py-0.5 text-[10px] rounded-full bg-slate-800 text-slate-300 border border-slate-700">${tool}</span>`).join('')}</div>
        </div>`;
}

function povShowRoleActivities(roleId) {
    const role = roleActivitiesData[roleId];
    if (!role) return;
    const detailPanel = document.getElementById('pov-role-detail');
    const titleEl = document.getElementById('pov-detail-title');
    const subtitleEl = document.getElementById('pov-detail-subtitle');
    const iconEl = document.getElementById('pov-detail-icon');
    const discoveryEl = document.getElementById('pov-detail-discovery');
    const deliveryEl = document.getElementById('pov-detail-delivery');
    const operationsEl = document.getElementById('pov-detail-operations');

    const colorMap = { blue: 'bg-blue-500/20 text-blue-400', emerald: 'bg-emerald-500/20 text-emerald-400', cyan: 'bg-cyan-500/20 text-cyan-400', purple: 'bg-purple-500/20 text-purple-400', pink: 'bg-pink-500/20 text-pink-400' };
    const cls = colorMap[role.color] || 'bg-slate-800 text-slate-200';

    titleEl.textContent = role.name;
    subtitleEl.textContent = `${role.teamType} · Activities across Discovery, Delivery & Operations`;
    iconEl.className = `w-12 h-12 rounded-xl flex items-center justify-center ${cls.split(' ')[0]}`;
    iconEl.innerHTML = `<span class="material-symbols-outlined ${cls.split(' ')[1]} text-2xl">${role.icon}</span>`;

    discoveryEl.innerHTML = renderTrackActivities(role.discovery, role.color);
    deliveryEl.innerHTML = renderTrackActivities(role.delivery, role.color === 'cyan' ? 'emerald' : role.color);
    operationsEl.innerHTML = renderTrackActivities(role.operations, role.color === 'cyan' ? 'pink' : role.color);

    detailPanel.classList.remove('opacity-0', 'translate-y-4');
    detailPanel.classList.add('opacity-100', 'translate-y-0');

    document.querySelectorAll('.pov-role-bubble circle').forEach(c => c.setAttribute('stroke-width', '2.5'));
    const clicked = document.querySelector(`#role-${roleId} circle`);
    if (clicked) clicked.setAttribute('stroke-width', '4');

    setTimeout(() => detailPanel.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80);
}

function povFilterRoles(teamType, evt) {
    const cards = document.querySelectorAll('.pov-role-card');
    const buttons = document.querySelectorAll('.pov-filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (evt && evt.currentTarget) evt.currentTarget.classList.add('active');

    cards.forEach(card => {
        const cardTeam = card.getAttribute('data-team');
        const visible = teamType === 'all' || cardTeam === teamType;
        card.style.display = visible ? 'block' : 'none';
        card.style.opacity = visible ? '1' : '0';
    });
}

function povCloseRoleDetail() {
    const detailPanel = document.getElementById('pov-role-detail');
    detailPanel.classList.add('opacity-0', 'translate-y-4');
    detailPanel.classList.remove('opacity-100', 'translate-y-0');
    document.querySelectorAll('.pov-role-bubble circle').forEach(c => c.setAttribute('stroke-width', '2.5'));
}

// ===============================
// Customer Journey – modal detail
// ===============================
const journeyStepDetails = [
    {
        title: 'Acquisition', icon: 'campaign', ddo_track: 'Discovery', ddo_color: 'blue',
        description: 'Customer becomes aware through marketing, word-of-mouth, or in-store. Start of the journey.',
        ojos: 'Sees a promise worth exploring; low friction info capture.',
        casimirx: 'Campaign attribution, store traffic, and inventory readiness aligned.',
        signals: ['CTR, store footfall', 'Organic search share', 'Campaign-to-stock coherence'],
        exceptions: 'Mismatch between promise and availability; broken landing pages',
        contribution: 'Sharpens targeting and early signals for Discovery.'
    },
    {
        title: 'Look Good (Explore & Choose)', icon: 'eyeglasses', ddo_track: 'Discovery', ddo_color: 'blue',
        description: 'Explores catalog online/in-store, tries on frames, virtual try-on, finds style fit.',
        ojos: 'Feels inspired; can compare effortlessly.',
        casimirx: 'Assortment and pricing aligned with availability; guidance through advisors.',
        signals: ['Try-on engagement', 'Wishlist adds', 'Consultation bookings'],
        exceptions: 'Unavailable styles shown; latency in catalog',
        contribution: 'Feeds Delivery with evidence of desirability and constraints.'
    },
    {
        title: 'See Well (Eye Exam)', icon: 'visibility', ddo_track: 'Delivery', ddo_color: 'green',
        description: 'In-store eye exam for prescription. Clinical precision and comfort.',
        ojos: 'Trust in clinical accuracy; low waiting.',
        casimirx: 'Clinician schedule + device readiness; compliance captured.',
        signals: ['Exam completion time', 'Prescription quality flags', 'No-shows'],
        exceptions: 'Device downtime; missing records',
        contribution: 'Validates feasibility and clinical constraints for Delivery.'
    },
    {
        title: 'Decide on Us (Purchase)', icon: 'shopping_cart', ddo_track: 'Discovery', ddo_color: 'blue',
        description: 'Select lenses/coatings and complete payment at PoS.',
        ojos: 'Transparent pricing and options; trust in upsells.',
        casimirx: 'PoS reliability; promotions applied; identity sync.',
        signals: ['Checkout success', 'Payment failures', 'Upsell attach rate'],
        exceptions: 'Split payments failing; tax rules missing',
        contribution: 'Confirms viability; informs Delivery on PoS and payments.'
    },
    {
        title: 'Get Receipts (Billing)', icon: 'receipt_long', ddo_track: 'Operations', ddo_color: 'rose',
        description: 'Receives receipt and factura quickly.',
        ojos: 'Trustworthy proof of purchase; easy invoice request.',
        casimirx: 'Compliance and fiscal service uptime.',
        signals: ['Invoice latency', 'Invoice error rate', 'Support contacts'],
        exceptions: 'Fiscal service down; data mismatch',
        contribution: 'Operational signal for compliance resilience.'
    },
    {
        title: 'Quality & Progress (Manufacturing)', icon: 'precision_manufacturing', ddo_track: 'Delivery', ddo_color: 'green',
        description: 'Order enters lab; lenses custom-made; QC ensures quality.',
        ojos: 'Progress visibility and confidence in craftsmanship.',
        casimirx: 'Machine load, QC pass rate, and rework kept visible.',
        signals: ['Queue depth', 'QC failures', 'Cycle time'],
        exceptions: 'Machine failure; missing RX data',
        contribution: 'Stability signals for Delivery and Ops.'
    },
    {
        title: 'Track Your Order (Shipping)', icon: 'local_shipping', ddo_track: 'Operations', ddo_color: 'rose',
        description: 'Shipment tracking and notifications.',
        ojos: 'Predictable delivery with proactive updates.',
        casimirx: 'Carrier SLAs honored; exceptions routed fast.',
        signals: ['On-time %', 'Exception rate', 'Notification latency'],
        exceptions: 'Carrier outage; incorrect address',
        contribution: 'Insight loop into Discovery for promise accuracy.'
    },
    {
        title: 'Enjoy Your Product (Loyalty)', icon: 'sentiment_very_satisfied', ddo_track: 'Operations', ddo_color: 'rose',
        description: 'Uses glasses, warranty, service, and loyalty programs.',
        ojos: 'Feels supported; returns and warranty are painless.',
        casimirx: 'Warranty cost, NPS, recurring revenue health.',
        signals: ['NPS/CSAT', 'Repeat purchase', 'Warranty claim time'],
        exceptions: 'Warranty policy gaps; fragmented support',
        contribution: 'Residuality gain: system learns from stressors for next cycle.'
    }
];

function renderJourneyTimelines() {
    const desktop = document.getElementById('journey-track-desktop');
    const mobile = ensureMobileTimeline();
    const colorMap = { blue: TRACK_COLORS.discovery.base, green: TRACK_COLORS.delivery.base, rose: TRACK_COLORS.operations.base };
    if (desktop) {
        desktop.innerHTML = journeyStepDetails.map((step, idx) => {
            const tag = step.ddo_color === 'blue' ? 'tag-blue' : step.ddo_color === 'green' ? 'tag-green' : 'tag-rose';
            const clr = colorMap[step.ddo_color] || '#38bdf8';
            return `
                <div class="journey-card p-4 cursor-pointer" onclick="showJourneyStepDetail(${idx})" data-focusable="true">
                    <div class="flex justify-end">
                        <span class="journey-chip ${tag}">${step.ddo_track}</span>
                    </div>
                    <div class="flex flex-col items-center text-center gap-2 mt-2">
                        <span class="material-symbols-outlined text-3xl" style="color:${clr}">${step.icon}</span>
                        <h4 class="text-base font-semibold text-slate-100 leading-tight">${step.title}</h4>
                    </div>
                    <p class="text-sm text-slate-200 leading-relaxed mt-2 mb-4 text-center">${step.description}</p>
                    <div class="h-1.5 rounded-full bg-slate-800 overflow-hidden progress-bar"><div class="h-full" style="width:100%;background:${clr};"></div></div>
                </div>`;
        }).join('');
    }
    if (mobile) {
        mobile.innerHTML = journeyStepDetails.map((step, idx) => {
            const tag = step.ddo_color === 'blue' ? 'tag-blue' : step.ddo_color === 'green' ? 'tag-green' : 'tag-rose';
            const clr = colorMap[step.ddo_color] || '#38bdf8';
            return `
                <div class="accordion-item" onclick="showJourneyStepDetail(${idx})" data-focusable="true">
                    <div class="flex items-center justify-between gap-2">
                        <div class="flex items-center gap-2">
                            <span class="material-symbols-outlined" style="color:${clr}">${step.icon}</span>
                            <div>
                                <p class="text-sm font-semibold text-slate-100">${step.title}</p>
                                <p class="text-[11px] text-slate-400">${step.ddo_track}</p>
                            </div>
                        </div>
                        <span class="px-2 py-0.5 rounded-full text-[10px] ${tag}">${step.ddo_track}</span>
                    </div>
                    <p class="text-xs text-slate-300 mt-2">${step.description}</p>
                </div>`;
        }).join('');
    }
}

function ensureMobileTimeline() {
    // Only render the mobile accordion when the viewport is narrow enough
    if (window.innerWidth > 768) {
        const existing = document.getElementById('journey-mobile-wrap');
        if (existing) existing.remove();
        return null;
    }

    let mobile = document.getElementById('mobile-timeline');
    if (mobile) return mobile;
    const desktopSection = document.querySelector('#customer-journey');
    if (!desktopSection) return null;
    const wrapper = document.createElement('section');
    wrapper.className = 'py-12 px-4 bg-slate-950 timeline-mobile journey-mobile';
    wrapper.id = 'journey-mobile-wrap';
    wrapper.innerHTML = `
        <div class="max-w-3xl mx-auto">
            <h4 class="text-lg font-semibold text-slate-100 mb-3">Mobile timeline (vertical accordion)</h4>
            <div class="space-y-3" id="mobile-timeline"></div>
        </div>`;
    desktopSection.insertAdjacentElement('afterend', wrapper);
    return document.getElementById('mobile-timeline');
}

function showJourneyStepDetail(stepIndex) {
    const detail = journeyStepDetails[stepIndex];
    if (!detail) return;
    const overlay = document.getElementById('journey-step-overlay');
    const card = document.getElementById('journey-step-card');
    const colorMap = { blue: TRACK_COLORS.discovery.base, green: TRACK_COLORS.delivery.base, rose: TRACK_COLORS.operations.base };
    const clr = colorMap[detail.ddo_color] || '#38bdf8';
    document.getElementById('journey-step-title').innerHTML = `<span class="material-symbols-outlined align-middle mr-2">${detail.icon}</span>${detail.title}`;
    document.getElementById('journey-step-description').textContent = detail.description;
    document.getElementById('journey-step-ojos').textContent = detail.ojos;
    document.getElementById('journey-step-casimirx').textContent = detail.casimirx;
    document.getElementById('journey-step-signals').innerHTML = detail.signals.map(s => `<li class="flex gap-1"><span class="text-slate-400">•</span>${s}</li>`).join('');
    document.getElementById('journey-step-exceptions').textContent = detail.exceptions;
    document.getElementById('journey-step-contribution').textContent = detail.contribution;

    const tag = document.getElementById('journey-step-track-tag');
    tag.textContent = `${detail.ddo_track} track`;
    tag.className = `px-3 py-1 text-xs font-semibold rounded-full tag-${detail.ddo_color}`;
    card.className = `glass-panel rounded-2xl p-6 border-l-4 max-w-xl w-full transform -translate-y-3 transition-transform duration-200`;
    card.style.borderLeftColor = clr;
    overlay.classList.remove('overlay-hidden');
    setTimeout(() => card.classList.remove('-translate-y-3'), 10);
}

function hideJourneyStepDetail() {
    const overlay = document.getElementById('journey-step-overlay');
    const card = document.getElementById('journey-step-card');
    card.classList.add('-translate-y-3');
    overlay.classList.add('overlay-hidden');
}

// ===============================
// Tooltips
// ===============================
function bindTooltips() {
    const tooltip = document.getElementById('diagram-tooltip');
    if (!tooltip) return;
    document.querySelectorAll('[data-tooltip]').forEach(el => {
        el.addEventListener('mouseenter', () => {
            tooltip.textContent = el.dataset.tooltip;
            const rect = el.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width / 2}px`;
            tooltip.style.top = `${rect.top - 12}px`;
            tooltip.classList.add('visible');
        });
        el.addEventListener('mouseleave', () => tooltip.classList.remove('visible'));
    });
}

// ===============================
// Initialization
// ===============================
window.addEventListener('load', () => {
    buildWowDiagram();
    buildPomDiagram();
    buildStaDiagram();
    buildContextMap();
    renderJourneyTimelines();
    renderContextStressGrid();
    initReveal();
    bindAnchors();
    bindTooltips();
    ENABLE_FOCUS();

    // Nav animation if GSAP present
    if (window.gsap) {
        gsap.from('.view-switcher', { duration: 0.6, y: -30, opacity: 0, ease: 'power3.out' });
    }

    window.addEventListener('resize', () => {
        // Re-evaluate which journey layout should be present on viewport changes
        renderJourneyTimelines();
    });
});

// Public hook for future telemetry integration
function updateContextStress(contextName, newScore, newMode) {
    const ctx = contextStressModel[contextName];
    if (!ctx) return;
    if (typeof newScore === 'number') ctx.score = Math.min(Math.max(newScore, 0), 1);
    if (newMode) ctx.mode = newMode;
    renderContextStressGrid();
}

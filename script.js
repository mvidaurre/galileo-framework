/**
 * ==================================================================================
 * Galileo Platform - Unified Framework (v10.1 - FINAL & COMPLETE Behavior Script)
 *
 * This script handles all interactivity for the Galileo Platform visualization.
 * All content and structure now reside in `index.html`. This script is for
 * behavior only, following the principle of separation of concerns.
 * ==================================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);
    setupGlobalEventListeners();
    setupScrollTriggersForView('wow');

    // Set initial active states for buttons
    document.querySelector('.view-btn[data-view="wow"]')?.classList.add('active');
    document.querySelector('.wow-mode-btn[data-mode="default"]')?.classList.add('active');
    document.querySelector('.pom-layer-btn[data-layer="all"]')?.classList.add('active');
    document.querySelector('.sta-mode-btn[data-mode="standard"]')?.classList.add('active');
    document.querySelector('.pov-filter-btn[data-filter="all"]')?.classList.add('active');
});

const appState = {
    currentView: 'wow',
    pomInfoTimeout: null,
    staInfoTimeout: null,
};

function setupGlobalEventListeners() {
    // This is a delegate pattern. Listen for clicks on the body.
    document.body.addEventListener('click', (event) => {
        const target = event.target;

        // View Switcher
        const viewBtn = target.closest('.view-btn');
        if (viewBtn) {
            switchView(viewBtn.dataset.view);
            return;
        }

        // WoW Mode Buttons
        const wowModeBtn = target.closest('.wow-mode-btn');
        if (wowModeBtn) {
            wowSetMode(wowModeBtn.dataset.mode);
            return;
        }
        
        // POM Buttons
        const pomLayerBtn = target.closest('.pom-layer-btn');
        if (pomLayerBtn) {
            pomToggleLayer(pomLayerBtn.dataset.layer);
            return;
        }
        const pomBehaviorBtn = target.closest('.pom-behavior-btn');
        if(pomBehaviorBtn) {
            pomToggleBehaviorMode(pomBehaviorBtn.dataset.mode);
            return;
        }

        // STA Buttons
        const staModeBtn = target.closest('.sta-mode-btn');
        if (staModeBtn) {
            staSetMode(staModeBtn.dataset.mode);
            return;
        }
        const staContextBtn = target.closest('.ctx-clickable');
        if(staContextBtn) {
            showContextDetail(staContextBtn.id.replace('ctx-', ''));
            return;
        }
        const staLayerBtn = target.closest('.sta-layer-group');
        if(staLayerBtn) {
            staShowLayer(staLayerBtn.dataset.layerId);
            return;
        }

        // POV Buttons
        const povRoleBtn = target.closest('.pov-role-bubble');
        if(povRoleBtn){
            povShowRoleActivities(povRoleBtn.id.replace('role-', ''));
            return;
        }
        const povFilterBtn = target.closest('.pov-filter-btn');
        if(povFilterBtn) {
            povFilterRoles(povFilterBtn.dataset.filter);
            return;
        }

    });
}

function switchView(viewId) {
    console.log('switchView called with viewId:', viewId);
    if (!viewId || viewId === appState.currentView) {
        console.log('switchView returned: no viewId or already current view');
        return;
    }
    appState.currentView = viewId;
    console.log('Current view set to:', appState.currentView);

    document.querySelectorAll('.view-container').forEach(container => {
        container.classList.remove('active');
    });
    const targetView = document.getElementById(`${viewId}-view`);
    if (targetView) {
        targetView.classList.add('active');
        console.log('Added active class to:', targetView.id);
    } else {
        console.log('Target view element not found:', `${viewId}-view`);
    }

    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === viewId);
    });
    console.log('Button active states updated.');

    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Temporarily comment out scroll trigger setup to rule out interference
    // setTimeout(() => setupScrollTriggersForView(viewId), 150);
    console.log('Scroll trigger setup commented out temporarily.');
}

function setupScrollTriggersForView(viewId) {
    const view = document.getElementById(`${viewId}-view`);
    if (!view) return;

    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    gsap.utils.toArray(view.querySelectorAll('.reveal-on-scroll')).forEach(el => {
        // Set initial state using GSAP
        gsap.set(el, { opacity: 0, y: 30 });

        gsap.to(el, { // Use gsap.to since initial state is set
            scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                // Use "play resume resume reverse" to animate out when scrolling back up
                // Or "play none none none" to only animate in once
                toggleActions: 'play none none none',
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
        });
    });
    ScrollTrigger.refresh();
}

// All other functions are complete below.
// ...
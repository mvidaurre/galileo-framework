
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
}
    // View switcher
    function switchView(view, evt) {
        document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
        if (evt && evt.currentTarget) {
            evt.currentTarget.classList.add('active');
        }

        document.querySelectorAll('.view-container').forEach(v => v.classList.remove('active'));
        document.getElementById(view + '-view').classList.add('active');

        window.scrollTo({ top: 0, behavior: 'smooth' });

        setTimeout(checkReveal, 120);
    }

    // WOW track info
    const wowTrackInfo = {
        discovery: {
            title: 'Discovery – Clarify problem and context',
            desc: 'We make assumptions explicit, frame the problem, understand jobs to be done, and define impact and constraints. We never try to know everything, only enough to decide with less risk.'
        },
        delivery: {
            title: 'Delivery – Build operable solutions',
            desc: 'We choose delivery modes, test through spikes and PoCs, design architecture with fitness functions, and instrument observability so the system can live well in production.'
        },
        operations: {
            title: 'Operations – Prove value in reality',
            desc: 'We track SLIs and SLOs, error budgets, incidents and user behavior. Operations is not just support. It is a learning engine that reveals fragility and value.'
        }
    };

    function wowSetMode(mode) {
        const loopsLayer = document.getElementById('wow-loops-layer');
        const residualityLayer = document.getElementById('wow-residuality-layer');
        const titleEl = document.getElementById('wow-overlay-title');
        const descEl = document.getElementById('wow-overlay-desc');

        loopsLayer.classList.add('opacity-0');
        residualityLayer.classList.add('opacity-0');

        if (mode === 'default') {
            titleEl.textContent = 'Three parallel tracks';
            descEl.textContent = 'Discovery, Delivery and Operations run in parallel. Information flows continuously, not through big handoffs.';
        } else if (mode === 'insight') {
            loopsLayer.classList.remove('opacity-0');
            titleEl.textContent = 'Insight loop – Operations to Discovery';
            descEl.textContent = 'Ops brings production reality back into Discovery. Incidents, data and behavior refine assumptions and problem framing.';
        } else if (mode === 'stability') {
            loopsLayer.classList.remove('opacity-0');
            titleEl.textContent = 'Stability loop – Delivery and Operations';
            descEl.textContent = 'Delivery and Ops collaborate to keep error budgets healthy and services resilient while we keep improving.';
        } else if (mode === 'residuality') {
            residualityLayer.classList.remove('opacity-0');
            titleEl.textContent = 'Residuality view';
            descEl.textContent = 'We visualize where uncertainty still lives in the system and where stressors appear. This guides what to prioritize next.';
        }
    }

    function wowShowDetail(track) {
        const info = wowTrackInfo[track];
        if (!info) return;
        document.getElementById('wow-overlay-title').textContent = info.title;
        document.getElementById('wow-overlay-desc').textContent = info.desc;
    }

    // POM layers and info
    const pomTrackData = {
        discovery: {
            title: 'Discovery track',
            desc: 'Clarifies problem, context and impact. Works with Product, Design, Tech Lead and Data to reduce uncertainty enough to choose a direction.'
        },
        delivery: {
            title: 'Delivery track',
            desc: 'Builds solutions that can operate in production from day one. Balances risk, speed and coherence.'
        },
        operations: {
            title: 'Operations track',
            desc: 'Proves value in reality. Tracks error budgets, SLIs and SLOs, and reveals where the system is fragile or robust.'
        }
    };

    function pomToggleLayer(layer) {
        const teamsLayer = document.getElementById('pom-layer-teams');
        const loopsLayer = document.getElementById('pom-layer-loops');
        const residualityLayer = document.getElementById('pom-layer-residuality');

        teamsLayer.classList.add('opacity-0');
        loopsLayer.classList.add('opacity-0');
        residualityLayer.classList.add('opacity-0');
        archToggleResiduality(false);

        if (layer === 'teams') {
            teamsLayer.classList.remove('opacity-0');
        } else if (layer === 'loops') {
            loopsLayer.classList.remove('opacity-0');
        } else if (layer === 'residuality') {
            residualityLayer.classList.remove('opacity-0');
            archToggleResiduality(true);
        }
    }

    function pomShowTrackInfo(track) {
        const data = pomTrackData[track];
        const overlay = document.getElementById('pom-info-overlay');
        const titleEl = document.getElementById('pom-info-title');
        const descEl = document.getElementById('pom-info-desc');

        if (!data) return;
        titleEl.textContent = data.title;
        descEl.textContent = data.desc;
        overlay.classList.remove('opacity-0');

        setTimeout(() => overlay.classList.add('opacity-0'), 3600);
    }

    // Residuality overlay for architecture
    function archToggleResiduality(on) {
        const rt = document.getElementById('arch-layer-rt');
        if (!rt) return;
        if (on) rt.classList.remove('opacity-0');
        else rt.classList.add('opacity-0');
    }

    // Behavioral modes
    function pomToggleBehaviorMode(mode) {
        const overlay = document.getElementById('pom-behavior-overlay');
        const label = document.getElementById('pom-mode-label');
        const desc = document.getElementById('pom-mode-desc');
        const bg = document.getElementById('pom-mode-bg');

        const modes = {
            adaptive: {
                label: 'Adaptive mode',
                desc: 'Low residual exposure. Fast learning, stable flow. Good state for experiments and new bets.',
                color: 'rgba(16, 185, 129, 0.20)'
            },
            reinforced: {
                label: 'Reinforced mode',
                desc: 'System prepares for higher load or risk. We reinforce paved roads, tests and observability.',
                color: 'rgba(59, 130, 246, 0.20)'
            },
            overloaded: {
                label: 'Overloaded mode',
                desc: 'Cognitive or operational load is high. We constrain scope, reduce WIP and focus on stability.',
                color: 'rgba(234, 179, 8, 0.22)'
            },
            fragile: {
                label: 'Fragile mode',
                desc: 'Unknown unknowns and stressors dominate. We stop, stabilize, and redesign the system.',
                color: 'rgba(239, 68, 68, 0.25)'
            }
        };

        const m = modes[mode];
        if (!m) return;

        label.textContent = m.label;
        desc.textContent = m.desc;
        bg.setAttribute('fill', m.color);

        overlay.classList.remove('opacity-0');
        setTimeout(() => overlay.classList.add('opacity-0'), 4800);
    }

    // Context stress model
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
            adaptive: {
                label: 'Adaptive',
                color: 'bg-emerald-500',
                border: 'border-emerald-500/40',
                text: 'text-emerald-200'
            },
            reinforced: {
                label: 'Reinforced',
                color: 'bg-blue-500',
                border: 'border-blue-500/40',
                text: 'text-blue-200'
            },
            overloaded: {
                label: 'Overloaded',
                color: 'bg-yellow-400',
                border: 'border-yellow-500/40',
                text: 'text-yellow-100'
            },
            fragile: {
                label: 'Fragile',
                color: 'bg-red-500',
                border: 'border-red-500/40',
                text: 'text-red-200'
            }
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
                    <span class="px-2 py-1 rounded-full text-[10px] font-semibold ${modeCfg.text} border border-white/10 bg-slate-900/70">
                        ${modeCfg.label}
                    </span>
                </div>

                <div class="mt-2">
                    <div class="flex items-center justify-between mb-1 text-[10px] text-slate-400">
                        <span>Residual exposure</span>
                        <span>${percent} %</span>
                    </div>
                    <div class="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div class="h-2 ${modeCfg.color} transition-all duration-500" style="width: ${percent}%;"></div>
                    </div>
                </div>

                <div class="mt-3">
                    <p class="text-[11px] text-slate-400 mb-1">Main drivers:</p>
                    <ul class="text-[11px] text-slate-400 space-y-1">
                        ${ctx.drivers.map(d => `
                            <li class="flex gap-1">
                                <span class="mt-[4px] w-1.5 h-1.5 rounded-full ${modeCfg.color}"></span>
                                <span>${d}</span>
                            </li>`).join('')}
                    </ul>
                </div>
            `;

            container.appendChild(card);
        });
    }

    // Public hook for future telemetry integration
    function updateContextStress(contextName, newScore, newMode) {
        const ctx = contextStressModel[contextName];
        if (!ctx) return;
        if (typeof newScore === 'number') {
            ctx.score = Math.min(Math.max(newScore, 0), 1);
        }
        if (newMode) ctx.mode = newMode;
        renderContextStressGrid();
    }

    // ===============================
    //  Socio-Technical Architecture (STA)
    // ===============================
    const staLayerData = {
        5: {
            title: 'Layer 5 · Core Business Value Streams',
            desc: 'Stream-aligned teams own complete value streams end to end. They run Discovery, Delivery, and Operations for their bounded context. Direct accountability for customer outcomes. This layer has highest exposure to unknown unknowns.',
            contexts: 'FashionEyewear, CommerceFlow, VisionProfile, CustomerCare',
            teamType: 'Stream-Aligned Teams'
        },
        4: {
            title: 'Layer 4 · Transversal Services',
            desc: 'Shared operational capabilities serving multiple value streams. Mix of stream-aligned teams for simpler domains and complicated subsystem teams for high-complexity domains like ManufacturingOps and Odoo integration.',
            contexts: 'Inventory, ManufacturingOps, Logistics, Finance, Workforce',
            teamType: 'Stream-Aligned + Complicated Subsystem'
        },
        3: {
            title: 'Layer 3 · Vertical Enabling',
            desc: 'Enabling teams raise capabilities across all teams. They coach, transfer knowledge, and exit. No production ownership. Success is measured by independence of the teams they help.',
            contexts: 'DesignExperience, QualityAgile, Architecture guidance',
            teamType: 'Enabling Teams (Facilitation mode)'
        },
        2: {
            title: 'Layer 2 · Data Platform',
            desc: 'Platform team providing data infrastructure as a service. Data contracts, lineage, quality gates, and governance. Stream-aligned teams consume self-service data products without deep data engineering knowledge.',
            contexts: 'DataAIPlatform, Analytics, ML capabilities',
            teamType: 'Platform Team (X-as-a-Service)'
        },
        1: {
            title: 'Layer 1 · Technical Platform',
            desc: 'Foundation layer. Platform team owns infrastructure, identity, security, observability, and CI/CD. Everything is self-service. Paved roads reduce cognitive load for all layers above. Dampens residual uncertainty.',
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
        if (descEl) descEl.innerHTML = `
            ${data.desc}<br>
            <span class="text-slate-400 text-[10px] mt-1 block">
                <strong>Contexts:</strong> ${data.contexts}<br>
                <strong>Team type:</strong> ${data.teamType}
            </span>
        `;
    }

    function staSetMode(mode) {
        const ddoLayer = document.getElementById('sta-layer-ddo');
        const teamsLayer = document.getElementById('sta-layer-teams');
        const rtLayer = document.getElementById('sta-layer-rt');
        const titleEl = document.getElementById('sta-overlay-title');
        const descEl = document.getElementById('sta-overlay-desc');

        // Reset all overlays
        if (ddoLayer) ddoLayer.classList.add('opacity-0');
        if (teamsLayer) teamsLayer.classList.add('opacity-0');
        if (rtLayer) rtLayer.classList.add('opacity-0');

        const modeInfo = {
            standard: {
                title: 'Five-layer architecture',
                desc: 'Click any layer to see details. Use mode buttons to overlay DDO tracks, team topologies, or Residuality Theory visualization.'
            },
            ddo: {
                title: 'Discovery–Delivery–Operations tracks',
                desc: 'DDO runs vertically through all layers. Stream-aligned teams operate across all three tracks simultaneously. Insight, Feasibility, and Stability loops connect the tracks.'
            },
            teams: {
                title: 'Team Topologies overlay',
                desc: 'Four team types and four interaction modes. Stream-aligned teams own value end to end. Platform teams provide X-as-a-Service. Enabling teams use Facilitation mode to raise capabilities.'
            },
            residuality: {
                title: 'Residuality Theory overlay',
                desc: 'Unknown unknowns concentrate at the top (customer-facing layers). Stressors propagate through the fragility spine. Platform layers dampen residual uncertainty. Blast radius containment limits failure propagation.'
            }
        };

        const info = modeInfo[mode] || modeInfo.standard;
        if (titleEl) titleEl.textContent = info.title;
        if (descEl) descEl.textContent = info.desc;

        // Show appropriate overlay
        if (mode === 'ddo' && ddoLayer) {
            ddoLayer.classList.remove('opacity-0');
        } else if (mode === 'teams' && teamsLayer) {
            teamsLayer.classList.remove('opacity-0');
        } else if (mode === 'residuality' && rtLayer) {
            rtLayer.classList.remove('opacity-0');
        }
    }

    // ===============================
    //  Context Map Ownership Data
    // ===============================
    const contextData = {
        fashion: {
            name: 'FashionEyewearContext',
            layer: 'L5 · Core Business',
            team: 'Inspiration & Trust Team',
            topology: 'Stream-Aligned',
            topologyCode: 'SA',
            color: 'blue',
            icon: 'storefront',
            discovery: 'Product catalog strategy, trend analysis, brand positioning, customer segmentation, competitive benchmarking',
            delivery: 'Catalog management features, product display UX, recommendation algorithms, content workflows',
            operations: 'Catalog performance metrics, conversion tracking, inventory sync monitoring, content freshness SLAs',
            loops: 'Insight Loop (customer behavior → catalog strategy), Assumption Loop (trend hypotheses validation)'
        },
        commerce: {
            name: 'CommerceFlowContext',
            layer: 'L5 · Core Business',
            team: 'Commerce Flow Team',
            topology: 'Stream-Aligned',
            topologyCode: 'SA',
            color: 'blue',
            icon: 'shopping_cart',
            discovery: 'Funnel optimization research, pricing experiments, checkout UX discovery, payment method analysis',
            delivery: 'Cart & checkout features, pricing engine, promotions, payment integrations, order management',
            operations: 'Conversion funnel monitoring, payment success rates, cart abandonment tracking, revenue SLIs',
            loops: 'Stability Loop (payment failures → circuit breakers), Insight Loop (abandonment patterns → UX fixes)'
        },
        vision: {
            name: 'VisionProfileContext',
            layer: 'L5 · Core Business',
            team: 'Vision Profile Team',
            topology: 'Stream-Aligned',
            topologyCode: 'SA',
            color: 'blue',
            icon: 'visibility',
            discovery: 'Vision test flow research, prescription data quality, optometrist workflow analysis, regulatory compliance',
            delivery: 'Vision test flows, prescription management, lens recommendation engine, compliance features',
            operations: 'Test completion rates, prescription accuracy monitoring, regulatory audit trails, data quality SLOs',
            loops: 'Feasibility Loop (optometrist feedback → flow refinement), Assumption Loop (lens rec accuracy)'
        },
        care: {
            name: 'CustomerCareContext',
            layer: 'L5 · Core Business',
            team: 'Customer Care Team',
            topology: 'Stream-Aligned',
            topologyCode: 'SA',
            color: 'blue',
            icon: 'support_agent',
            discovery: 'Issue pattern analysis, customer satisfaction drivers, self-service opportunity mapping',
            delivery: 'Ticketing system, knowledge base, chat integration, escalation workflows, CSAT tooling',
            operations: 'First response time SLAs, resolution time tracking, CSAT monitoring, ticket deflection rates',
            loops: 'Insight Loop (ticket patterns → product fixes), Stability Loop (incident escalation → engineering)'
        },
        manufacturing: {
            name: 'ManufacturingOperationsContext',
            layer: 'L4 · Supporting',
            team: 'OPS – Manufacturing & Lab',
            topology: 'Complicated Subsystem',
            topologyCode: 'CS',
            color: 'red',
            icon: 'precision_manufacturing',
            discovery: 'Lab capacity modeling, equipment optimization, quality control process design, batch scheduling',
            delivery: 'MES integrations, lab workflow automation, quality gates, equipment monitoring, batch tracking',
            operations: 'Production throughput SLIs, defect rates, equipment uptime, lab queue management, RT stressor detection',
            loops: 'Stability Loop (equipment failures → maintenance), Feasibility Loop (capacity → order acceptance)'
        },
        logistics: {
            name: 'LogisticsContext',
            layer: 'L4 · Supporting',
            team: 'OPS – Logistics',
            topology: 'Stream-Aligned',
            topologyCode: 'SA',
            color: 'red',
            icon: 'local_shipping',
            discovery: 'Carrier performance analysis, route optimization, inventory placement strategy, delivery SLA design',
            delivery: 'Shipment tracking, carrier integrations, stock movement, warehouse management, returns processing',
            operations: 'Delivery success rates, carrier SLA monitoring, inventory accuracy, shipping cost tracking',
            loops: 'Insight Loop (delivery failures → carrier selection), Stability Loop (stock levels → replenishment)'
        },
        workforce: {
            name: 'WorkforceContext',
            layer: 'L4 · Supporting',
            team: 'Backoffice Ops',
            topology: 'Stream-Aligned',
            topologyCode: 'SA',
            color: 'red',
            icon: 'badge',
            discovery: 'Staff scheduling optimization, skill matrix design, workload forecasting, shift pattern analysis',
            delivery: 'Scheduling system, time tracking, skill management, shift swapping, attendance reporting',
            operations: 'Schedule adherence monitoring, overtime tracking, coverage SLAs, productivity metrics',
            loops: 'Feasibility Loop (demand forecast → staff scheduling), Insight Loop (attendance → scheduling rules)'
        },
        finance: {
            name: 'FinanceOpsContext',
            layer: 'L4 · Supporting',
            team: 'Backoffice Ops',
            topology: 'Stream-Aligned',
            topologyCode: 'SA',
            color: 'red',
            icon: 'account_balance',
            discovery: 'Reconciliation process design, compliance requirements, audit trail needs, reporting requirements',
            delivery: 'Invoice processing, payment reconciliation, tax compliance, financial reporting, audit trails',
            operations: 'Reconciliation accuracy, payment processing SLAs, compliance monitoring, month-end close tracking',
            loops: 'Stability Loop (reconciliation errors → data fixes), Insight Loop (variance patterns → process improvement)'
        },
        transversal: {
            name: 'Transversal Services Layer',
            layer: 'L4 · Supporting',
            team: 'Multiple Teams',
            topology: 'Hybrid',
            topologyCode: 'HY',
            color: 'red',
            icon: 'hub',
            discovery: 'Cross-domain capability needs, shared service patterns, integration requirements',
            delivery: 'Shared APIs, common libraries, cross-cutting features, integration adapters',
            operations: 'Service availability monitoring, cross-domain error tracking, integration health',
            loops: 'All loops converge here — acts as integration fabric between core and platform layers'
        },
        dataplatform: {
            name: 'Data Platform',
            layer: 'L2 · Data Platform',
            team: 'Data Platform Team',
            topology: 'Platform',
            topologyCode: 'PL',
            color: 'indigo',
            icon: 'database',
            discovery: 'Data product ideation, domain data needs analysis, data contract design, governance strategy',
            delivery: 'Data pipelines, DWH models, streaming infrastructure, data contracts, lineage tooling, semantic layer',
            operations: 'Pipeline health monitoring, data freshness SLAs, quality score tracking, cost optimization',
            loops: 'Insight Loop (Ops metrics → Discovery intelligence), X-as-a-Service (data products for all teams)'
        },
        techplatform: {
            name: 'Technical Platform',
            layer: 'L1 · Technical Platform',
            team: 'Technical Platform Team',
            topology: 'Platform',
            topologyCode: 'PL',
            color: 'green',
            icon: 'cloud',
            discovery: 'Developer experience research, tooling needs analysis, security posture assessment, infrastructure strategy',
            delivery: 'CI/CD pipelines, IaC modules, identity/IAM, observability stack, security controls, paved roads',
            operations: 'Platform availability SLOs, pipeline success rates, security incident monitoring, cost tracking',
            loops: 'X-as-a-Service (all teams consume), Stability Loop (infra incidents → platform hardening)'
        },
        enabling: {
            name: 'Vertical Enabling Layer',
            layer: 'L3 · Enabling',
            team: 'UX Enablement + Quality Enablement',
            topology: 'Enabling',
            topologyCode: 'EN',
            color: 'orange',
            icon: 'school',
            discovery: 'Capability gap analysis, coaching needs assessment, best practice research, tooling evaluation',
            delivery: 'Design system components, testing frameworks, quality patterns, accessibility standards, coaching programs',
            operations: 'Adoption metrics, capability maturity tracking, enablement engagement, practice health',
            loops: 'Facilitation mode — raises capability across all teams, then exits. Success = team independence.'
        }
    };

    function showContextDetail(contextId) {
        const ctx = contextData[contextId];
        if (!ctx) return;

        const panel = document.getElementById('sta-context-detail');
        const titleEl = document.getElementById('ctx-detail-title');
        const subtitleEl = document.getElementById('ctx-detail-subtitle');
        const iconEl = document.getElementById('ctx-detail-icon');
        const teamEl = document.getElementById('ctx-detail-team');
        const topoEl = document.getElementById('ctx-detail-topology');
        const discEl = document.getElementById('ctx-detail-discovery');
        const delEl = document.getElementById('ctx-detail-delivery');
        const opsEl = document.getElementById('ctx-detail-operations');
        const loopsEl = document.getElementById('ctx-detail-loops');

        // Update content
        titleEl.textContent = ctx.name;
        subtitleEl.textContent = `${ctx.layer} · ${ctx.topology}`;
        teamEl.textContent = ctx.team;
        topoEl.textContent = `Team Topology: ${ctx.topology}`;
        discEl.textContent = ctx.discovery;
        delEl.textContent = ctx.delivery;
        opsEl.textContent = ctx.operations;
        loopsEl.textContent = ctx.loops;

        // Update icon color
        const colorMap = {
            blue: ['bg-blue-500/20', 'text-blue-400'],
            red: ['bg-red-500/20', 'text-red-400'],
            indigo: ['bg-indigo-500/20', 'text-indigo-400'],
            green: ['bg-green-500/20', 'text-green-400'],
            orange: ['bg-orange-500/20', 'text-orange-400']
        };
        const [bgClass, textClass] = colorMap[ctx.color] || colorMap.blue;
        iconEl.className = `w-12 h-12 rounded-xl ${bgClass} flex items-center justify-center`;
        iconEl.innerHTML = `<span class="material-symbols-outlined ${textClass} text-2xl">${ctx.icon}</span>`;

        // Highlight the clicked context in SVG
        document.querySelectorAll('.ctx-clickable rect').forEach(rect => {
            rect.setAttribute('stroke-width', rect.getAttribute('stroke-width') === '3' ? '2' : rect.getAttribute('stroke-width'));
        });
        const clickedGroup = document.getElementById(`ctx-${contextId}`);
        if (clickedGroup) {
            const rect = clickedGroup.querySelector('rect');
            if (rect) rect.setAttribute('stroke-width', '4');
        }

        // Show panel
        panel.classList.remove('opacity-0', 'translate-y-4');
        panel.classList.add('opacity-100', 'translate-y-0');

        // Scroll to panel
        setTimeout(() => {
            panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }

    function closeContextDetail() {
        const panel = document.getElementById('sta-context-detail');
        panel.classList.add('opacity-0', 'translate-y-4');
        panel.classList.remove('opacity-100', 'translate-y-0');

        // Reset all stroke widths
        document.querySelectorAll('.ctx-clickable rect').forEach(rect => {
            const currentWidth = rect.getAttribute('stroke-width');
            if (currentWidth === '4') rect.setAttribute('stroke-width', '2');
        });
    }

    // ===============================
    //  Role POV Model (POV)
    // ===============================

    // Comprehensive role activities data
    const roleActivitiesData = {
        pm: {
            name: 'Product Manager',
            icon: 'target',
            color: 'blue',
            teamType: 'Stream-Aligned',
            discovery: {
                practices: ['Problem framing workshops', 'Customer interviews', 'JTBD mapping', 'Opportunity sizing'],
                techniques: ['Impact mapping', 'Assumption mapping', 'Hypothesis definition', 'OKR alignment'],
                tools: ['FigJam', 'Gemini', 'Google Analytics', 'Redash', 'Google Workspace']
            },
            delivery: {
                practices: ['Backlog refinement', 'Sprint planning', 'Triad syncs', 'Stakeholder updates'],
                techniques: ['Story slicing', 'INVEST criteria', 'Release planning', 'Go/No-go decisions'],
                tools: ['Gemini', 'ClickUp', 'Backstage', 'Slack', 'Mermaidjs']
            },
            operations: {
                practices: ['Metric reviews', 'Customer feedback triage', 'Incident post-mortems', 'Feature adoption tracking'],
                techniques: ['SLI/SLO analysis', 'Funnel analysis', 'Cohort analysis', 'A/B test interpretation'],
                tools: ['Google Analytics', 'Grafana', 'Redash', 'Zendesk', 'Fullstory']
            }
        },
        designer: {
            name: 'Product Designer',
            icon: 'palette',
            color: 'blue',
            teamType: 'Stream-Aligned',
            discovery: {
                practices: ['User research', 'Usability testing', 'Competitive analysis', 'Design sprints'],
                techniques: ['Personas', 'Journey mapping', 'Service blueprints', 'Card sorting'],
                tools: ['Figma', 'Maze', 'UserTesting', 'Gemini']
            },
            delivery: {
                practices: ['Design reviews', 'Dev handoffs', 'Design QA', 'Component documentation'],
                techniques: ['Atomic design', 'Design tokens', 'Responsive patterns', 'Accessibility audits'],
                tools: ['Figma', 'Storybook', 'Gemini', 'Chromatic', 'axe DevTools']
            },
            operations: {
                practices: ['UX metrics monitoring', 'Heatmap analysis', 'Session replay review', 'Design debt tracking'],
                techniques: ['Task success rate', 'Time-on-task', 'Error rate analysis', 'NPS correlation'],
                tools: ['Hotjar', 'FullStory', 'Google Analytics', 'Maze']
            }
        },
        eng: {
            name: 'Engineer (FE/BE)',
            icon: 'code',
            color: 'emerald',
            teamType: 'Stream-Aligned',
            discovery: {
                practices: ['Technical spikes', 'Domain modeling', 'RFC reviews', 'Tech debt assessment'],
                techniques: ['EventStorming', 'Bounded context mapping', 'API design', 'Data modeling'],
                tools: ['FigJam', 'Mermaidjs', 'Gemini', 'Swagger', 'Postman']
            },
            delivery: {
                practices: ['TDD', 'Code reviews', 'Pair programming', 'CI/CD pipeline maintenance'],
                techniques: ['Feature flags', 'Trunk-based development', 'Refactoring', 'Testing pyramid'],
                tools: ['GitHub', 'Jest', 'Playwright', 'Unleash', 'ArgoCD', 'Terraform']
            },
            operations: {
                practices: ['On-call rotations', 'Incident response', 'Performance tuning', 'Log analysis'],
                techniques: ['Observability (traces, logs, metrics)', 'Chaos engineering', 'Runbook creation', 'SLO maintenance'],
                tools: ['Grafana Stack', 'PagerDuty', 'Sentry', 'OTel']
            }
        },
        ptl: {
            name: 'Product Tech Lead',
            icon: 'architecture',
            color: 'blue',
            teamType: 'Stream-Aligned',
            discovery: {
                practices: ['Architecture reviews', 'Domain modeling sessions', 'Technical strategy', 'Risk assessment'],
                techniques: ['ADRs', 'C4 diagrams', 'Fitness functions', 'Trade-off analysis'],
                tools: ['Structurizr', 'FigJam', 'Mermaidjs', 'Gemini', 'GitHub Discussions']
            },
            delivery: {
                practices: ['Technical mentoring', 'Code architecture reviews', 'Cross-team alignment', 'Tech debt prioritization'],
                techniques: ['Evolutionary architecture', 'Strangler fig pattern', 'API versioning', 'Contract testing'],
                tools: ['SonarQube', 'Pact', 'GitHub', 'Backstage', 'Linear']
            },
            operations: {
                practices: ['System health reviews', 'Capacity planning', 'Post-mortem facilitation', 'SLO definition'],
                techniques: ['Error budget policies', 'Blast radius analysis', 'Dependency mapping', 'Failure mode analysis'],
                tools: ['Grafana Stack', 'Backstage', 'ServiceNow', 'PagerDuty']
            }
        },
        staff: {
            name: 'Staff+ Engineer',
            icon: 'psychology',
            color: 'purple',
            teamType: 'Enabling',
            discovery: {
                practices: ['Cross-domain architecture', 'Technology radar', 'Platform strategy', 'Capability mapping'],
                techniques: ['Wardley mapping', 'Technology selection frameworks', 'Build vs buy analysis', 'Migration planning'],
                tools: ['FigJam', 'ClickUp', 'Backstage', 'ThoughtWorks Radar', 'Structurizr']
            },
            delivery: {
                practices: ['Paved road creation', 'Large-scale refactoring', 'Cross-team enablement', 'Technical writing'],
                techniques: ['Golden paths', 'Platform primitives', 'Developer experience design', 'Inner source'],
                tools: ['Backstage', 'GitHub', 'ClickUp', 'Internal docs platforms']
            },
            operations: {
                practices: ['System-wide reliability', 'Cross-domain incident response', 'Platform observability', 'Organizational learning'],
                techniques: ['Resilience patterns', 'Chaos engineering strategy', 'Toil reduction', 'Automation ROI'],
                tools: ['Grafana Stack', 'Unleash', 'LitmusChaos', 'Gremlin']
            }
        },
        platform: {
            name: 'Platform Team',
            icon: 'cloud',
            color: 'cyan',
            teamType: 'Platform',
            discovery: {
                practices: ['Developer surveys', 'Pain point analysis', 'Platform roadmapping', 'Capability assessment'],
                techniques: ['Developer experience research', 'Platform as a product', 'Self-service design', 'API-first thinking'],
                tools: ['Backstage', 'Notion', 'Survey tools', 'Usage analytics']
            },
            delivery: {
                practices: ['IaC development', 'Pipeline templates', 'Security hardening', 'Documentation'],
                techniques: ['GitOps', 'Policy as code', 'Golden paths', 'Self-service portals'],
                tools: ['Terraform', 'Kubernetes', 'ArgoCD', 'GitHub Actions', 'Vault']
            },
            operations: {
                practices: ['Platform reliability', 'Cost optimization', 'Security monitoring', 'Compliance audits'],
                techniques: ['FinOps', 'Security posture management', 'Automated compliance', 'Capacity management'],
                tools: ['Datadog', 'Snyk', 'Prisma Cloud', 'Infracost', 'Kubecost']
            }
        },
        data: {
            name: 'Data Platform',
            icon: 'database',
            color: 'cyan',
            teamType: 'Platform',
            discovery: {
                practices: ['Data domain discovery', 'Data product ideation', 'Stakeholder interviews', 'Use case mapping'],
                techniques: ['Data mesh principles', 'Domain ownership model', 'Data contract design', 'Semantic layer planning'],
                tools: ['Notion', 'Miro', 'Data catalogs', 'Alation']
            },
            delivery: {
                practices: ['Pipeline development', 'Data modeling', 'Quality gate implementation', 'Documentation'],
                techniques: ['Medallion architecture', 'dbt modeling', 'Data contracts', 'Schema evolution'],
                tools: ['dbt', 'Airflow', 'BigQuery', 'Snowflake', 'Fivetran', 'Great Expectations']
            },
            operations: {
                practices: ['Pipeline monitoring', 'Data quality checks', 'Cost management', 'Incident response'],
                techniques: ['Data observability', 'Freshness SLAs', 'Lineage tracking', 'Anomaly detection'],
                tools: ['Monte Carlo', 'Datafold', 'Datadog', 'dbt Cloud', 'Atlan']
            }
        },
        servicedesk: {
            name: 'Service Desk',
            icon: 'support_agent',
            color: 'pink',
            teamType: 'Stream-Aligned',
            discovery: {
                practices: ['Issue pattern analysis', 'Customer feedback synthesis', 'Knowledge gap identification', 'Training needs assessment'],
                techniques: ['Root cause categorization', 'Trend identification', 'Voice of customer', 'Issue clustering'],
                tools: ['Zendesk', 'Intercom', 'Freshdesk', 'Excel/Sheets']
            },
            delivery: {
                practices: ['Runbook creation', 'Knowledge base maintenance', 'Training delivery', 'Process documentation'],
                techniques: ['Tiered support model', 'Escalation paths', 'Self-service enablement', 'FAQ optimization'],
                tools: ['Confluence', 'Notion', 'Zendesk Guide', 'Guru']
            },
            operations: {
                practices: ['Ticket triage', 'Incident escalation', 'Customer communication', 'SLA monitoring'],
                techniques: ['First response time optimization', 'Resolution time tracking', 'CSAT measurement', 'Ticket deflection'],
                tools: ['Zendesk', 'PagerDuty', 'Slack', 'Statuspage']
            }
        },
        qa: {
            name: 'QA Enablement',
            icon: 'verified',
            color: 'purple',
            teamType: 'Enabling',
            discovery: {
                practices: ['Risk assessment', 'Testability reviews', 'Quality strategy planning', 'Test coverage analysis'],
                techniques: ['Risk-based testing', 'Test pyramid design', 'Shift-left planning', 'Quality gates definition'],
                tools: ['Notion', 'TestRail', 'Xray', 'Confluence']
            },
            delivery: {
                practices: ['Test automation', 'CI/CD integration', 'Test coaching', 'Framework development'],
                techniques: ['BDD/TDD coaching', 'Contract testing', 'Visual regression', 'Performance testing'],
                tools: ['Playwright', 'Cypress', 'Jest', 'k6', 'Pact', 'Percy']
            },
            operations: {
                practices: ['Quality metrics monitoring', 'Bug pattern analysis', 'Production testing', 'Quality retrospectives'],
                techniques: ['Defect clustering', 'Escape analysis', 'Quality trend analysis', 'Test effectiveness metrics'],
                tools: ['Datadog', 'Sentry', 'TestRail', 'Grafana']
            }
        }
    };

    function povFilterRoles(teamType) {
        const cards = document.querySelectorAll('.pov-role-card');
        const buttons = document.querySelectorAll('.pov-filter-btn');

        // Update button states
        buttons.forEach(btn => btn.classList.remove('active'));
        event.currentTarget.classList.add('active');

        cards.forEach(card => {
            if (teamType === 'all') {
                card.style.display = 'block';
                card.style.opacity = '1';
            } else {
                const cardTeam = card.getAttribute('data-team');
                if (cardTeam === teamType) {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                } else {
                    card.style.display = 'none';
                }
            }
        });
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

        // Update header
        titleEl.textContent = role.name;
        subtitleEl.textContent = `${role.teamType} · Activities across Discovery, Delivery & Operations`;

        // Update icon color
        const colorMap = {
            blue: 'bg-blue-500/20',
            emerald: 'bg-emerald-500/20',
            cyan: 'bg-cyan-500/20',
            purple: 'bg-purple-500/20',
            pink: 'bg-pink-500/20'
        };
        const iconColorMap = {
            blue: 'text-blue-400',
            emerald: 'text-emerald-400',
            cyan: 'text-cyan-400',
            purple: 'text-purple-400',
            pink: 'text-pink-400'
        };
        iconEl.className = `w-12 h-12 rounded-xl ${colorMap[role.color]} flex items-center justify-center`;
        iconEl.innerHTML = `<span class="material-symbols-outlined ${iconColorMap[role.color]} text-2xl">${role.icon}</span>`;

        // Render track activities
        discoveryEl.innerHTML = renderTrackActivities(role.discovery, 'blue');
        deliveryEl.innerHTML = renderTrackActivities(role.delivery, 'emerald');
        operationsEl.innerHTML = renderTrackActivities(role.operations, 'pink');

        // Show panel with animation
        detailPanel.classList.remove('opacity-0', 'translate-y-4');
        detailPanel.classList.add('opacity-100', 'translate-y-0');

        // Highlight the clicked bubble
        document.querySelectorAll('.pov-role-bubble circle').forEach(circle => {
            circle.setAttribute('stroke-width', '2.5');
        });
        const clickedBubble = document.querySelector(`#role-${roleId} circle`);
        if (clickedBubble) {
            clickedBubble.setAttribute('stroke-width', '4');
        }

        // Scroll to detail panel
        setTimeout(() => {
            detailPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }

    function renderTrackActivities(trackData, color) {
        const colorClasses = {
            blue: 'text-blue-400',
            emerald: 'text-emerald-400',
            pink: 'text-pink-400'
        };
        const dotColor = colorClasses[color];

        return `
            <div class="mb-3">
                <p class="text-xs font-semibold ${dotColor} uppercase tracking-wide mb-1">Practices</p>
                <ul class="text-xs text-slate-300 space-y-0.5">
                    ${trackData.practices.map(p => `<li class="flex gap-1.5"><span class="${dotColor}">•</span>${p}</li>`).join('')}
                </ul>
            </div>
            <div class="mb-3">
                <p class="text-xs font-semibold ${dotColor} uppercase tracking-wide mb-1">Techniques</p>
                <ul class="text-xs text-slate-300 space-y-0.5">
                    ${trackData.techniques.map(t => `<li class="flex gap-1.5"><span class="${dotColor}">•</span>${t}</li>`).join('')}
                </ul>
            </div>
            <div>
                <p class="text-xs font-semibold ${dotColor} uppercase tracking-wide mb-1">Tools</p>
                <div class="flex flex-wrap gap-1">
                    ${trackData.tools.map(tool => `<span class="px-2 py-0.5 text-[10px] rounded-full bg-slate-800 text-slate-300 border border-slate-700">${tool}</span>`).join('')}
                </div>
            </div>
        `;
    }

    function povCloseRoleDetail() {
        const detailPanel = document.getElementById('pov-role-detail');
        detailPanel.classList.add('opacity-0', 'translate-y-4');
        detailPanel.classList.remove('opacity-100', 'translate-y-0');

        // Reset bubble highlights
        document.querySelectorAll('.pov-role-bubble circle').forEach(circle => {
            circle.setAttribute('stroke-width', '2.5');
        });
    }

    function povHighlightRole(role) {
        // Redirect to the new function
        povShowRoleActivities(role);
    }

    // Scroll reveal
    function isInViewport(el) {
        const rect = el.getBoundingClientRect();
        const threshold = (window.innerHeight || document.documentElement.clientHeight) * 0.85;
        return rect.top <= threshold;
    }

    function checkReveal() {
        document.querySelectorAll('.reveal-on-scroll').forEach(el => {
            if (isInViewport(el)) el.classList.add('revealed');
        });
    }

    window.addEventListener('scroll', checkReveal);
    window.addEventListener('load', () => {
        // Initial reveal
        checkReveal();
        renderContextStressGrid();

        // Nav animation
        if (window.gsap) {
            gsap.from('.view-switcher', {
                duration: 0.6,
                y: -30,
                opacity: 0,
                ease: 'power3.out'
            });
        }
    });

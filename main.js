// ==========================================================
// 1. ARTWORK DATA CATALOG
// ==========================================================
const artworks = [
    {
        id: "raven-01",
        title: "Raven Series // Visual Distortion 01",
        tags: "Natron • Processing • Chromatic Aberration",
        description: "Kinetic motion study exploring RGB channel splitting and dithered particle grids.",
        mediaType: "placeholder",
        src: ""
    },
    {
        id: "arthur-loop",
        title: "Arthur Loop // Algorithmic Bloom",
        tags: "Generative • Radial Geometry • 60 FPS",
        description: "Symmetrical shredding transition moving into organic radial bloom patterns.",
        mediaType: "placeholder",
        src: ""
    },
    {
        id: "spectral-grid",
        title: "Quantized Pulse",
        tags: "Processing • Custom Shaders",
        description: "High-contrast algorithmic grid manipulation with reactive particle dynamics.",
        mediaType: "placeholder",
        src: ""
    }
];

// Set dynamic current year in footer safely
const yearEl = document.getElementById('year');
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

// ==========================================================
// 2. GALLERY GRID RENDERER
// ==========================================================
const galleryGrid = document.getElementById('galleryGrid');

function renderGallery() {
    if (!galleryGrid) return;
    galleryGrid.innerHTML = '';
    
    artworks.forEach(art => {
        const card = document.createElement('div');
        card.className = 'art-card';
        card.innerHTML = `
            <div class="art-card-preview">
                <span style="color: var(--text-muted); font-family: var(--font-mono); font-size: 0.85rem;">
                    [ ${art.id} ]
                </span>
            </div>
            <div class="art-card-info">
                <h3 class="art-card-title">${art.title}</h3>
                <p class="art-card-tags">${art.tags}</p>
            </div>
        `;
        
        card.addEventListener('click', () => openModal(art));
        galleryGrid.appendChild(card);
    });
}

// ==========================================================
// 3. ARTWORK MODAL SYSTEM
// ==========================================================
const modal = document.getElementById('artworkModal');
const modalBody = document.getElementById('modalBody');
const closeModal = document.getElementById('closeModal');

function openModal(art) {
    if (!modal || !modalBody) return;
    modalBody.innerHTML = `
        <h2 style="margin-bottom: 0.5rem; font-size: 1.8rem;">${art.title}</h2>
        <p style="font-family: var(--font-mono); color: var(--accent); margin-bottom: 1.5rem;">${art.tags}</p>
        <div style="width: 100%; height: 300px; background: #000; display: flex; align-items: center; justify-content: center; border-radius: 6px; margin-bottom: 1.5rem;">
            <span style="font-family: var(--font-mono); color: var(--text-muted);">Preview Media Area (${art.id})</span>
        </div>
        <p style="color: var(--text-muted); font-size: 1rem;">${art.description}</p>
    `;
    modal.classList.remove('hidden');
}

if (closeModal) {
    closeModal.addEventListener('click', () => modal.classList.add('hidden'));
}
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');
    });
}

// ==========================================================
// 4. GENERATIVE KINETIC FIELD (HIGH-INTENSITY ABERRATION & 0.50 DASH OPACITY)
// ==========================================================
function initHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let grid = [];
    let cols = 0, rows = 0;
    const spacing = 36;

    const mouse = { x: -1000, y: -1000, vx: 0, vy: 0, lastX: -1000, lastY: -1000 };
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;

    function buildGrid() {
        grid = [];
        cols = Math.ceil(width / spacing) + 1;
        rows = Math.ceil(height / spacing) + 1;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                grid.push({
                    r, c,
                    baseX: c * spacing,
                    baseY: r * spacing,
                    x: c * spacing,
                    y: r * spacing,
                    vx: 0,
                    vy: 0,
                    symbol: (c + r) % 3 === 0 ? "V" : "—",
                    seed: (c * 73 + r * 149) % 1000,
                    sparkleGlow: 0
                });
            }
        }
    }

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        buildGrid();
    }

    window.addEventListener('resize', resize);
    
    // Viewport mouse velocity tracking
    window.addEventListener('mousemove', (e) => {
        const currentX = e.clientX;
        const currentY = e.clientY;

        mouse.vx = currentX - mouse.lastX;
        mouse.vy = currentY - mouse.lastY;

        mouse.x = currentX;
        mouse.y = currentY;

        mouse.lastX = currentX;
        mouse.lastY = currentY;
    });

    // Scroll listener with boundary rebound
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const deltaY = currentScrollY - lastScrollY;

        if (currentScrollY <= 0 && deltaY < 0) {
            scrollVelocity = Math.abs(scrollVelocity) * 0.4 + 5;
        } else if (currentScrollY >= maxScroll - 2 && deltaY > 0) {
            scrollVelocity = -Math.abs(scrollVelocity) * 0.4 - 5;
        } else {
            scrollVelocity += deltaY * 0.35;
        }

        lastScrollY = currentScrollY;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    resize();

    function animate() {
        ctx.fillStyle = '#050508';
        ctx.fillRect(0, 0, width, height);

        ctx.font = '700 12px "Space Mono", monospace, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        scrollVelocity *= 0.80;
        const absScrollVel = Math.abs(scrollVelocity);

        mouse.vx *= 0.85;
        mouse.vy *= 0.85;
        const mouseSpeed = Math.hypot(mouse.vx, mouse.vy);

        const time = Date.now() * 0.0012;

        // Scanline glitch slices
        const activeGlitches = [];
        if (absScrollVel > 1.2) {
            const glitchCount = Math.min(Math.floor(absScrollVel * 0.25), 4);
            for (let g = 0; g < glitchCount; g++) {
                if (Math.random() < 0.4) {
                    const sliceY = Math.random() * height;
                    const sliceH = 12 + Math.random() * 32;
                    const shiftX = (Math.random() - 0.5) * Math.min(absScrollVel * 2.2, 28);
                    activeGlitches.push({ minY: sliceY, maxY: sliceY + sliceH, shiftX });
                }
            }
        }

        const hoverRadius = 240;

        // Pass 1: Compute sparse fairy light sparkle
        for (let i = 0; i < grid.length; i++) {
            const p = grid[i];
            p.sparkleGlow = 0;

            if (p.symbol === "V") {
                const t1 = time * 1.3 + p.seed * 0.17;
                const t2 = time * 0.7 + p.seed * 0.31;
                const wave = Math.sin(t1) * Math.cos(t2);

                if (wave > 0.72) {
                    p.sparkleGlow = Math.pow((wave - 0.72) / 0.28, 1.8);
                }
            }
        }

        // Pass 2: Main physics & render loop
        for (let i = 0; i < grid.length; i++) {
            const p = grid[i];

            // 1. Scanline glitch displacement
            let glitchX = 0;
            for (let g = 0; g < activeGlitches.length; g++) {
                if (p.y >= activeGlitches[g].minY && p.y <= activeGlitches[g].maxY) {
                    glitchX = activeGlitches[g].shiftX;
                    break;
                }
            }

            // Background scroll wave
            p.vy -= scrollVelocity * 0.02;

            // Cursor attraction + rotational vortex force
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.hypot(dx, dy);

            if (dist < hoverRadius && dist > 0) {
                const normDist = dist / hoverRadius;
                const smoothFactor = Math.pow(1 - normDist, 2.5);

                const angle = Math.atan2(dy, dx);
                const impulse = smoothFactor * 10;

                // Radial repulsion
                p.vx -= Math.cos(angle) * impulse;
                p.vy -= Math.sin(angle) * impulse;

                // Rotational vortex spin
                if (mouseSpeed > 0.1) {
                    const spinFactor = smoothFactor * Math.min(mouseSpeed * 0.08, 2.5);
                    const tangentAngle = angle + Math.PI / 2;
                    p.vx += Math.cos(tangentAngle) * spinFactor;
                    p.vy += Math.sin(tangentAngle) * spinFactor;
                }

                p.vy -= scrollVelocity * smoothFactor * 0.3;
            }

            // Spring return force
            const springDx = p.baseX - p.x;
            const springDy = p.baseY - p.y;

            p.vx += springDx * 0.075;
            p.vy += springDy * 0.075;

            p.vx *= 0.81;
            p.vy *= 0.81;

            p.x += p.vx;
            p.y += p.vy;

            const displacement = Math.hypot(p.x - p.baseX, p.y - p.baseY);
            const activity = Math.min(displacement / 16, 1.0);
            const isNearCursor = dist < hoverRadius;

            if (p.symbol === "V") {
                const renderX = p.x + glitchX;
                const renderY = p.y;

                if (isNearCursor || activity > 0.05) {
                    // Hover/Kinetic State with Enhanced Chromatic Aberration
                    const normDist = isNearCursor ? dist / hoverRadius : 1.0;
                    const proximity = isNearCursor ? Math.pow(1 - normDist, 2) : 0;
                    const intensity = Math.max(proximity, activity);

                    // Increased channel offset spread (up to 8.0px)
                    const splitOffset = Math.min(displacement * 0.35 + absScrollVel * 0.08 + proximity * 5.0, 8.0);

                    // Cyan Offset Channel
                    ctx.fillStyle = `rgba(0, 240, 255, ${0.30 + intensity * 0.55})`;
                    ctx.fillText(p.symbol, renderX + splitOffset, renderY + splitOffset * 0.3);

                    // Red Offset Channel
                    ctx.fillStyle = `rgba(255, 30, 80, ${0.40 + intensity * 0.55})`;
                    ctx.fillText(p.symbol, renderX - splitOffset, renderY - splitOffset * 0.3);

                    // Core Neon Pink/Red Text
                    ctx.fillStyle = `rgba(255, 60, 110, ${0.60 + intensity * 0.40})`;
                    ctx.fillText(p.symbol, renderX, renderY);

                } else if (p.sparkleGlow > 0) {
                    // Sparse Fairy Light Twinkle
                    ctx.fillStyle = `rgba(255, 40, 90, ${0.15 + p.sparkleGlow * 0.35})`;
                    ctx.fillText(p.symbol, renderX - 0.8, renderY);

                    ctx.fillStyle = `rgba(255, 120, 150, ${0.35 + p.sparkleGlow * 0.65})`;
                    ctx.fillText(p.symbol, renderX, renderY);

                } else {
                    // Clean Idle 'V'
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.20)';
                    ctx.fillText(p.symbol, renderX, renderY);
                }

            } else {
                // '—' (EM DASH) - BASE OPACITY SET TO 0.50 + UPGRADED CHROMATIC ABERRATION

                // Check 4 adjacent neighbors for sparkling 'V'
                let neighborSparkle = 0;
                const neighbors = [
                    (p.r - 1) * cols + p.c,
                    (p.r + 1) * cols + p.c,
                    p.r * cols + (p.c - 1),
                    p.r * cols + (p.c + 1)
                ];

                for (let n = 0; n < neighbors.length; n++) {
                    const idx = neighbors[n];
                    if (idx >= 0 && idx < grid.length) {
                        if (grid[idx].symbol === "V" && grid[idx].sparkleGlow > neighborSparkle) {
                            neighborSparkle = grid[idx].sparkleGlow;
                        }
                    }
                }

                let dashGlitchX = 0;
                if (neighborSparkle > 0.05) {
                    dashGlitchX = (Math.random() - 0.5) * (4.5 * neighborSparkle);
                }

                const renderX = p.x + glitchX + dashGlitchX;
                const renderY = p.y;

                if (isNearCursor) {
                    // High-Contrast Cursor Hover Aberration
                    const normDist = dist / hoverRadius;
                    const proximity = Math.pow(1 - normDist, 2);
                    const splitOffset = Math.min(displacement * 0.35 + absScrollVel * 0.08 + proximity * 6.0, 9.0);

                    // Cyan Offset
                    ctx.fillStyle = `rgba(0, 240, 255, ${0.45 + proximity * 0.50})`;
                    ctx.fillText(p.symbol, renderX + splitOffset, renderY + splitOffset * 0.3);

                    // Red Offset
                    ctx.fillStyle = `rgba(255, 30, 80, ${0.45 + proximity * 0.50})`;
                    ctx.fillText(p.symbol, renderX - splitOffset, renderY - splitOffset * 0.3);

                    // Core White Text
                    ctx.fillStyle = `rgba(255, 255, 255, ${0.70 + proximity * 0.30})`;
                    ctx.fillText(p.symbol, renderX, renderY);

                } else if (neighborSparkle > 0.05) {
                    // Enhanced Sympathetic Aberration + Glitch when neighbor 'V' sparkles
                    const splitOffset = 4.5 * neighborSparkle;

                    // Cyan channel split
                    ctx.fillStyle = `rgba(0, 240, 255, ${0.50 * neighborSparkle})`;
                    ctx.fillText(p.symbol, renderX + splitOffset, renderY);

                    // Red channel split
                    ctx.fillStyle = `rgba(255, 30, 80, ${0.60 * neighborSparkle})`;
                    ctx.fillText(p.symbol, renderX - splitOffset, renderY);

                    // Core text
                    ctx.fillStyle = `rgba(255, 255, 255, ${0.50 + neighborSparkle * 0.40})`;
                    ctx.fillText(p.symbol, renderX, renderY);

                } else if (activity > 0.05) {
                    // Kinetic Trail state
                    ctx.fillStyle = `rgba(255, 255, 255, ${0.50 + activity * 0.40})`;
                    ctx.fillText(p.symbol, renderX, renderY);

                } else {
                    // Idle state set to 0.50 Opacity
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.50)';
                    ctx.fillText(p.symbol, renderX, renderY);
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    renderGallery();
    initHeroCanvas();
});
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
// 4. GENERATIVE KINETIC RGB FIELD (V & — SYMBOLS)
// ==========================================================
function initHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let grid = [];
    const spacing = 36;

    const mouse = { x: -1000, y: -1000, vx: 0, vy: 0, lastX: -1000, lastY: -1000 };
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;

    function buildGrid() {
        grid = [];
        const cols = Math.ceil(width / spacing) + 1;
        const rows = Math.ceil(height / spacing) + 1;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                grid.push({
                    baseX: c * spacing,
                    baseY: r * spacing,
                    x: c * spacing,
                    y: r * spacing,
                    vx: 0,
                    vy: 0,
                    symbol: (c + r) % 3 === 0 ? "V" : "—"
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

    function drawSymbolNode(x, y, symbol, color, streak = 0) {
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = color;

        if (streak > 0) {
            ctx.scale(1, 1 + streak * 0.15);
        }

        ctx.fillText(symbol, 0, 0);
        ctx.restore();
    }

    function animate() {
        ctx.fillStyle = '#050508';
        ctx.fillRect(0, 0, width, height);

        // Pre-configure static text properties once per frame for max performance
        ctx.font = '700 12px "Space Mono", monospace, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        scrollVelocity *= 0.80;
        const absScrollVel = Math.abs(scrollVelocity);

        // Smoothly decay mouse movement velocity
        mouse.vx *= 0.85;
        mouse.vy *= 0.85;
        const mouseSpeed = Math.hypot(mouse.vx, mouse.vy);

        // Scanline glitch slices during scroll
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

            // 2. Background scroll wave
            p.vy -= scrollVelocity * 0.02;

            // 3. Cursor attraction + slow rotational vortex force when cursor moves
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

                // Rotational vortex spin when mouse moves
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

            const renderX = p.x + glitchX;
            const renderY = p.y;

            const displacement = Math.hypot(p.x - p.baseX, p.y - p.baseY);
            const activity = Math.min(displacement / 18, 1.0);

            const splitOffset = Math.min(displacement * 0.4 + absScrollVel * 0.08, 10);
            const streak = Math.min(absScrollVel * 0.2, 5);

            // Vibrant, high-saturation color palette
            if (displacement < 0.3 && streak < 0.3 && Math.abs(glitchX) < 0.5) {
                drawSymbolNode(renderX, renderY, p.symbol, 'rgba(180, 245, 255, 0.38)', 0);
            } else {
                const isGlitched = Math.abs(glitchX) > 0.5;
                const redAlpha = isGlitched ? 0.85 : (0.35 + activity * 0.55);
                const cyanAlpha = isGlitched ? 0.85 : (0.35 + activity * 0.55);
                const coreAlpha = 0.45 + activity * 0.55;

                // RED Channel
                drawSymbolNode(
                    renderX - splitOffset,
                    renderY - splitOffset * 0.4,
                    p.symbol,
                    `rgba(255, 30, 90, ${redAlpha})`,
                    streak
                );

                // CYAN Channel
                drawSymbolNode(
                    renderX + splitOffset,
                    renderY + splitOffset * 0.4,
                    p.symbol,
                    `rgba(0, 240, 255, ${cyanAlpha})`,
                    streak
                );

                // WHITE Core
                drawSymbolNode(
                    renderX,
                    renderY,
                    p.symbol,
                    `rgba(255, 255, 255, ${coreAlpha})`,
                    streak * 0.2
                );
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

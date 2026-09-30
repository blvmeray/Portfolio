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
// 4. GENERATIVE KINETIC RGB FIELD (HIGH FPS SPRITE-CACHED + LIGHT RIPPLE)
// ==========================================================
function initHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let grid = [];
    const spacing = 38;
    let time = 0;

    const mouse = { x: -1000, y: -1000, vx: 0, vy: 0, lastX: -1000, lastY: -1000 };
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;

    // ------------------------------------------------------
    // HIGH PERFORMANCE SPRITE CACHE (Pre-render vector text)
    // ------------------------------------------------------
    const sprites = {};

    function createSymbolSprite(symbol, fontSize, color) {
        const sCanvas = document.createElement('canvas');
        const dim = Math.ceil(fontSize * 2.8);
        sCanvas.width = dim;
        sCanvas.height = dim;
        const sCtx = sCanvas.getContext('2d');

        sCtx.font = `700 ${fontSize}px "Space Mono", monospace, sans-serif`;
        sCtx.textAlign = 'center';
        sCtx.textBaseline = 'middle';
        sCtx.fillStyle = color;
        sCtx.fillText(symbol, dim / 2, dim / 2);

        return { canvas: sCanvas, halfDim: dim / 2 };
    }

    function initSprites() {
        const colors = {
            base: 'rgba(180, 245, 255, 1)',
            red: 'rgb(255, 30, 90)',
            cyan: 'rgb(0, 240, 255)',
            white: 'rgb(255, 255, 255)'
        };

        ['V', '—'].forEach(sym => {
            const size = sym === 'V' ? 11 : 13;
            sprites[sym] = {};
            Object.keys(colors).forEach(key => {
                sprites[sym][key] = createSymbolSprite(sym, size, colors[key]);
            });
        });
    }

    initSprites();

    function buildGrid() {
        grid = [];
        const cols = Math.ceil(width / spacing) + 1;
        const rows = Math.ceil(height / spacing) + 1;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const isV = (c + r) % 3 === 0;
                grid.push({
                    baseX: c * spacing,
                    baseY: r * spacing,
                    x: c * spacing,
                    y: r * spacing,
                    vx: 0,
                    vy: 0,
                    angle: (c * 0.3 + r * 0.3) % (Math.PI * 2),
                    symbol: isV ? "V" : "—",
                    spinDir: (c + r) % 2 === 0 ? 1 : -1
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
    
    // Viewport mouse tracking
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

    // Fast GPU-accelerated sprite draw call
    function drawSprite(x, y, spriteObj, alpha, angle = 0, scaleY = 1) {
        if (alpha <= 0.01) return;
        ctx.save();
        ctx.translate(x, y);
        if (angle !== 0) ctx.rotate(angle);
        if (scaleY !== 1) ctx.scale(1, scaleY);
        ctx.globalAlpha = alpha;
        ctx.drawImage(spriteObj.canvas, -spriteObj.halfDim, -spriteObj.halfDim);
        ctx.restore();
    }

    function animate() {
        time += 0.025; // Global timer for expanding light rings

        ctx.fillStyle = '#050508';
        ctx.fillRect(0, 0, width, height);

        scrollVelocity *= 0.80;
        const absScrollVel = Math.abs(scrollVelocity);

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

            // 1. Scanline glitch offset
            let glitchX = 0;
            for (let g = 0; g < activeGlitches.length; g++) {
                if (p.y >= activeGlitches[g].minY && p.y <= activeGlitches[g].maxY) {
                    glitchX = activeGlitches[g].shiftX;
                    break;
                }
            }

            // 2. Scroll impulse
            p.vy -= scrollVelocity * 0.02;

            // 3. Cursor distance & light ripple equation
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.hypot(dx, dy);

            // Circular breathing light wave radiating outwards from cursor
            const rippleWave = (Math.sin(dist * 0.025 - time * 3.2) + 1) * 0.5; // Smooth 0.0 to 1.0 range
            const waveGlow = Math.max(0, (1 - dist / 700)) * rippleWave * 0.35;

            let spinRate = 0.003 * p.spinDir;

            if (dist < hoverRadius && dist > 0) {
                const normDist = dist / hoverRadius;
                const smoothFactor = Math.pow(1 - normDist, 2.5);

                const angle = Math.atan2(dy, dx);
                const impulse = smoothFactor * 10;

                // Radial displacement
                p.vx -= Math.cos(angle) * impulse;
                p.vy -= Math.sin(angle) * impulse;

                // Continuous static & active vortex rotation
                const staticSpin = smoothFactor * 0.04 * p.spinDir;
                const activeSpin = smoothFactor * Math.min(mouseSpeed * 0.08, 2.2);
                spinRate += staticSpin + activeSpin;

                // Orbital velocity force
                const tangentAngle = angle + Math.PI / 2;
                const vortexForce = smoothFactor * (0.8 + Math.min(mouseSpeed * 0.05, 2.0));
                p.vx += Math.cos(tangentAngle) * vortexForce;
                p.vy += Math.sin(tangentAngle) * vortexForce;

                p.vy -= scrollVelocity * smoothFactor * 0.3;
            }

            p.angle += spinRate;

            // Spring return force back to base anchor positions
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
            const streakScaleY = 1 + streak * 0.15;

            const symSprites = sprites[p.symbol];

            // Render sprites efficiently
            if (displacement < 0.3 && streak < 0.3 && Math.abs(glitchX) < 0.5) {
                const idleAlpha = Math.min(0.38 + waveGlow, 0.85);
                drawSprite(renderX, renderY, symSprites.base, idleAlpha, p.angle, 1);
            } else {
                const isGlitched = Math.abs(glitchX) > 0.5;
                const redAlpha = isGlitched ? 0.85 : Math.min(0.35 + activity * 0.55 + waveGlow, 0.95);
                const cyanAlpha = isGlitched ? 0.85 : Math.min(0.35 + activity * 0.55 + waveGlow, 0.95);
                const coreAlpha = Math.min(0.45 + activity * 0.55 + waveGlow, 0.95);

                // RED Channel
                drawSprite(
                    renderX - splitOffset,
                    renderY - splitOffset * 0.4,
                    symSprites.red,
                    redAlpha,
                    p.angle,
                    streakScaleY
                );

                // CYAN Channel
                drawSprite(
                    renderX + splitOffset,
                    renderY + splitOffset * 0.4,
                    symSprites.cyan,
                    cyanAlpha,
                    p.angle,
                    streakScaleY
                );

                // WHITE Core
                drawSprite(
                    renderX,
                    renderY,
                    symSprites.white,
                    coreAlpha,
                    p.angle,
                    1 + streak * 0.05
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
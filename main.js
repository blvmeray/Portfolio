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
// 4. GENERATIVE KINETIC RGB FIELD (ULTRA 60 FPS OPTIMIZED)
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
    let mouseActivity = 0; // 0 = static cursor, 1 = moving cursor
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;

    // ------------------------------------------------------
    // HIGH PERFORMANCE SPRITE CACHE
    // ------------------------------------------------------
    const sprites = {};

    function createSymbolSprite(symbol, fontSize, color) {
        const sCanvas = document.createElement('canvas');
        const dim = Math.ceil(fontSize * 2.5);
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
                    angle: 0,
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
    
    // Mouse tracking
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

    // Scroll listener with smooth momentum rebound
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const deltaY = currentScrollY - lastScrollY;

        if (currentScrollY <= 0 && deltaY < 0) {
            scrollVelocity = Math.abs(scrollVelocity) * 0.4 + 4;
        } else if (currentScrollY >= maxScroll - 2 && deltaY > 0) {
            scrollVelocity = -Math.abs(scrollVelocity) * 0.4 - 4;
        } else {
            scrollVelocity += deltaY * 0.25;
        }

        lastScrollY = currentScrollY;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    resize();

    // Fast GPU draw helper (bypasses transform stack when unrotated)
    function drawSpriteFast(x, y, spriteObj, alpha, angle = 0) {
        if (alpha <= 0.01) return;
        ctx.globalAlpha = alpha;
        
        if (angle === 0) {
            ctx.drawImage(spriteObj.canvas, x - spriteObj.halfDim, y - spriteObj.halfDim);
        } else {
            ctx.setTransform(1, 0, 0, 1, x, y);
            ctx.rotate(angle);
            ctx.drawImage(spriteObj.canvas, -spriteObj.halfDim, -spriteObj.halfDim);
        }
    }

    const hoverRadius = 220;
    const hoverRadiusSq = hoverRadius * hoverRadius;

    function animate() {
        time += 0.025;

        // Reset canvas background efficiently
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = '#050508';
        ctx.fillRect(0, 0, width, height);

        scrollVelocity *= 0.82;
        const absScrollVel = Math.abs(scrollVelocity);

        mouse.vx *= 0.82;
        mouse.vy *= 0.82;
        const mouseSpeed = Math.hypot(mouse.vx, mouse.vy);

        // Smooth cursor movement state: 0 = Still, 1 = Moving
        const isMoving = mouseSpeed > 0.3;
        mouseActivity += ((isMoving ? 1.0 : 0.0) - mouseActivity) * 0.08;
        const staticFactor = 1 - mouseActivity;

        // Glitch slice generation
        const activeGlitches = [];
        if (absScrollVel > 2.0) {
            const glitchCount = Math.min(Math.floor(absScrollVel * 0.2), 3);
            for (let g = 0; g < glitchCount; g++) {
                if (Math.random() < 0.35) {
                    const sliceY = Math.random() * height;
                    const sliceH = 16 + Math.random() * 28;
                    const shiftX = (Math.random() - 0.5) * Math.min(absScrollVel * 1.8, 24);
                    activeGlitches.push({ minY: sliceY, maxY: sliceY + sliceH, shiftX });
                }
            }
        }

        const gridLen = grid.length;

        for (let i = 0; i < gridLen; i++) {
            const p = grid[i];

            // 1. Glitch displacement check
            let glitchX = 0;
            if (activeGlitches.length > 0) {
                for (let g = 0; g < activeGlitches.length; g++) {
                    if (p.y >= activeGlitches[g].minY && p.y <= activeGlitches[g].maxY) {
                        glitchX = activeGlitches[g].shiftX;
                        break;
                    }
                }
            }

            // 2. Scroll velocity impulse
            p.vy -= scrollVelocity * 0.018;

            // 3. Fast squared distance calculation to cursor
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const distSq = dx * dx + dy * dy;

            let waveGlow = 0;

            // Circular light wave breathing outward (Active when cursor is STILL)
            if (staticFactor > 0.05 && distSq < 560000) { // ~750px max light reach
                const dist = Math.sqrt(distSq);
                const rippleWave = (Math.sin(dist * 0.025 - time * 3.2) + 1) * 0.5;
                waveGlow = Math.max(0, (1 - dist / 750)) * rippleWave * 0.4 * staticFactor;
            }

            // Cursor proximity dynamics
            if (distSq < hoverRadiusSq && distSq > 0) {
                const dist = Math.sqrt(distSq);
                const normDist = dist / hoverRadius;
                const smoothFactor = Math.pow(1 - normDist, 2.5);

                const angle = Math.atan2(dy, dx);
                const impulse = smoothFactor * 9;

                // Repulsion
                p.vx -= Math.cos(angle) * impulse;
                p.vy -= Math.sin(angle) * impulse;

                // Static Halo Spin vs Active Motion Vortex Spin
                const staticSpin = smoothFactor * 0.04 * p.spinDir * staticFactor;
                const activeSpin = smoothFactor * Math.min(mouseSpeed * 0.08, 2.0) * mouseActivity;
                p.angle += staticSpin + activeSpin;

                // Orbital tangent force
                const tangentAngle = angle + Math.PI / 2;
                const vortexForce = smoothFactor * (0.8 + Math.min(mouseSpeed * 0.05, 1.8));
                p.vx += Math.cos(tangentAngle) * vortexForce;
                p.vy += Math.sin(tangentAngle) * vortexForce;

                p.vy -= scrollVelocity * smoothFactor * 0.25;
            } else {
                // Decay node angle back to 0 when outside cursor radius
                p.angle *= 0.92;
            }

            // Spring return physics back to home grid position
            p.vx += (p.baseX - p.x) * 0.075;
            p.vy += (p.baseY - p.y) * 0.075;

            p.vx *= 0.81;
            p.vy *= 0.81;

            p.x += p.vx;
            p.y += p.vy;

            const renderX = p.x + glitchX;
            const renderY = p.y;

            // Displacement distance from base
            const dispX = p.x - p.baseX;
            const dispY = p.y - p.baseY;
            const displacementSq = dispX * dispX + dispY * dispY;

            const symSprites = sprites[p.symbol];

            // RENDER PASS:
            // Single sprite draw by default; RGB channel split ONLY when node is physically displaced or glitched
            if (displacementSq < 1.0 && Math.abs(glitchX) < 0.5) {
                const idleAlpha = Math.min(0.38 + waveGlow, 0.85);
                drawSpriteFast(renderX, renderY, symSprites.base, idleAlpha, p.angle);
            } else {
                const displacement = Math.sqrt(displacementSq);
                const activity = Math.min(displacement / 18, 1.0);
                const splitOffset = Math.min(displacement * 0.4 + absScrollVel * 0.05, 8);

                const isGlitched = Math.abs(glitchX) > 0.5;
                const redAlpha = isGlitched ? 0.85 : Math.min(0.35 + activity * 0.55 + waveGlow, 0.95);
                const cyanAlpha = isGlitched ? 0.85 : Math.min(0.35 + activity * 0.55 + waveGlow, 0.95);
                const coreAlpha = Math.min(0.45 + activity * 0.55 + waveGlow, 0.95);

                // RED Channel
                drawSpriteFast(
                    renderX - splitOffset,
                    renderY - splitOffset * 0.4,
                    symSprites.red,
                    redAlpha,
                    p.angle
                );

                // CYAN Channel
                drawSpriteFast(
                    renderX + splitOffset,
                    renderY + splitOffset * 0.4,
                    symSprites.cyan,
                    cyanAlpha,
                    p.angle
                );

                // WHITE Core
                drawSpriteFast(
                    renderX,
                    renderY,
                    symSprites.white,
                    coreAlpha,
                    p.angle
                );
            }
        }

        // Reset transform state for next frame
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        requestAnimationFrame(animate);
    }

    animate();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    renderGallery();
    initHeroCanvas();
});
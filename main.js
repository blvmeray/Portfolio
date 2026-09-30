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
// 4. FULL-PAGE GENERATIVE KINETIC RGB FIELD (HIGH-IMPACT SCROLL)
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
                    size: (c % 2 === 0 && r % 2 === 0) ? 4 : 2,
                    isCross: (c + r) % 3 === 0
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

    // High-sensitivity scroll velocity listener
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const deltaY = currentScrollY - lastScrollY;
        // Amplified scroll impulse multiplier
        scrollVelocity += deltaY * 2.8;
        lastScrollY = currentScrollY;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    resize();

    // Render node with vertical streak trails
    function drawNode(x, y, size, isCross, color, streak = 0) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.beginPath();

        const topY = y - size - streak;
        const bottomY = y + size + streak;

        if (isCross) {
            ctx.moveTo(x - size, y);
            ctx.lineTo(x + size, y);
            ctx.moveTo(x, topY);
            ctx.lineTo(x, bottomY);
        } else {
            ctx.moveTo(x - size * 0.8, topY);
            ctx.lineTo(x + size * 0.8, bottomY);
        }

        ctx.stroke();
    }

    function animate() {
        ctx.fillStyle = '#050508';
        ctx.fillRect(0, 0, width, height);

        // Slightly longer decay to keep scroll energy visible while moving down
        scrollVelocity *= 0.88;
        const absScrollVel = Math.abs(scrollVelocity);

        const hoverRadius = 220;
        const forceFactor = 0.35;

        for (let i = 0; i < grid.length; i++) {
            const p = grid[i];

            // 1. Global scroll displacement force on every node
            p.vy -= scrollVelocity * 0.12;

            // 2. Cursor local proximity force
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.hypot(dx, dy);

            if (dist < hoverRadius && dist > 0) {
                const force = (1 - dist / hoverRadius) * forceFactor;
                const angle = Math.atan2(dy, dx);

                p.vx -= Math.cos(angle) * force * 8;
                p.vy -= Math.sin(angle) * force * 8;

                // Extra vertical distortion kick right under the cursor when scrolling
                p.vy -= scrollVelocity * force * 0.85;
            }

            // Spring return force back to base grid coordinates
            const springDx = p.baseX - p.x;
            const springDy = p.baseY - p.y;

            p.vx += springDx * 0.08;
            p.vy += springDy * 0.08;

            p.vx *= 0.80;
            p.vy *= 0.80;

            p.x += p.vx;
            p.y += p.vy;

            // Chromatic Separation & Vertical Motion Blur Streaks
            const displacement = Math.hypot(p.x - p.baseX, p.y - p.baseY);
            const splitOffset = Math.min(displacement * 0.45 + absScrollVel * 0.65, 32);
            const streak = Math.min(absScrollVel * 1.8, 45);

            if (splitOffset < 0.4 && streak < 0.4) {
                drawNode(p.x, p.y, p.size, p.isCross, 'rgba(255, 255, 255, 0.18)', 0);
            } else {
                // RED Channel Offset
                drawNode(
                    p.x - splitOffset,
                    p.y - splitOffset * 0.5,
                    p.size + splitOffset * 0.2,
                    p.isCross,
                    `rgba(255, 45, 85, ${0.45 + splitOffset * 0.03})`,
                    streak
                );

                // CYAN Channel Offset
                drawNode(
                    p.x + splitOffset,
                    p.y + splitOffset * 0.5,
                    p.size + splitOffset * 0.2,
                    p.isCross,
                    `rgba(0, 230, 255, ${0.45 + splitOffset * 0.03})`,
                    streak
                );

                // WHITE Center Core
                drawNode(p.x, p.y, p.size, p.isCross, 'rgba(255, 255, 255, 0.90)', streak * 0.5);
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
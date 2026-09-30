// ==========================================================
// 1. ARTWORK DATA CATALOG (KEEP AS IS)
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

// Safe element check
const yearEl = document.getElementById('year');
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

// ==========================================================
// 2. RENDER GALLERY GRID (KEEP AS IS)
// ==========================================================
const galleryGrid = document.getElementById('galleryGrid');

function renderGallery() {
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
// 3. MODAL / LIGHTBOX POPUP LOGIC (KEEP AS IS)
// ==========================================================
const modal = document.getElementById('artworkModal');
const modalBody = document.getElementById('modalBody');
const closeModal = document.getElementById('closeModal');

function openModal(art) {
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

closeModal.addEventListener('click', () => modal.classList.add('hidden'));
modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
});

// ==========================================================
// 4. HERO INTERACTIVE LCD CANVAS (High Performance)
// ==========================================================
function initHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let pattern;

    // Mouse positions (targetMouse tracks cursor, mouse lags smoothly for ghosting)
    const mouse = { x: -500, y: -500 };
    const targetMouse = { x: -500, y: -500 };

    // 1. Generate the LCD Subpixel RGB Tile
    function createLCDPattern() {
        const patternCanvas = document.createElement('canvas');
        patternCanvas.width = 9;  // 3px Red, 3px Green, 3px Blue
        patternCanvas.height = 9;
        const pCtx = patternCanvas.getContext('2d');

        // Dark background grid grid gap
        pCtx.fillStyle = '#0a0a0c';
        pCtx.fillRect(0, 0, 9, 9);

        // Subpixel Red
        pCtx.fillStyle = 'rgba(255, 50, 50, 0.35)';
        pCtx.fillRect(0, 0, 2.5, 8);

        // Subpixel Green
        pCtx.fillStyle = 'rgba(50, 255, 50, 0.35)';
        pCtx.fillRect(3, 0, 2.5, 8);

        // Subpixel Blue
        pCtx.fillStyle = 'rgba(50, 100, 255, 0.35)';
        pCtx.fillRect(6, 0, 2.5, 8);

        pattern = ctx.createPattern(patternCanvas, 'repeat');
    }

    // 2. Responsive Canvas Sizing
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        createLCDPattern();
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        targetMouse.x = e.clientX - rect.left;
        targetMouse.y = e.clientY - rect.top;
    });

    resize();

    // 3. 60 FPS Render Loop
    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Interpolate mouse position (creates phosphor trailing / blur lag)
        mouse.x += (targetMouse.x - mouse.x) * 0.12;
        mouse.y += (targetMouse.y - mouse.y) * 0.12;

        // Draw static LCD RGB Grid across background
        if (pattern) {
            ctx.fillStyle = pattern;
            ctx.fillRect(0, 0, width, height);
        }

        // Draw Backlight Glow under cursor
        if (targetMouse.x > 0 && targetMouse.y > 0) {
            ctx.save();
            ctx.globalCompositeOperation = 'screen'; // Blend mode that illuminates RGB subpixels

            // Outer Blurry LCD Backlight Glow
            const glowRadius = 180;
            const gradient = ctx.createRadialGradient(
                mouse.x, mouse.y, 0,
                mouse.x, mouse.y, glowRadius
            );
            gradient.addColorStop(0, 'rgba(0, 240, 255, 0.85)');   // Bright Cyan Center
            gradient.addColorStop(0.3, 'rgba(0, 180, 255, 0.4)');  // Blurry Transition
            gradient.addColorStop(0.7, 'rgba(0, 80, 255, 0.1)');   // Subtle Fade
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, glowRadius, 0, Math.PI * 2);
            ctx.fill();

            // Direct Hotspot directly under cursor tip
            const coreGradient = ctx.createRadialGradient(
                targetMouse.x, targetMouse.y, 0,
                targetMouse.x, targetMouse.y, 40
            );
            coreGradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
            coreGradient.addColorStop(0.5, 'rgba(0, 240, 255, 0.5)');
            coreGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = coreGradient;
            ctx.beginPath();
            ctx.arc(targetMouse.x, targetMouse.y, 40, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }

        requestAnimationFrame(animate);
    }

    animate();
}
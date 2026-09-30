// ==========================================================
// 1. ARTWORK DATA CATALOG
// Add new artwork items here in the future!
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
// 4. INTERACTIVE LCD SUBPIXEL CANVAS SIMULATION
// ==========================================================
function initHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let lcdPattern = null;

    // Smooth cursor interpolation for lag/ghosting effect
    const mouse = { x: -500, y: -500 };
    const targetMouse = { x: -500, y: -500 };

    // Create high-density RGB subpixel texture pattern
    function buildLCDTile() {
        const pCanvas = document.createElement('canvas');
        const pCtx = pCanvas.getContext('2d');
        const size = 6; // 6px x 6px subpixel cluster
        
        pCanvas.width = size;
        pCanvas.height = size;

        // Dark substrate background
        pCtx.fillStyle = '#060608';
        pCtx.fillRect(0, 0, size, size);

        // Subpixel Red
        pCtx.fillStyle = 'rgba(230, 40, 40, 0.45)';
        pCtx.fillRect(0, 0, 1.8, size - 1);

        // Subpixel Green
        pCtx.fillStyle = 'rgba(40, 230, 40, 0.45)';
        pCtx.fillRect(2, 0, 1.8, size - 1);

        // Subpixel Blue
        pCtx.fillStyle = 'rgba(40, 100, 255, 0.45)';
        pCtx.fillRect(4, 0, 1.8, size - 1);

        lcdPattern = ctx.createPattern(pCanvas, 'repeat');
    }

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        buildLCDTile();
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        targetMouse.x = e.clientX - rect.left;
        targetMouse.y = e.clientY - rect.top;
    });

    resize();

    function animate() {
        // Base dark screen background
        ctx.fillStyle = '#0a0a0c';
        ctx.fillRect(0, 0, width, height);

        // Draw dense LCD RGB subpixel layer
        if (lcdPattern) {
            ctx.fillStyle = lcdPattern;
            ctx.fillRect(0, 0, width, height);
        }

        // Smoothly interpolate mouse position (gives the 'phosphor persistence' ghosting effect)
        mouse.x += (targetMouse.x - mouse.x) * 0.08;
        mouse.y += (targetMouse.y - mouse.y) * 0.08;

        // Render Cursor Backlight Glow
        if (targetMouse.x > 0 && targetMouse.y > 0) {
            ctx.save();
            // Screen composite mode brightens the RGB subpixels beneath it
            ctx.globalCompositeOperation = 'screen';

            // 1. Soft Blurry Outer Light Trail (follows smoothly with lag)
            const trailRadius = 220;
            const trailGlow = ctx.createRadialGradient(
                mouse.x, mouse.y, 0,
                mouse.x, mouse.y, trailRadius
            );
            trailGlow.addColorStop(0, 'rgba(0, 240, 255, 0.65)');   // Bright Cyan
            trailGlow.addColorStop(0.3, 'rgba(0, 140, 255, 0.35)');  // Soft Blue
            trailGlow.addColorStop(0.7, 'rgba(0, 60, 180, 0.12)');  // Subtle Edge
            trailGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = trailGlow;
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, trailRadius, 0, Math.PI * 2);
            ctx.fill();

            // 2. Focused Bright Core under cursor tip
            const coreRadius = 60;
            const coreGlow = ctx.createRadialGradient(
                targetMouse.x, targetMouse.y, 0,
                targetMouse.x, targetMouse.y, coreRadius
            );
            coreGlow.addColorStop(0, 'rgba(255, 255, 255, 0.95)'); // Pure White backlight center
            coreGlow.addColorStop(0.4, 'rgba(0, 240, 255, 0.6)');  // Cyan transition
            coreGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = coreGlow;
            ctx.beginPath();
            ctx.arc(targetMouse.x, targetMouse.y, coreRadius, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
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
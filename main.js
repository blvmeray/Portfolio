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
// ==========================================================
// 4. INTERACTIVE MACRO LCD SUBPIXEL CANVAS SIMULATION
// ==========================================================
function initHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let lcdPattern = null;

    // Smooth cursor interpolation for backlight lag
    const mouse = { x: -500, y: -500 };
    const targetMouse = { x: -500, y: -500 };

    // Create Macro Subpixel Texture Pattern (Zoomed In)
    function buildLCDTile() {
        const pCanvas = document.createElement('canvas');
        const pCtx = pCanvas.getContext('2d');
        
        // MACRO DIMENSIONS
        const tileW = 22; // Width of 1 pixel cluster
        const tileH = 20; // Height of 1 pixel cluster
        
        pCanvas.width = tileW;
        pCanvas.height = tileH;

        // Pure black substrate (Black Mask/Matrix)
        pCtx.fillStyle = '#020204';
        pCtx.fillRect(0, 0, tileW, tileH);

        // Subpixel Bar Dimensions
        const subW = 5;      // Width of each R, G, B bar
        const subH = 14;     // Height of each bar
        const subY = 3;      // Top padding (leaves black gaps between rows)
        const radius = 1.5;  // Slightly rounded corners like real subpixels

        // Helper function for rounded subpixel bars
        function drawSubpixel(x, color) {
            pCtx.fillStyle = color;
            pCtx.beginPath();
            if (pCtx.roundRect) {
                pCtx.roundRect(x, subY, subW, subH, radius);
            } else {
                pCtx.rect(x, subY, subW, subH);
            }
            pCtx.fill();
        }

        // 1. Red Subpixel (left = 2px, 2px gap to green)
        drawSubpixel(2, 'rgba(240, 30, 30, 0.40)');

        // 2. Green Subpixel (left = 8.5px, 2px gap to blue)
        drawSubpixel(8.5, 'rgba(30, 240, 30, 0.40)');

        // 3. Blue Subpixel (left = 15px, 2px gap to next pixel)
        drawSubpixel(15, 'rgba(30, 110, 255, 0.40)');

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
        // Deep dark background
        ctx.fillStyle = '#060608';
        ctx.fillRect(0, 0, width, height);

        // Draw Macro Subpixel Grid
        if (lcdPattern) {
            ctx.fillStyle = lcdPattern;
            ctx.fillRect(0, 0, width, height);
        }

        // Smooth cursor movement interpolation
        mouse.x += (targetMouse.x - mouse.x) * 0.08;
        mouse.y += (targetMouse.y - mouse.y) * 0.08;

        // Render Backlight
        if (targetMouse.x > 0 && targetMouse.y > 0) {
            ctx.save();
            ctx.globalCompositeOperation = 'screen';

            // Soft Light Trail
            const trailRadius = 260;
            const trailGlow = ctx.createRadialGradient(
                mouse.x, mouse.y, 0,
                mouse.x, mouse.y, trailRadius
            );
            trailGlow.addColorStop(0, 'rgba(0, 240, 255, 0.7)');
            trailGlow.addColorStop(0.35, 'rgba(0, 120, 255, 0.35)');
            trailGlow.addColorStop(0.7, 'rgba(0, 40, 160, 0.1)');
            trailGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = trailGlow;
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, trailRadius, 0, Math.PI * 2);
            ctx.fill();

            // Focused White Backlight Core
            const coreRadius = 70;
            const coreGlow = ctx.createRadialGradient(
                targetMouse.x, targetMouse.y, 0,
                targetMouse.x, targetMouse.y, coreRadius
            );
            coreGlow.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
            coreGlow.addColorStop(0.4, 'rgba(0, 240, 255, 0.6)');
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
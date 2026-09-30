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
// 4. ANIMATED MACRO LCD DISPLAY SIMULATION
// ==========================================================
function initHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let lcdPattern = null;

    // Animation states
    let scanlineY = -100;
    let pulseTime = 0;
    const mouse = { x: -500, y: -500 };
    const targetMouse = { x: -500, y: -500 };

    // Create Macro Subpixel Pattern
    function buildLCDTile() {
        const pCanvas = document.createElement('canvas');
        const pCtx = pCanvas.getContext('2d');
        
        const tileW = 22;
        const tileH = 20;
        
        pCanvas.width = tileW;
        pCanvas.height = tileH;

        pCtx.fillStyle = '#020204';
        pCtx.fillRect(0, 0, tileW, tileH);

        const subW = 5;
        const subH = 14;
        const subY = 3;

        function drawSubpixel(x, color) {
            pCtx.fillStyle = color;
            pCtx.beginPath();
            if (pCtx.roundRect) {
                pCtx.roundRect(x, subY, subW, subH, 1.5);
            } else {
                pCtx.rect(x, subY, subW, subH);
            }
            pCtx.fill();
        }

        // Crisp RGB Subpixels
        drawSubpixel(2, 'rgba(235, 40, 40, 0.42)');
        drawSubpixel(8.5, 'rgba(40, 235, 40, 0.42)');
        drawSubpixel(15, 'rgba(40, 110, 255, 0.42)');

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
        pulseTime += 0.02;

        // Base dark substrate
        ctx.fillStyle = '#050508';
        ctx.fillRect(0, 0, width, height);

        // 1. Base Subpixel Grid
        if (lcdPattern) {
            ctx.fillStyle = lcdPattern;
            ctx.fillRect(0, 0, width, height);
        }

        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        // 2. Ambient Screen Edge Glow (Display Bezel Light Bleed)
        const edgeGlowRadius = Math.max(width, height) * 0.75;
        const edgeGlow = ctx.createRadialGradient(
            width / 2, height / 2, edgeGlowRadius * 0.3,
            width / 2, height / 2, edgeGlowRadius
        );
        const pulseAlpha = 0.12 + Math.sin(pulseTime) * 0.04;
        
        edgeGlow.addColorStop(0, 'rgba(0, 0, 0, 0)');
        edgeGlow.addColorStop(0.7, 'rgba(0, 120, 200, ' + (pulseAlpha * 0.5) + ')');
        edgeGlow.addColorStop(1, 'rgba(0, 220, 255, ' + pulseAlpha + ')');

        ctx.fillStyle = edgeGlow;
        ctx.fillRect(0, 0, width, height);

        // 3. Continuous Refresh Scanline Sweep
        scanlineY += 2.2;
        if (scanlineY > height + 150) {
            scanlineY = -150;
        }

        const scanGrad = ctx.createLinearGradient(0, scanlineY - 60, 0, scanlineY + 60);
        scanGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        scanGrad.addColorStop(0.5, 'rgba(100, 220, 255, 0.12)');
        scanGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = scanGrad;
        ctx.fillRect(0, scanlineY - 60, width, 120);

        // 4. Random Subpixel Signal Flickers
        if (Math.random() < 0.12) {
            const glitchY = Math.random() * height;
            const glitchH = 4 + Math.random() * 16;
            ctx.fillStyle = 'rgba(255, 255, 255, ' + (0.05 + Math.random() * 0.08) + ')';
            ctx.fillRect(0, glitchY, width, glitchH);
        }

        // 5. Subtle Mouse Electromagnetic Lens Reaction
        mouse.x += (targetMouse.x - mouse.x) * 0.08;
        mouse.y += (targetMouse.y - mouse.y) * 0.08;

        if (targetMouse.x > 0 && targetMouse.y > 0) {
            const lensRadius = 180;
            const lensGlow = ctx.createRadialGradient(
                mouse.x, mouse.y, 0,
                mouse.x, mouse.y, lensRadius
            );
            // Gentle white-to-cyan ambient brightening (no harsh core dot)
            lensGlow.addColorStop(0, 'rgba(255, 255, 255, 0.28)');
            lensGlow.addColorStop(0.4, 'rgba(0, 200, 255, 0.12)');
            lensGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = lensGlow;
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, lensRadius, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();

        requestAnimationFrame(animate);
    }

    animate();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    renderGallery();
    initHeroCanvas();
});
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
// 4. REACTIVE MACRO LCD DISPLAY (GLOW, DITHER & DYNAMIC FOCUS)
// ==========================================================
function initHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let cols = 0;
    let rows = 0;
    let gridEnergy = []; 

    const mouse = { x: -1000, y: -1000 };

    // Macro Grid Dimensions
    const tileW = 52; 
    const tileH = 44; 
    const subW = 12;
    const subH = 28;
    const subY = 8;
    const radius = 2;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        
        cols = Math.ceil(width / tileW) + 1;
        rows = Math.ceil(height / tileH) + 1;
        
        gridEnergy = new Float32Array(cols * rows);
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    resize();

    // Draw realistic LCD subpixel with electrode notches, phosphor bloom & edge dither
    function drawLCDSubpixel(x, y, r, g, b, brightness, energy) {
        ctx.save();

        // Phosphor Glow & Dynamic Blur/Focus Transition
        // Dim subpixels have a soft diffuse glow; charged ones snap into a bright halo
        const glowBlur = 3 + (1 - energy) * 5 + energy * 12;
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${0.35 + energy * 0.55})`;
        ctx.shadowBlur = glowBlur;

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${brightness})`;

        // Main subpixel body
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(x, y, subW, subH, radius);
        } else {
            ctx.rect(x, y, subW, subH);
        }
        ctx.fill();

        // 1. Horizontal Electrode Notches (Breaks up flat vector rects into LCD matrix bars)
        ctx.fillStyle = `rgba(2, 2, 4, ${0.45 - energy * 0.25})`;
        ctx.fillRect(x, y + subH * 0.33, subW, 1.5);
        ctx.fillRect(x, y + subH * 0.66, subW, 1.5);

        // 2. Micro Edge Dithering / Pixel Grain on Dim/Blurred pixels
        if (energy < 0.65) {
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${(1 - energy) * 0.3})`;
            const noise1 = (Math.random() - 0.5) * 1.8;
            const noise2 = (Math.random() - 0.5) * 1.8;
            ctx.fillRect(x - 0.8, y + 4 + noise1, 1, 3);
            ctx.fillRect(x + subW - 0.2, y + 14 + noise2, 1, 3);
        }

        ctx.restore();
    }

    function animate() {
        // Deep black substrate
        ctx.fillStyle = '#020204';
        ctx.fillRect(0, 0, width, height);

        const hoverRadius = 250;
        const baseBrightness = 0.30; 
        const maxBrightness = 0.98;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const idx = r * cols + c;
                const cellX = c * tileW;
                const cellY = r * tileH;

                const centerX = cellX + tileW / 2;
                const centerY = cellY + tileH / 2;

                const dist = Math.hypot(centerX - mouse.x, centerY - mouse.y);

                // Charge pixel energy if cursor is nearby
                if (dist < hoverRadius) {
                    const factor = 1 - (dist / hoverRadius);
                    const targetEnergy = Math.pow(factor, 1.3);
                    if (targetEnergy > gridEnergy[idx]) {
                        gridEnergy[idx] = targetEnergy;
                    }
                }

                // Smooth phosphor decay trail
                gridEnergy[idx] *= 0.92;
                if (gridEnergy[idx] < 0.001) gridEnergy[idx] = 0;

                const energy = gridEnergy[idx];
                const brightness = baseBrightness + energy * (maxBrightness - baseBrightness);

                // Dynamic Vibration / Violent Jitter under active mouse
                const jitterMagnitude = 0.35 + energy * 4.2; 
                const jitterX = (Math.random() - 0.5) * jitterMagnitude;
                const jitterY = (Math.random() - 0.5) * jitterMagnitude;

                const drawX = cellX + jitterX;
                const drawY = cellY + subY + jitterY;

                // Red Subpixel
                drawLCDSubpixel(drawX + 4, drawY, 245, 45, 45, brightness, energy);
                // Green Subpixel
                drawLCDSubpixel(drawX + 20, drawY, 45, 245, 45, brightness, energy);
                // Blue Subpixel
                drawLCDSubpixel(drawX + 36, drawY, 45, 125, 255, brightness, energy);
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
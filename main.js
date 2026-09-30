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
// 4. REACTIVE MACRO LCD DISPLAY (PHOSPHOR DECAY & DYNAMIC VIBRATION)
// ==========================================================
function initHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let cols = 0;
    let rows = 0;
    let gridEnergy = []; // Energy buffer for phosphor decay trail

    const mouse = { x: -1000, y: -1000 };

    // Larger Zoom Macro Dimensions
    const tileW = 50; 
    const tileH = 42; 
    const subW = 11.5;
    const subH = 26;
    const subY = 8;
    const radius = 3;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        
        cols = Math.ceil(width / tileW) + 1;
        rows = Math.ceil(height / tileH) + 1;
        
        // Reset energy array on resize
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

    // Helper to draw rounded subpixel bars
    function drawSubpixel(x, y, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(x, y, subW, subH, radius);
        } else {
            ctx.rect(x, y, subW, subH);
        }
        ctx.fill();
    }

    function animate() {
        // Dark substrate background
        ctx.fillStyle = '#030305';
        ctx.fillRect(0, 0, width, height);

        const hoverRadius = 240;
        const baseBrightness = 0.28; // Increased base visibility
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
                    const targetEnergy = Math.pow(factor, 1.4);
                    if (targetEnergy > gridEnergy[idx]) {
                        gridEnergy[idx] = targetEnergy;
                    }
                }

                // Decay current pixel energy over time (smooth fading trail)
                gridEnergy[idx] *= 0.925;
                if (gridEnergy[idx] < 0.001) gridEnergy[idx] = 0;

                const currentEnergy = gridEnergy[idx];
                const brightness = baseBrightness + currentEnergy * (maxBrightness - baseBrightness);

                // Dynamic Jitter: Violently shakes when charged (energy ~1.0), subtle when idle
                const jitterMagnitude = 0.35 + currentEnergy * 3.8; 
                const jitterX = (Math.random() - 0.5) * jitterMagnitude;
                const jitterY = (Math.random() - 0.5) * jitterMagnitude;

                const drawX = cellX + jitterX;
                const drawY = cellY + subY + jitterY;

                // Render RGB subpixel triplet
                drawSubpixel(drawX + 4, drawY, `rgba(240, 45, 45, ${brightness})`);
                drawSubpixel(drawX + 19.5, drawY, `rgba(45, 240, 45, ${brightness})`);
                drawSubpixel(drawX + 35, drawY, `rgba(45, 125, 255, ${brightness})`);
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
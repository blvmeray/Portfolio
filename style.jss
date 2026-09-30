/* ========================================================== */
/* DESIGN SYSTEM & VARIABLES                                  */
/* Edit these variables to change colors/fonts globally       */
/* ========================================================== */
:root {
    --bg-dark: #0a0a0c;
    --bg-card: #121216;
    --bg-modal: #18181f;
    --text-main: #f1f5f9;
    --text-muted: #94a3b8;
    --accent: #00f0ff;          /* Sleek Neon Cyan accent */
    --accent-glow: rgba(0, 240, 255, 0.2);
    --border: rgba(255, 255, 255, 0.1);
    --font-sans: 'Inter', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
}

/* Base Resets */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    background-color: var(--bg-dark);
    color: var(--text-main);
    font-family: var(--font-sans);
    line-height: 1.6;
    overflow-x: hidden;
}

/* Navigation Bar */
.navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: rgba(10, 10, 12, 0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    z-index: 100;
}

.nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-logo {
    font-family: var(--font-mono);
    color: var(--accent);
    text-decoration: none;
    font-weight: 600;
    letter-spacing: 1px;
}

.nav-links a {
    color: var(--text-muted);
    text-decoration: none;
    margin-left: 2rem;
    transition: color 0.3s;
}

.nav-links a:hover {
    color: var(--accent);
}

/* Hero Section */
.hero {
    position: relative;
    height: 90vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 0 1.5rem;
}

#heroCanvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    opacity: 0.5;
}

.hero-content {
    position: relative;
    z-index: 2;
    max-width: 800px;
}

.tagline {
    font-family: var(--font-mono);
    color: var(--accent);
    margin-bottom: 1rem;
    font-size: 0.9rem;
    letter-spacing: 2px;
}

.hero-title {
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 800;
    margin-bottom: 1rem;
    letter-spacing: -1px;
}

.hero-subtitle {
    color: var(--text-muted);
    font-size: 1.2rem;
    margin-bottom: 2rem;
}

/* Buttons */
.btn-primary, .btn-secondary {
    display: inline-block;
    padding: 0.8rem 1.8rem;
    font-family: var(--font-mono);
    text-decoration: none;
    border-radius: 4px;
    transition: all 0.3s;
}

.btn-primary {
    background-color: var(--accent);
    color: #000;
    font-weight: 600;
}

.btn-primary:hover {
    box-shadow: 0 0 20px var(--accent-glow);
    transform: translateY(-2px);
}

.btn-secondary {
    border: 1px solid var(--accent);
    color: var(--accent);
}

.btn-secondary:hover {
    background: var(--accent);
    color: #000;
}

/* Layout Containers */
.section-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 6rem 2rem;
}

.border-top {
    border-top: 1px solid var(--border);
}

.section-header h2 {
    font-size: 2.2rem;
    margin-bottom: 0.5rem;
}

.section-desc {
    color: var(--text-muted);
    font-family: var(--font-mono);
    margin-bottom: 3rem;
}

/* Gallery Grid */
.gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2rem;
}

/* Artwork Card */
.art-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.3s, border-color 0.3s;
}

.art-card:hover {
    transform: translateY(-5px);
    border-color: var(--accent);
}

.art-card-preview {
    width: 100%;
    height: 240px;
    background-color: #1a1a22;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.art-card-preview img, .art-card-preview video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.art-card-info {
    padding: 1.5rem;
}

.art-card-title {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
}

.art-card-tags {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--accent);
}

/* About Box */
.specs-box {
    margin-top: 2rem;
    padding: 1.5rem;
    background: var(--bg-card);
    border-left: 3px solid var(--accent);
    font-family: var(--font-mono);
    font-size: 0.9rem;
}

/* Footer */
.footer {
    text-align: center;
    padding: 4rem 2rem;
    border-top: 1px solid var(--border);
}

.copyright {
    margin-top: 2rem;
    color: var(--text-muted);
    font-size: 0.85rem;
}

/* Modal Overlay */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-overlay.hidden {
    display: none;
}

.modal-content {
    background: var(--bg-modal);
    border: 1px solid var(--border);
    padding: 2rem;
    border-radius: 8px;
    max-width: 800px;
    width: 90%;
    position: relative;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-close {
    position: absolute;
    top: 1rem;
    right: 1.5rem;
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: 2rem;
    cursor: pointer;
}

.modal-close:hover {
    color: var(--accent);
}
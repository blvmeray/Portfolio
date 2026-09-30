console.log("🚀 main.js has loaded and is executing!");

// Wait until the DOM is completely ready
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('heroCanvas');
    
    if (!canvas) {
        console.error("❌ Could not find <canvas id='heroCanvas'> in index.html!");
        return;
    }

    console.log("✅ Found #heroCanvas element.");
    const ctx = canvas.getContext('2d');
    
    let width, height;
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        console.log(`📐 Canvas resized to: ${width}px x ${height}px`);
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    resize();

    // Render loop: Glowing Neon Grid + Mouse Tracker
    function animate() {
        // Dark background clear
        ctx.fillStyle = '#0a0a0c';
        ctx.fillRect(0, 0, width, height);

        // 1. Draw Bright Neon Grid Lines
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
        ctx.lineWidth = 1;
        const gridSize = 50;

        for (let x = 0; x < width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        for (let y = 0; y < height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // 2. Draw Bright Cyan Follower Circle
        ctx.shadowBlur = 25;
        ctx.shadowColor = '#00f0ff';
        ctx.fillStyle = '#00f0ff';
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset blur

        requestAnimationFrame(animate);
    }

    animate();
    console.log("🎉 Canvas animation loop started!");
});
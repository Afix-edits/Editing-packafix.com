// --- Advanced JS Setup ---

// 1. Text Splitter for God-Tier Title Reveal
document.querySelectorAll('.split-line').forEach(line => {
    const text = line.innerText;
    line.innerHTML = '';
    text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.innerText = char === ' ' ? '\u00A0' : char; // preserve space
        // Stagger delay based on index
        span.style.transitionDelay = `${index * 0.03}s`;
        line.appendChild(span);
    });
});

// --- Custom Cursor & Magnetics Engine ---
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const magnetics = document.querySelectorAll('.magnetic');

let posX = 0, posY = 0, mouseX = 0, mouseY = 0;
// Handle if touch device (disable cursors)
const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (!isTouch) {
    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    function loop() {
        posX += (mouseX - posX) * 0.15;
        posY += (mouseY - posY) * 0.15;
        follower.style.left = posX + 'px';
        follower.style.top = posY + 'px';
        requestAnimationFrame(loop);
    }
    loop();

    magnetics.forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const strength = this.getAttribute('data-strength') || 20;
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            this.style.transform = `translate(${x * (strength / 100)}px, ${y * (strength / 100)}px)`;
            cursor.classList.add('active');
            follower.classList.add('active');
        });

        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0px, 0px)';
            cursor.classList.remove('active');
            follower.classList.remove('active');
        });
    });
}

// --- Advanced 3D Tilt Engine ---
const tiltElements = document.querySelectorAll('.tilt-card, .tilt-element');

tiltElements.forEach(el => {
    el.addEventListener('mousemove', function(e) {
        if(window.innerWidth <= 768) return; // Disable on small screens
        
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // CSS variables for glare and borders
        this.style.setProperty('--mx', `${x}px`);
        this.style.setProperty('--my', `${y}px`);
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -12; 
        const rotateY = ((x - centerX) / centerX) * 12;
        
        this.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    el.addEventListener('mouseleave', function() {
        if(window.innerWidth > 768) {
            this.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        }
    });
});

// --- Scroll Reveal ---
const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-up, .hero-title').forEach(el => observer.observe(el));

// --- Liquid Cursor Trail (Stunning WebGL-like Canvas) ---
const trailCanvas = document.getElementById('trail-canvas');
const tCtx = trailCanvas.getContext('2d', { alpha: true });
let points = [];
const maxPoints = 50;

function resizeCanvas() {
    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function drawTrail() {
    tCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
    
    // Add current mouse point
    points.push({x: posX, y: posY, age: 0});
    
    // Remove old points
    if (points.length > maxPoints) {
        points.shift();
    }
    
    if (points.length > 2) {
        tCtx.beginPath();
        tCtx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length - 1; i++) {
            const xc = (points[i].x + points[i + 1].x) / 2;
            const yc = (points[i].y + points[i + 1].y) / 2;
            tCtx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
            points[i].age++;
        }
        tCtx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
        
        // Gradient stroke
        const gradient = tCtx.createLinearGradient(
            points[0].x, points[0].y, 
            points[points.length-1].x, points[points.length-1].y
        );
        gradient.addColorStop(0, "rgba(255, 0, 85, 0)");
        gradient.addColorStop(0.5, "rgba(112, 0, 255, 0.4)");
        gradient.addColorStop(1, "rgba(0, 229, 255, 0.8)");
        
        tCtx.strokeStyle = gradient;
        tCtx.lineWidth = 12;
        tCtx.lineCap = 'round';
        tCtx.lineJoin = 'round';
        tCtx.stroke();
    }
    
    requestAnimationFrame(drawTrail);
}
if (!isTouch) drawTrail();

// --- Particle Constellation Network ---
const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');
let width, height, particles = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.baseSize = Math.random() * 2 + 0.5;
    }
    update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0) this.x = width; if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height; if (this.y > height) this.y = 0;
    }
    draw() {
        ctx.beginPath(); ctx.arc(this.x, this.y, this.baseSize, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'; ctx.fill();
    }
}

for (let i = 0; i < 150; i++) particles.push(new Particle());

function animateCanvas() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => { p.update(); p.draw(); });

    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 100) {
                ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 - dist / 1000})`; ctx.stroke();
            }
        }

        if(!isTouch) {
            const mdx = particles[i].x - mouseX; const mdy = particles[i].y - mouseY;
            const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
            
            if(mDist < 250) {
                ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(mouseX, mouseY);
                ctx.strokeStyle = `rgba(0, 229, 255, ${0.15 - mDist / 1500})`; ctx.stroke();
                // Subtly pull particle to mouse
                particles[i].x -= mdx * 0.015; particles[i].y -= mdy * 0.015;
            }
        }
    }
    requestAnimationFrame(animateCanvas);
}
animateCanvas();

// Navbar shrink
window.addEventListener('scroll', () => {
    if(window.scrollY > 50) document.getElementById('navbar').classList.add('scrolled');
    else document.getElementById('navbar').classList.remove('scrolled');
});

// Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

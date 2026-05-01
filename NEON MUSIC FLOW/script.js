// Quantum Music Flow v5.0 - May 2026
let audioContext, analyser, microphone;
let canvas, ctx;
let started = false;

// --- NEON FLOW (ZARRACHALAR) TIZIMI ---
let spots = [];
let hue = 0;
const mouse = { x: undefined, y: undefined };

// Sichqoncha harakatini kuzatish
window.addEventListener('mousemove', function(event) {
    if (started) {
        mouse.x = event.x;
        mouse.y = event.y;
        // Har bir harakatda 3 tadan zarracha qo'shish
        for (let i = 0; i < 3; i++) {
            spots.push(new Particle());
        }
    }
});

class Particle {
    constructor() {
        this.x = mouse.x;
        this.y = mouse.y;
        this.size = Math.random() * 8 + 2;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = 'hsl(' + hue + ', 100%, 50%)';
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        // Zarracha sekin kichrayishi
        if (this.size > 0.1) this.size -= 0.05;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function handleParticle() {
    for (let i = 0; i < spots.length; i++) {
        spots[i].update();
        spots[i].draw();
        
        // Zarrachalar orasidagi bog'lanish (Network Effect)
        for (let j = i; j < spots.length; j++) {
            const dx = spots[i].x - spots[j].x;
            const dy = spots[i].y - spots[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 60) {
                ctx.beginPath();
                ctx.strokeStyle = spots[i].color;
                ctx.lineWidth = spots[i].size / 10;
                ctx.moveTo(spots[i].x, spots[i].y);
                ctx.lineTo(spots[j].x, spots[j].y);
                ctx.stroke();
            }
        }
        
        // Kichrayib ketgan zarrachalarni o'chirish
        if (spots[i].size <= 0.1) {
            spots.splice(i, 1);
            i--;
        }
    }
}

// --- VIZUALIZATORNI BOSHLASH ---
function startVisualizer() {
    if (started) return;
    started = true;

    // Boshqaruv panelini yashirish
    const controls = document.querySelector('.controls');
    if (controls) controls.classList.add('fade-out');

    canvas = document.getElementById('visualizer');
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Audio API sozlash
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();

    // Mikrofonni ulash
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(stream => {
            microphone = audioContext.createMediaStreamSource(stream);
            
            // 1. Mikrofonni analizatorga ulash
            microphone.connect(analyser);

            // 2. Analizatorni karnayga (destination) ulash - OVOZ CHIQISHI UCHUN
            analyser.connect(audioContext.destination);

            analyser.fftSize = 256;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            drawVisualizer(dataArray, bufferLength);
        })
        .catch(err => {
            console.error("Audio xatosi:", err);
            alert("Vizualizator uchun mikrofon ruxsati kerak!");
            started = false;
        });
}

function drawVisualizer(dataArray, bufferLength) {
    if (!started) return;

    requestAnimationFrame(() => drawVisualizer(dataArray, bufferLength));
    analyser.getByteFrequencyData(dataArray);

    // Orqa fonni quyruq effekti bilan bo'yash
    ctx.fillStyle = "rgba(5, 5, 16, 0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Zarrachalar mantiqini ishga tushirish
    handleParticle();
    hue += 2; // Ranglarni doimiy o'zgartirish

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // O'rtacha ovoz balandligini hisoblash
    let avg = 0;
    for(let i = 0; i < bufferLength; i++) avg += dataArray[i];
    avg /= bufferLength;

    // Musiqiy doira radiusi (dinamik)
    const dynamicRadius = 100 + avg * 0.6;

    // Markaziy neon doira
    ctx.beginPath();
    ctx.arc(centerX, centerY, dynamicRadius, 0, Math.PI * 2);
    ctx.lineWidth = 10;
    ctx.strokeStyle = `hsl(${(hue) % 360}, 100%, 50%)`;
    ctx.stroke();

    // Musiqiy bar-chiziqlarni chizish
    for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] * 1.5;
        const angle = i * (Math.PI * 2 / bufferLength);

        const xStart = centerX + Math.cos(angle) * (dynamicRadius + 10);
        const yStart = centerY + Math.sin(angle) * (dynamicRadius + 10);
        const xEnd = centerX + Math.cos(angle) * (dynamicRadius + barHeight + 10);
        const yEnd = centerY + Math.sin(angle) * (dynamicRadius + barHeight + 10);

        ctx.beginPath();
        ctx.moveTo(xStart, yStart);
        ctx.lineTo(xEnd, yEnd);
        ctx.lineWidth = 4;
        ctx.strokeStyle = `hsl(${(hue + i * 2) % 360}, 100%, 50%)`;
        ctx.stroke();
    }
}

// Oyna o'lchami o'zgarganda canvasni yangilash
window.addEventListener('resize', function() {
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});
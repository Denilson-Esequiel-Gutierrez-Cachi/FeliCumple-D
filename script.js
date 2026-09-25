var canvas = document.getElementById('c');
var ctx = canvas.getContext('2d');

var w = canvas.width = window.innerWidth;
var h = canvas.height = window.innerHeight;

window.addEventListener('resize', function() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
});

// Config
var opts = {
    strings: ['!FELIZ', 'CUMPLEAÑOS','MARIA CLARA !'],
    charSize: 32,
    charSpacing: 35,
    lineHeight: 45,
    cx: w / 2,
    cy: h / 2,
    fireworkTime: 80,
    fireworkBaseLineWidth: 2,
    fireworkAddedLineWidth: 1,
    fireworkSpawnTime: 60,
    fireworkBaseReachTime: 30,
    fireworkAddedReachTime: 20,
    fireworkCircleBaseSize: 22,
    fireworkCircleAddedSize: 8,
    fireworkCircleBaseTime: 30,
    fireworkCircleAddedTime: 20,
    fireworkCircleFadeBaseTime: 20,
    fireworkCircleFadeAddedTime: 10,
    fireworkBaseShards: 6,
    fireworkAddedShards: 4,
    fireworkShardBaseVel: 2.5,
    fireworkShardAddedVel: 2,
    fireworkShardBaseSize: 3,
    fireworkShardAddedSize: 2,
    gravity: 0.08,
    upwardVel: 5,
    balloonBaseSize: 28,
    balloonAddedSize: 8,
    balloonBaseVel: 0.03,     
    balloonAddedVel: 0.02,       
    balloonBaseRadian: -(Math.PI / 2 - 0.05), 
    balloonAddedRadian: -0.1
};

var colors = ['#ff4d4d', '#ffaf40', '#fffa65', '#32ff7e', '#18dcff', '#7d5fff', '#cd84f1'];

var letters = [];
var phase = 'launch'; 
var timer = 0;

function calculateTargets() {
    letters = [];
    ctx.font = 'bold ' + opts.charSize + 'px Verdana';
    
    var totalLines = opts.strings.length;
    var startY = (h * 0.38) - ((totalLines - 1) * opts.lineHeight) / 2;

    opts.strings.forEach(function(line, lineIndex) {
        var characters = line.split('');
        var totalWidth = characters.length * opts.charSpacing;
        var startX = (w / 2) - (totalWidth / 2) + (opts.charSpacing / 2);

        characters.forEach(function(char, charIndex) {
            if (char === ' ') return;

            var targetX = startX + (charIndex * opts.charSpacing);
            var targetY = startY + (lineIndex * opts.lineHeight);
            var color = colors[(lineIndex * 4 + charIndex) % colors.length];

            letters.push({
                char: char,
                x: targetX + (Math.random() - 0.5) * 40,
                y: h + 50 + Math.random() * 100, 
                targetX: targetX,
                targetY: targetY,
                vx: 0,
                vy: -(Math.random() * 4 + 8),
                color: color,
                alpha: 0,
                balloonY: 0
            });
        });
    });
}

calculateTargets();

function animate() {
    requestAnimationFrame(animate);
    
    ctx.clearRect(0, 0, w, h);

    ctx.font = 'bold ' + opts.charSize + 'px Verdana';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    timer++;

    letters.forEach(function(p) {
        if (phase === 'launch') {
            p.y += (p.targetY - p.y) * 0.08;
            p.x += (p.targetX - p.x) * 0.08;
            if (p.alpha < 1) p.alpha += 0.05;

            ctx.beginPath();
            ctx.arc(p.x, p.y + 15, 3, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 10;
            ctx.fill();
        }

        else if (phase === 'hold') {
            p.x = p.targetX;
            p.y = p.targetY;
            p.alpha = 1;
        }

        else if (phase === 'fly') {
            p.vy -= 0.15; 
            p.y += p.vy;
            p.x += Math.sin(timer * 0.1 + p.targetX) * 0.8; 

            
            var balloonRadius = 10;
            var stringLength = 25;
            var bx = p.x;
            var by = p.y - stringLength;

            ctx.beginPath();
            ctx.moveTo(p.x, p.y - 10);
            ctx.lineTo(bx, by);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(bx, by, balloonRadius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 15;
            ctx.fill();
        }


        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 15;
        ctx.fillText(p.char, p.x, p.y);
        ctx.restore();
    });


    if (phase === 'launch' && timer > 90) {
        phase = 'hold';
        timer = 0;
    } else if (phase === 'hold' && timer > 120) { 
        phase = 'fly';
        timer = 0;
    } else if (phase === 'fly' && timer > 150) { 
        phase = 'launch';
        timer = 0;
        calculateTargets();
    }
}

function abrirCarta() {
    document.getElementById("modal-carta").style.display = "flex";
}

function cerrarCarta() {
    document.getElementById("modal-carta").style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
    const luna = document.querySelector(".luna");
    const cartaContenedor = document.getElementById("carta-contenedor");

    if (luna && cartaContenedor) {
        setInterval(() => {
            const opacityLuna = window.getComputedStyle(luna).opacity;
            
            if (parseFloat(opacityLuna) > 0.5) {
                cartaContenedor.classList.remove("carta-oculta");
                cartaContenedor.classList.add("carta-visible");
            } else {
                cartaContenedor.classList.remove("carta-visible");
                cartaContenedor.classList.add("carta-oculta");
            }
        }, 500);
    }
});
// --- CONTROL DE MÚSICA DE FONDO ---
function toggleMusica() {
    const musica = document.getElementById("musica-fondo");
    const icono = document.getElementById("icono-musica");
    const boton = document.getElementById("btn-musica");

    if (musica.paused) {
        musica.play();
        icono.textContent = "🔊";
        boton.classList.add("reproduciendo");
    } else {
        musica.pause();
        icono.textContent = "🔇";
        boton.classList.remove("reproduciendo");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const musica = document.getElementById("musica-fondo");
    
    document.body.addEventListener("click", function iniciarAudio() {
        if (musica && musica.paused) {
            musica.play().then(() => {
                const icono = document.getElementById("icono-musica");
                const boton = document.getElementById("btn-musica");
                if (icono) icono.textContent = "🔊";
                if (boton) boton.classList.add("reproduciendo");
            }).catch(e => console.log("Autoplay bloqueado por el navegador:", e));
        }
        document.body.removeEventListener("click", iniciarAudio);
    }, { once: true });
});
animate();
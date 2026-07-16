const stickman = document.getElementById("stickman");
const obstacle = document.getElementById("obstacle");
const scoreBox = document.getElementById("scoreBox");
const highScoreBox = document.getElementById("highScoreBox");
const jumpButton = document.getElementById("jumpButton");

const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScoreText = document.getElementById("finalScoreText");

let score = 0;
let highScore = 0;
let isJumping = false;
let isAlive = false;

let obstaclePosition = 850;
let gameSpeed = 3.8; 

let stickmanY = 0;
let jumpVelocity = 0;
const gravity = 0.6;
const baseBottom = 60; 

// সহজ অডিও জেনারেটর
function playSound(type) {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'jump') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(150, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.15);
            osc.start();
            osc.stop(ctx.currentTime + 0.15);
        } else if (type === 'score') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(300, ctx.currentTime);
            osc.frequency.setValueAtTime(450, ctx.currentTime + 0.08);
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.2);
            osc.start();
            osc.stop(ctx.currentTime + 0.2);
        } else if (type === 'over') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(200, ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.4);
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.4);
            osc.start();
            osc.stop(ctx.currentTime + 0.4);
        }
    } catch (e) {}
}

function triggerJump() {
    if (!isAlive || isJumping) return;
    isJumping = true;
    jumpVelocity = 12.5; 
    stickman.classList.add("jumping");
    playSound('jump');
}

// মাউস ও টাচ কন্ট্রোল
jumpButton.addEventListener("mousedown", (e) => { e.preventDefault(); triggerJump(); });
jumpButton.addEventListener("touchstart", (e) => { e.preventDefault(); triggerJump(); });

// কিবোর্ড স্পেসবার কন্ট্রোল
document.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        event.preventDefault();
        if (!isAlive) {
            startGame();
        } else {
            triggerJump();
        }
    }
});

function startGame() {
    score = 0;
    obstaclePosition = 850;
    gameSpeed = 3.8; 
    stickmanY = 0;
    jumpVelocity = 0;
    isJumping = false;
    isAlive = true;

    scoreBox.innerText = "Score: ⭐ 0";
    stickman.classList.remove("jumping");
    stickman.style.bottom = baseBottom + "px";
    
    startScreen.style.display = "none";
    gameOverScreen.style.display = "none";

    requestAnimationFrame(gameLoop);
}

function gameLoop() {
    if (!isAlive) return;

    if (isJumping) {
        stickmanY += jumpVelocity;
        jumpVelocity -= gravity;
        
        if (stickmanY <= 0) {
            stickmanY = 0;
            isJumping = false;
            jumpVelocity = 0;
            stickman.classList.remove("jumping");
        }
    }
    stickman.style.bottom = (baseBottom + stickmanY) + "px";

    obstaclePosition -= gameSpeed;
    if (obstaclePosition < -50) {
        obstaclePosition = 850;
        score++;
        scoreBox.innerText = "Score: ⭐ " + score;
        playSound('score');

        if (score % 4 === 0 && gameSpeed < 6.5) {
            gameSpeed += 0.3;
        }
    }
    obstacle.style.left = obstaclePosition + "px";

    if (obstaclePosition > 45 && obstaclePosition < 115) {
        if (stickmanY < 32) {
            isAlive = false;
            playSound('over');
            if (score > highScore) {
                highScore = score;
                highScoreBox.innerText = "High: 🏆 " + highScore;
            }
            finalScoreText.innerText = "তোমার সংগ্রহ করা স্টার: ⭐ " + score;
            gameOverScreen.style.display = "flex";
        }
    }

    if (isAlive) {
        requestAnimationFrame(gameLoop);
    }
}
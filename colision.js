const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

//Obtiene las dimensiones de la pantalla actual
const window_height = window.innerHeight;
const window_width = window.innerWidth;

canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#ff8";

class Circle {

    constructor(x, y, radius, color, text, speed) {

        this.posX = x;
        this.posY = y;
        this.radius = radius;

        this.color = color;
        this.originalColor = color;

        this.text = text;
        this.speed = speed;

        this.dx = 1 * this.speed;
        this.dy = 1 * this.speed;

        this.flashFrames = 5;
    }

    draw(context) {

        context.beginPath();
        context.strokeStyle = this.color;

        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";

        context.fillText(this.text, this.posX, this.posY);

        context.lineWidth = 2;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);

        context.stroke();
        context.closePath();
    }

    update(context) {

        this.updateFlash();

        this.draw(context);

        this.posX += this.dx;
        this.posY += this.dy;

        if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
            this.dx = -this.dx;
        }

        if (this.posY + this.radius > window_height || this.posY - this.radius < 0) {
            this.dy = -this.dy;
        }
    }

    updateFlash() {

        if (this.flashFrames > 0) {
            this.flashFrames--;

            if (this.flashFrames === 0) {
                this.color = this.originalColor;
            }
        }
    }

    setFlash() {
        this.color = "#0000FF";
        this.flashFrames = 2;
    }

    handleCollision(otherCircle) {

        let dx = otherCircle.posX - this.posX;
        let dy = otherCircle.posY - this.posY;

        let distance = Math.sqrt(dx * dx + dy * dy);

        let minDistance = this.radius + otherCircle.radius;

        if (distance < minDistance) {

            // Flash azul
            this.setFlash();
            otherCircle.setFlash();

            // Invertir dirección
            this.dx = -this.dx;
            this.dy = -this.dy;

            otherCircle.dx = -otherCircle.dx;
            otherCircle.dy = -otherCircle.dy;

            // --- CORRECCIÓN DEL BUG ---
            // separar círculos para evitar que se queden pegados

            let overlap = minDistance - distance;

            let nx = dx / distance;
            let ny = dy / distance;

            this.posX -= nx * overlap / 2;
            this.posY -= ny * overlap / 2;

            otherCircle.posX += nx * overlap / 2;
            otherCircle.posY += ny * overlap / 2;
        }
    }
}

let circles = [];

function generateCircles(n) {

    for (let i = 0; i < n; i++) {

        let radius = Math.random() * 30 + 20;

        let x = Math.random() * (window_width - radius * 2) + radius;
        let y = Math.random() * (window_height - radius * 2) + radius;

        let color = `#${Math.floor(Math.random()*16777215).toString(16)}`;

        let speed = Math.random() * 4 + 1;

        let text = `C${i + 1}`;

        circles.push(new Circle(x, y, radius, color, text, speed));
    }
}

function detectCollision() {

    for (let i = 0; i < circles.length; i++) {

        for (let j = i + 1; j < circles.length; j++) {

            circles[i].handleCollision(circles[j]);

        }
    }
}

function animate() {

    ctx.clearRect(0, 0, window_width, window_height);

    detectCollision();

    circles.forEach(circle => {
        circle.update(ctx);
    });

    requestAnimationFrame(animate);
}

generateCircles(20);
animate();

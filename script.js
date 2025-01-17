let canvas = document.getElementById("myCanvas");
let gameOverText = document.querySelector('.gameOverText');
let scoreNumber = document.querySelector('#scoreNumber');
let context = canvas.getContext("2d");
context.font = 'bold 30px sans-serif';
let scrollCounter, cameraY, current, mode, xSpeed;
let ySpeed = 5;
let height = 50;
let boxes = [];
boxes[0] = {
    x: 300,
    y: 300,
    width: 200
};
let debris = {
    x: 0,
    width: 0
};

function newBox() {
    boxes[current] = {
        x: 0,
        y: (current + 10) * height,
        width: boxes[current - 1].width
    };
}

function gameOver() {
    mode = 'gameOver';
    gameOverText.style.display = 'block';
}

function animate() {
    if (mode != 'gameOver') {
        context.clearRect(0, 0, canvas.width, canvas.height);
        scoreNumber.innerHTML = current - 1;


        for (let n = 0; n < boxes.length; n++) {
            let box = boxes[n];
            // make the boxes lighter as they go down
            context.fillStyle = 'rgb(' + n * 16 + ',' + n * 16 + ',' + n * 16 + ')';

            // draw the box  and shift it down
            context.fillRect(box.x, 600 - box.y + cameraY, box.width, height);
        }

        // draw the debris
        context.fillStyle = 'yellow';
        context.fillRect(debris.x, 600 - debris.y + cameraY, debris.width, height);


        //   MOVEMENT OF BOXES left and right before falling
        if (mode == 'bounce') {
            boxes[current].x = boxes[current].x + xSpeed;
            if (xSpeed > 0 && boxes[current].x + boxes[current].width > canvas.width)
                xSpeed = -xSpeed;
            if (xSpeed < 0 && boxes[current].x < 0)
                xSpeed = -xSpeed;
        }



        if (mode == 'fall') {
            // FALLING OF BOXES -- SPEED
            boxes[current].y = boxes[current].y - ySpeed;


            if (boxes[current].y == boxes[current - 1].y + height) {
                mode = 'bounce';
                let difference = boxes[current].x - boxes[current - 1].x;
                if (Math.abs(difference) >= boxes[current].width) {
                    gameOver();
                }
                debris = {
                    y: boxes[current].y,
                    width: difference
                };


                // CUT THE BOX FROM RIGHT SIDE
                if (boxes[current].x > boxes[current - 1].x) {
                    boxes[current].width = boxes[current].width - difference;
                    debris.x = boxes[current].x + boxes[current].width;
                }

                // CUT THE BOX FROM LEFT SIDE
                else {
                    debris.x = boxes[current].x - difference;
                    boxes[current].width = boxes[current].width + difference;
                    boxes[current].x = boxes[current - 1].x;
                }


                // INCREASE SPEED OF BOUNCE 
                if (xSpeed > 0)
                    xSpeed++;

                // DECREASE SPEED OF BOUNCED
                else
                    xSpeed--;

                current++;
                scrollCounter = height;
                newBox();
            }
        }
        // FALLING OF DEBRIS-- SPEED
        debris.y = debris.y - ySpeed;


        // SHIFTING THE STACK DOWN 
        if (scrollCounter) {
            cameraY++;
            scrollCounter--;
        }
    }
    window.requestAnimationFrame(animate);
}

function restart() {
    gameOverText.style.display = 'none';
    boxes.splice(1, boxes.length - 1);
    mode = 'bounce';
    cameraY = 0;
    scrollCounter = 0;
    xSpeed = 2;
    current = 1;
    newBox();
    debris.y = 0;
}

canvas.onpointerdown = function() {
    if (mode == 'gameOver')
        restart();
    else {
        if (mode == 'bounce')
            mode = 'fall';
    }
};

restart();
animate();
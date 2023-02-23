// window.requestAnimFrame = (function(){
// 	return window.requestAnimationFrame ||
// 		window.webkitRequestAnimationFrame ||
// 		window.mozRequestAnimationFrame ||
// 		function (callback){
// 			window.setTimeout(callback, 1000/60);
// 		};
// })();

window.onload = function() {

    var canvas = document.getElementById("canvas"),
        ctx = canvas.getContext("2d"),

        cw = window.innerWidth,
        ch = window.innerHeight,

        fireworks = [],
        particles = [],

        hue = 120,

        limiterTotal = 20,
        limiterTick = 0,

        timerTotal = 0,
        randomTime = 0,
        timerTick = 0,
        mousedown = false,

        mx,
        my;

    canvas.width = cw;
    canvas.height = ch;
    //$('canvas').css("background-size":cw);

    // var snd = new Audio("http://soundjax.com/reddo/38563%5EFirework.mp3"); // buffers automatically when created
    // var snd = new Audio("http://soundjax.com/reddo/51715%5Efirework.mp3");



    // now we are going to setup our function placeholders for the entire demo

    // get a random number within a range
    function random(min, max) {
        return min + Math.random() * (max - min);
    }

    // calculate the distance between two points
    function calculateDistance(p1x, p1y, p2x, p2y) {
        return Math.sqrt((p1x - p2x) * (p1x - p2x) + (p1y - p2y) * (p1y - p2y));
    }


    /*==================================================== Firework Class ======================================================*/
    // create firework
    function Firework(sx, sy, tx, ty) {
        //actual coordinates
        this.x = sx;
        this.y = sy;
        //starting coordinate
        this.sx = sx;
        this.sy = sy;
        //target coordinates
        this.tx = tx;
        this.ty = ty;

        this.distanceToTarget = calculateDistance(sx, sy, tx, ty);
        this.distanceTraveled = 0;


        //track past coordinates to creates a trail effect
        this.coordinates = [];
        this.coordinateCount = 2;

        while (this.coordinateCount--) {
            this.coordinates.push([this.x, this.y]);
        }
        this.angle = Math.atan2(ty - sy, tx - sx);
        this.speed = 1;
        this.acceleration = 1.2;
        this.brightness = random(50, 70);


        this.tragetRadius = 1;
    }

    // update firework
    Firework.prototype.update = function(index) {
        // if(this.distanceTraveled >= this.distanceToTarget ){
        // fireworks.splice(index, 1);
        // }


        if (this.targetRadius < 8) {
            this.targetRadius += 0.3;
        } else {
            this.targetRadius = 1;
        }

        this.speed *= this.acceleration;

        var vx = Math.cos(this.angle) * this.speed,
            vy = Math.sin(this.angle) * this.speed;

        this.distanceTraveled = calculateDistance(this.sx, this.sy, this.x + vx, this.y + vy);

        if (this.distanceTraveled >= this.distanceToTarget) {

            this.coordinates.pop();
            this.coordinates.unshift([this.tx, this.ty]);
            //this.x = this.tx; this.y = this.ty;
            createParticles(this.x, this.y);
            //  snd.play();
            this.draw();
            fireworks.splice(index, 1);
        } else {
            this.x += vx;
            this.y += vy;
        }

        this.coordinates.pop();

        this.coordinates.unshift([this.x, this.y]);
    };

    // draw firework
    Firework.prototype.draw = function() {
        ctx.beginPath();
        // move to the last tracked coordinate in the set, then draw a line to the current x and y
        ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = 'hsl(' + hue + ', 100%, ' + this.brightness + '%)';
        ctx.stroke();


        // ctx.beginPath();
        // ctx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI*2);
        // ctx.stroke();
    }


    /*============================================ Particle Class ======================================================*/
    // create particle
    function Particle(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        // track the past coordinates of each particle to create a trail effect, increase the coordinate count to create more prominent trails
        this.coordinates = [];
        this.coordinateCount = 6;
        while (this.coordinateCount--) {
            this.coordinates.push([this.x, this.y]);
        }


        // TO Be Improved //
        switch (type) {
            case 1:
                var variation = random(1, 5);
                if (variation < 2) {
                    // set a random angle in all possible directions, in radians
                    this.angle = random(0, Math.PI * 2);
                    this.speed = random(1, 15);
                    // friction will slow the particle down
                    this.friction = 0.95;
                    // gravity will be applied and pull the particle down
                    this.gravity = 4;
                    // set the hue to a random number +-20 of the overall hue variable
                    this.hue = random(hue - 50, hue + 50);
                    this.brightness = random(50, 80);
                    this.alpha = 1;
                    // set how fast the particle fades out
                    this.decay = random(0.01, 0.02);

                } else if (variation < 3) {
                    // set a random angle in all possible directions, in radians
                    this.angle = random(0, Math.PI * 2);
                    this.speed = random(1, 5);
                    // friction will slow the particle down
                    this.friction = 0.95;
                    // gravity will be applied and pull the particle down
                    this.gravity = 3;
                    // set the hue to a random number +-20 of the overall hue variable
                    this.hue = random(hue - 50, hue);
                    this.brightness = random(50, 80);
                    this.alpha = 1;
                    // set how fast the particle fades out
                    this.decay = random(0.015, 0.03);


                } else if (variation < 4) {
                    // set a random angle in all possible directions, in radians
                    this.angle = random(0, Math.PI * 2);
                    this.speed = random(1, 8);
                    // friction will slow the particle down
                    this.friction = 0.95;
                    // gravity will be applied and pull the particle down
                    this.gravity = 3;
                    // set the hue to a random number +-20 of the overall hue variable
                    this.hue = random(hue, hue + 50);
                    this.brightness = random(50, 80);
                    this.alpha = 1;
                    // set how fast the particle fades out
                    this.decay = random(0.015, 0.03);


                } else {
                    // set a random angle in all possible directions, in radians
                    this.angle = random(0, Math.PI * 2);
                    this.speed = random(1, 15);
                    // friction will slow the particle down
                    this.friction = 0.95;
                    // gravity will be applied and pull the particle down
                    this.gravity = 3;
                    // set the hue to a random number +-20 of the overall hue variable
                    this.hue = random(hue - 50, hue + 50);
                    this.brightness = random(10, 20);
                    this.alpha = 1;
                    // set how fast the particle fades out
                    this.decay = random(0.015, 0.3);


                }
                break;





            case 2:
                var variation = random(1, 5);
                if (variation < 2) {
                    // set a random angle in all possible directions, in radians
                    this.angle = random(0, Math.PI * 2);
                    this.speed = random(1, 10);
                    // friction will slow the particle down
                    this.friction = 0.95;
                    // gravity will be applied and pull the particle down
                    this.gravity = 4;
                    // set the hue to a random number +-20 of the overall hue variable
                    this.hue = 100;
                    this.brightness = random(50, 80);
                    this.alpha = 1;
                    // set how fast the particle fades out
                    this.decay = random(0.01, 0.02);

                } else if (variation < 3) {
                    // set a random angle in all possible directions, in radians
                    this.angle = random(0, Math.PI * 2);
                    this.speed = random(1, 21);
                    // friction will slow the particle down
                    this.friction = 0.95;
                    // gravity will be applied and pull the particle down
                    this.gravity = 3;
                    // set the hue to a random number +-20 of the overall hue variable
                    this.hue = 100;
                    this.brightness = random(50, 80);
                    this.alpha = 1;
                    // set how fast the particle fades out
                    this.decay = random(0.015, 0.03);


                } else if (variation < 4) {
                    // set a random angle in all possible directions, in radians
                    this.angle = random(0, Math.PI * 2);
                    this.speed = random(1, 3);
                    // friction will slow the particle down
                    this.friction = 0.95;
                    // gravity will be applied and pull the particle down
                    this.gravity = 3;
                    // set the hue to a random number +-20 of the overall hue variable
                    this.hue = 100;
                    this.brightness = random(50, 80);
                    this.alpha = 1;
                    // set how fast the particle fades out
                    this.decay = random(0.015, 0.03);


                } else {
                    // set a random angle in all possible directions, in radians
                    this.angle = random(0, Math.PI * 2);
                    this.speed = random(1, 5);
                    // friction will slow the particle down
                    this.friction = 0.95;
                    // gravity will be applied and pull the particle down
                    this.gravity = 3;
                    // set the hue to a random number +-20 of the othis.hue = 100;
                    this.hue = 100;
                    this.brightness = random(10, 20);
                    this.alpha = 1;
                    // set how fast the particle fades out
                    this.decay = random(0.015, 0.3);


                }
                break;


            case 3:
                var variation = random(1, 5);
                // var hue = 10;
                if (variation < 2) {
                    // set a random angle in all possible directions, in radians
                    this.angle = random(0, Math.PI * 2);
                    this.speed = random(10, 15);
                    // friction will slow the particle down
                    this.friction = 0.95;
                    // gravity will be applied and pull the particle down
                    this.gravity = 4;
                    // set the hue to a random number +-20 of the overall hue variable
                    this.hue = 60;
                    this.brightness = random(10, 20);
                    this.alpha = 1;
                    // set how fast the particle fades out
                    this.decay = random(0.01, 0.02);

                } else if (variation < 3) {
                    // set a random angle in all possible directions, in radians
                    this.angle = random(0, Math.PI * 2);
                    this.speed = random(11, 15);
                    // friction will slow the particle down
                    this.friction = 0.95;
                    // gravity will be applied and pull the particle down
                    this.gravity = 3;
                    // set the hue to a random number +-20 of the overall hue variable
                    this.hue = 10;
                    this.brightness = random(10, 20);
                    this.alpha = 1;
                    // set how fast the particle fades out
                    this.decay = random(0.015, 0.03);


                } else if (variation < 4) {
                    // set a random angle in all possible directions, in radians
                    this.angle = random(0, Math.PI * 2);
                    this.speed = random(11, 18);
                    // friction will slow the particle down
                    this.friction = 0.95;
                    // gravity will be applied and pull the particle down
                    this.gravity = 3;
                    // set the hue to a random number +-20 of the overall hue variable
                    this.hue = 90;
                    this.brightness = random(10, 20);
                    this.alpha = 1;
                    // set how fast the particle fades out
                    this.decay = random(0.015, 0.03);


                } else {
                    // set a random angle in all possible directions, in radians
                    this.angle = random(0, Math.PI * 2);
                    this.speed = random(11, 15);
                    // friction will slow the particle down
                    this.friction = 0.95;
                    // gravity will be applied and pull the particle down
                    this.gravity = 3;
                    // set the hue to a random number +-20 of the overall hue variable
                    this.hue = 120;
                    this.brightness = random(10, 20);
                    this.alpha = 1;
                    // set how fast the particle fades out
                    this.decay = random(0.015, 0.3);


                }
                break;

            case 4:
                var variation = random(1, 5);
                if (variation < 2) {
                    // set a random angle in all possible directions, in radians
                    this.angle = random(0, Math.PI * 2);
                    this.speed = random(1, 10);
                    // friction will slow the particle down
                    this.friction = 0.95;
                    // gravity will be applied and pull the particle down
                    this.gravity = 4;
                    // set the hue to a random number +-20 of the overall hue variable
                    this.hue = 300;
                    this.brightness = random(50, 80);
                    this.alpha = 1;
                    // set how fast the particle fades out
                    this.decay = random(0.01, 0.02);

                } else if (variation < 3) {
                    // set a random angle in all possible directions, in radians
                    this.angle = random(0, Math.PI * 2);
                    this.speed = random(1, 21);
                    // friction will slow the particle down
                    this.friction = 0.95;
                    // gravity will be applied and pull the particle down
                    this.gravity = 3;
                    // set the hue to a random number +-20 of the overall hue variable
                    this.hue = 300;
                    this.brightness = random(50, 80);
                    this.alpha = 1;
                    // set how fast the particle fades out
                    this.decay = random(0.015, 0.03);


                } else if (variation < 4) {
                    // set a random angle in all possible directions, in radians
                    this.angle = random(0, Math.PI * 2);
                    this.speed = random(1, 3);
                    // friction will slow the particle down
                    this.friction = 0.95;
                    // gravity will be applied and pull the particle down
                    this.gravity = 3;
                    // set the hue to a random number +-20 of the overall hue variable
                    this.hue = 300;
                    this.brightness = random(50, 80);
                    this.alpha = 1;
                    // set how fast the particle fades out
                    this.decay = random(0.015, 0.03);


                } else {
                    // set a random angle in all possible directions, in radians
                    this.angle = random(0, Math.PI * 2);
                    this.speed = random(1, 5);
                    // friction will slow the particle down
                    this.friction = 0.95;
                    // gravity will be applied and pull the particle down
                    this.gravity = 3;
                    // set the hue to a random number +-20 of the othis.hue = 100;
                    this.hue = 100;
                    this.brightness = random(10, 20);
                    this.alpha = 1;
                    // set how fast the particle fades out
                    this.decay = random(0.015, 0.3);


                }
                break;


            default:
        }
    }

    // update particle
    Particle.prototype.update = function(index) {




        // slow down the particle
        this.speed *= this.friction;
        // apply velocity
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        // fade out the particle
        // this.alpha -= this.decay * this.alpha;
        this.alpha -= this.decay;


        if (this.type == 4 && this.alpha <= 0.5) {
            this.brightness += 50;
            this.hue += 200;
            if (this.brightness >= 200)
                this.brightness = 0;
        }

        // remove the particle once the alpha is low enough, based on the passed in index
        if (this.alpha <= this.decay) {
            particles.splice(index, 1);
        }

        // remove last item in coordinates array
        this.coordinates.pop();
        // add current coordinates to the start of the array
        this.coordinates.unshift([this.x, this.y]);


    }

    // draw particle
    Particle.prototype.draw = function() {
        ctx.beginPath();
        // move to the last tracked coordinates in the set, then draw a line to the current x and y
        ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
        ctx.stroke();

    }

    // create particle group/explosion
    function createParticles(x, y) {
        var particleCount = 300;
        var type = Math.floor(random(1, 5));
        while (particleCount--) {
            particles.push(new Particle(x, y, type));
        }
    }


    /*============================================ Game loop ======================================================*/
    // main demo loop
    function loop() {
        //requestAnimFrame(loop);
        hue += 0.5;
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, cw, ch);

        ctx.globalCompositeOperation = "lighter";

        var i = fireworks.length;
        while (i--) {
            fireworks[i].draw();
            fireworks[i].update(i);
        }

        // loop over each particle, draw it, update it
        var i = particles.length;
        while (i--) {
            particles[i].draw();
            particles[i].update(i);
        }

        if (timerTick >= timerTotal + randomTime) {
            if (!mousedown) {
                /* uniform */
                // fireworks.push( new Firework(cw/2, ch, 100, random(0, ch/2)));
                /* 0 to cw/2, more to*/
                // fireworks.push( new Firework(cw/2, ch, Math.floor(Math.sqrt(random(0, cw*cw/4))), random(0, ch/2)));

                var xPos = Math.pow(Math.floor((random(-Math.pow(cw / 2, 1 / 3), Math.pow(cw / 2, 1 / 3)))), 3);
                xPos += cw / 2;
                fireworks.push(new Firework(cw / 2, ch, xPos, random(0, ch / 2)));
                // fireworks.push( new Firework(cw/2, ch, random(-10, 100), random(0, ch/2)));

                timerTick = 0;
                randomTime = Math.pow(random(2, 4), 2);
            }
        } else {
            timerTick++;
        }


        // limit the rate at which fireworks get launched when mouse is down
        if (limiterTick >= limiterTotal) {
            if (mousedown) {
                // start the firework at the bottom middle of the screen, then set the current mouse coordinates as the target
                fireworks.push(new Firework(cw / 2, ch, mx, my));
                limiterTick = 0;
            } else {
                limiterTick = limiterTotal;
            }
        } else {
            limiterTick++;
        }

    }

    // mouse event bindings
    // update the mouse coordinates on mousemove
    canvas.addEventListener('mousemove', function(e) {
        mx = e.pageX - canvas.offsetLeft;
        my = e.pageY - canvas.offsetTop;
    });

    // toggle mousedown state and prevent canvas from being selected
    canvas.addEventListener('mousedown', function(e) {
        e.preventDefault();
        mousedown = true;
    });

    canvas.addEventListener('mouseup', function(e) {
        e.preventDefault();
        mousedown = false;
    });

    setInterval(loop, 25);

    // (function game(){
    // 	loop();
    // 	setTimeout(game, Math.floor(random(30, 30)));
    // })();

};



// once the window loads, we are ready for some fireworks!
// window.onload = loop;
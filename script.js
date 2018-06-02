'use strict';
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var shipCanvas = document.getElementById('shipCanvas');
var shipCtx = shipCanvas.getContext('2d');
var startGame = document.getElementById("StartGame");
var gameOverVar = document.getElementById("GameOver");
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
var ShipLife = document.getElementById('ShipLife');
var score = document.getElementById('score');


var backgroundImage = new Image();
backgroundImage.src = 'https://www.walldevil.com/wallpapers/w01/433850-dark-landscapes-night-sky-skyline-space-stars.jpg';

var ship1Image = new Image();
ship1Image.src = 'https://i.pinimg.com/originals/5b/d9/89/5bd98917f680e1330c1852ab8b979374.png';


var meteoriteImage = new Image();
meteoriteImage.src = 'https://pre00.deviantart.net/c501/th/pre/i/2013/130/f/0/asteroid_stock_3_by_fimar-d64qqfu.png';

var circlePaternImage = new Image();
circlePaternImage.src = "https://d2gg9evh47fn9z.cloudfront.net/800px_COLOURBOX2277355.jpg";
var circlePatern = ctx.createPattern(circlePaternImage, "repeat");


function ShipConstrutor(shipLength, shipWidth, shipPositionX, shipPositionY, image, speed, life) {
    this.life = life;
    this.shipLength = shipLength;
    this.shipWidth = shipWidth;
    this.shipPositionX = shipPositionX;
    this.shipPositionY = shipPositionY;
    this.image = image;
    this.speed = speed;
    this.draw = function () {
        shipCtx.drawImage(image, shipPositionX, shipPositionY, shipWidth, shipLength);
    }
};

function MeteoriteConstructor(radius, positionX, positionY, image, velocityX, velocityY, life, centerX, centerY) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.radius = radius;
    this.positionX = positionX;
    this.positionY = positionY;
    this.image = image;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.life = life;
};

function BulletConstructor(positionX, positionY, image, velocityX, velocityY, exists, radius) {
    this.radius = radius;
    this.positionX = positionX;
    this.positionY = positionY;
    this.image = image;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.exists = exists;
}

var ship1 = new ShipConstrutor(100, 100, -50, -50, ship1Image, 4, 3);
shipCanvas.width = ship1.shipWidth * 8;
shipCanvas.height = ship1.shipLength * 8;
shipCtx.translate(shipCanvas.width / 2, shipCanvas.height / 2);
var leftButtonPressed = false;
var rightButtonPressed = false;
var upButtonPressed = false;
let fireButtonPressed = false;
let escape = false;
window.onkeydown = function (e) {
    if (e.keyCode === 32) {
        fireButtonPressed = true;
    }
    if (e.keyCode === 65 || e.keyCode === 37) {
        leftButtonPressed = true;
    } else if (e.keyCode === 68 || e.keyCode === 39) {
        rightButtonPressed = true;
    } else if (e.keyCode === 87 || e.keyCode === 38) {
        upButtonPressed = true;
    }
    if (e.keyCode === 27) {
        escape = true;
    }
}
window.onkeyup = function (e) {
    if (e.keyCode === 32) {
        fireButtonPressed = false;
    }
    if (e.keyCode === 65 || e.keyCode === 37) {
        leftButtonPressed = false;
    } else if (e.keyCode === 68 || e.keyCode === 39) {
        rightButtonPressed = false;
    } else if (e.keyCode === 87 || e.keyCode === 38) {
        upButtonPressed = false;
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let counter = 0;
let position = 0;
let angle = 0;
let shipVelocityX = 0;
let shipVelocityY = 0;
const sinValues = {}
let value = 0;
let valueCounter = 0.0175;
for (var i = 0; i <= 90; i++) {
    sinValues[i] = value;
    if (i >= 0 && i < 19) {
        value += 0.0172;
    } else if (i >= 19 && i < 32) {
        value += 0.016;
    } else if (i >= 32 && i < 38) {
        value += 0.0143;
    } else if (i >= 38 && i < 50) {
        value += 0.0123;
    } else if (i >= 50 && i < 58) {
        value += 0.0102;
    } else if (i >= 58 && i < 63) {
        value += 0.009;;
    } else if (i >= 63 && i < 67) {
        value += 0.007;
    } else if (i >= 67 && i < 75) {
        value += 0.0053;
    } else if (i >= 75 && i < 80) {
        value += 0.004;
    } else if (i >= 80 && i < 87) {
        value += 0.002;
    }
}
const cosValues = {}
value = 1;
valueCounter = 0.00399;
let degree = 0;
for (var i = 90; i >= 0; i--) {
    cosValues[degree] = value;
    if (i >= 87) {
        value -= 0.0005;
    } else if (i >= 80 && i < 87) {
        value -= 0.002;
    } else if (i >= 0 && i < 19) {
        value -= 0.0172;
    } else if (i >= 19 && i < 32) {
        value -= 0.016;
    } else if (i >= 32 && i < 38) {
        value -= 0.0143;
    } else if (i >= 38 && i < 50) {
        value -= 0.0123;
    } else if (i >= 50 && i < 58) {
        value -= 0.0102;
    } else if (i >= 58 && i < 63) {
        value -= 0.009;;
    } else if (i >= 63 && i < 67) {
        value -= 0.007;
    } else if (i >= 67 && i < 75) {
        value -= 0.0053;
    } else if (i >= 75 && i < 80) {
        value -= 0.004;
    }
    degree++;
}
var canvasTop = height / 2 - 400;
var canvasLeft = width / 2 - 400;
var r;
let shipAccelerationCounter = 10;
let frameCounter = 1;
let shipRotateSpeed = 0;
let ship1Speed = ship1.speed;
let bulletImage = new Image();
bulletImage.src = 'http://www.freepngimg.com/download/fire/2-fire-transparent-png-image.png';

let bullet2Image = new Image();
bullet2Image.src = "http://i.imgur.com/sN4aI5Q.png";

let bullet3Image = new Image();
bullet3Image.src = "https://cdn140.picsart.com/237839597016212.png?r240x240";

let protectiveCircle = new Image();
protectiveCircle.src = "https://opengameart.org/sites/default/files/spr_shield.png";

let engineImage = new Image();
engineImage.src = 'https://ak5.picdn.net/shutterstock/videos/34393345/thumb/2.jpg';

let explosionBulletImage = new Image();
explosionBulletImage.src = "http://pic.90sjimg.com/design/01/29/88/90/59115ddf91d9e.png";

let explosionMeteoriteImage = new Image();
explosionMeteoriteImage.src = "http://dailyslack.com/wp-content/uploads/2012/02/explosion-1.png";

var numberMeteorites = [];
let maxNrMeteorites = 0;

function createMeteorites() {
    while (numberMeteorites.length < maxNrMeteorites) {
        var meteoriteRadius = getRandomInt(20, 40);
        var meteoriteXPosition = getRandomInt(0, width);
        var meteoriteVelocityX = getRandomInt(-3, 3);
        while (meteoriteVelocityX === 0) {
            meteoriteVelocityX = getRandomInt(-3, 3);
        };
        var meteoriteVelocityY = getRandomInt(-3, 3);
        while (meteoriteVelocityY === 0) {
            meteoriteVelocityY = getRandomInt(-3, 3);
        };
        var meteorite = new MeteoriteConstructor(meteoriteRadius, meteoriteXPosition, -40, meteoriteImage, meteoriteVelocityX, meteoriteVelocityY, 100, meteoriteXPosition + meteoriteRadius, -40 + meteoriteRadius);
        numberMeteorites.push(meteorite);
    }
}


let centerShipPositionXBigCanvas = width / 2;
let centerShipPositionYBigCanvas = height / 2;
let numberBullets = [];
let bulletSpeed = 20;
let fireInterval = 3;
var fireTimer = 6;
var immunityTimer = 0;
let numberMeteoritesDestroyed = 0;



function gameOver() {
    document.getElementById('Start').blur();
    escape = false;
    ShipLife.style.display = "none";
    score.style.display = "block";
    canvas.style.visibility = "hidden";
    shipCanvas.style.visibility = "hidden";
    startGame.style.visibility = "hidden";
    gameOverVar.style.display = "block";
    ship1.life = 3;
    scoreCounter = 0;
    canvasTop = height / 2 - 400;
    canvasLeft = width / 2 - 400;
    shipVelocityX = 0;
    shipVelocityY = 0;
    frameCounter = 0;
    timer = 0;
    respawnTimer = 0.0075;
}
let weaponLvl = 1;
let shipSpeedLevel = 1;
var shipHandlinglevel = 1;

function reset() {
    weaponLvl = 0;
    shipSpeedLevel = 0;
    shipHandlinglevel = 0;
    maxShipRotateSpeed = 50;
    shipRotateAcc = 0;
    ship1.speed = 2;
    upgradeShipHandling();
    upgradeShipSpeed();
    upgradeWeapon();

}

function upgradeWeapon() {
    document.getElementById('UpgradeWeapon').blur();
    if (weaponLvl < 5) {
        weaponLvl++;
        if (weaponLvl != 5) {
            UpgradeWeapon.textContent = "Weapon Level " + weaponLvl;
        } else {
            UpgradeWeapon.textContent = "Weapon Level Max";
        }
    }
}

function upgradeShipSpeed() {
    document.getElementById("UpgradeShipSpeed").blur();
    if (shipSpeedLevel < 6) {
        ship1.speed += 2;
        shipSpeedLevel++;
        if (shipSpeedLevel != 6) {
            UpgradeShipSpeed.textContent = "Ship Speed Level " + shipSpeedLevel;
        } else {
            UpgradeShipSpeed.textContent = "Ship Speed Level Max";
        }
    }
};

let maxShipRotateSpeed = 60;
let shipRotateAcc = 1;
var maxNrMeteoritesTotal = 0;
let meteoritesDifficulty = 0;

function upgradeShipHandling() {
    document.getElementById("UpgradeShipHandling").blur();
    if (shipHandlinglevel < 6) {
        maxShipRotateSpeed += 10;
        shipRotateAcc += 1;
        shipHandlinglevel++;
        if (shipHandlinglevel != 6) {
            UpgradeShipHandling.textContent = "Ship Handling Level " + shipHandlinglevel;
        } else {
            UpgradeShipHandling.textContent = "Ship Handling Level Max";
        }
    }
};

function survival() {
    document.getElementById("Level").blur();
    score.style.display = "none";
    escape = false;
    immunityTimer = 0;
    meteoritesDifficulty = 0.00027;
    maxNrMeteoritesTotal = 10000;
    while (numberMeteorites.length != 0) {
        numberMeteorites.pop();
    };
    while (numberBullets.length != 0) {
        numberBullets.pop();
    };
    maxNrMeteorites = 0;
    canvas.style.visibility = "visible";
    shipCanvas.style.visibility = "visible";
    startGame.style.visibility = "hidden";
    gameOverVar.style.display = "none";
    ShipLife.style.display = "block";
    score.style.display = "block";
    redraw();
}

function level1() {
    document.getElementById("Level").blur();
    score.style.display = "none";
    escape = false;
    immunityTimer = 0;
    meteoritesDifficulty = 0.00020;
    maxNrMeteoritesTotal = 100;
    while (numberMeteorites.length != 0) {
        numberMeteorites.pop();
    };
    while (numberBullets.length != 0) {
        numberBullets.pop();
    };
    maxNrMeteorites = 0;
    canvas.style.visibility = "visible";
    shipCanvas.style.visibility = "visible";
    startGame.style.visibility = "hidden";
    gameOverVar.style.display = "none";
    ShipLife.style.display = "block";
    score.style.display = "block";
    redraw();
};

function level2() {
    document.getElementById("Level").blur();
    score.style.display = "none";
    escape = false;
    immunityTimer = 0;
    meteoritesDifficulty = 0.00030;
    maxNrMeteoritesTotal = 200;
    while (numberMeteorites.length != 0) {
        numberMeteorites.pop();
    };
    while (numberBullets.length != 0) {
        numberBullets.pop();
    };
    maxNrMeteorites = 0;
    canvas.style.visibility = "visible";
    shipCanvas.style.visibility = "visible";
    startGame.style.visibility = "hidden";
    gameOverVar.style.display = "none";
    ShipLife.style.display = "block";
    score.style.display = "block";
    redraw();
};

function level3() {
    document.getElementById("Level").blur();
    score.style.display = "none";
    escape = false;
    immunityTimer = 0;
    meteoritesDifficulty = 0.00045;
    maxNrMeteoritesTotal = 300;
    while (numberMeteorites.length != 0) {
        numberMeteorites.pop();
    };
    while (numberBullets.length != 0) {
        numberBullets.pop();
    };
    maxNrMeteorites = 0;
    canvas.style.visibility = "visible";
    shipCanvas.style.visibility = "visible";
    startGame.style.visibility = "hidden";
    gameOverVar.style.display = "none";
    ShipLife.style.display = "block";
    score.style.display = "block";
    redraw();
};

let scoreCounter = 0;
let respawnTimer = 0.0075
let timer = 0;

function redraw() {
    timer++;
    shipCtx.clearRect(-400, -400, width, height);
    ShipLife.textContent = 'Lives left: ' + ship1.life;
    score.textContent = 'Your score: ' + scoreCounter;
    ctx.drawImage(backgroundImage, 0, 0, width, height);
    if (maxNrMeteorites < maxNrMeteoritesTotal) {
        maxNrMeteorites += respawnTimer;
        if (timer % 360 === 0) {
            respawnTimer += meteoritesDifficulty;
        }
    }
    if (numberMeteorites.length < maxNrMeteorites) {
        createMeteorites();
    };

    if (immunityTimer < 300) {
        shipCtx.lineWidth = 10;
        shipCtx.strokeStyle = circlePatern;
        shipCtx.drawImage(protectiveCircle, -100, -100, 200, 200);
        immunityTimer++;
    }

    for (var i = 0; i < numberMeteorites.length; i++) {
        if (numberMeteorites[i].life > 0) {
            ctx.drawImage(numberMeteorites[i].image, numberMeteorites[i].positionX, numberMeteorites[i].positionY, 2 * numberMeteorites[i].radius, 2 * numberMeteorites[i].radius);
            numberMeteorites[i].positionX += numberMeteorites[i].velocityX;
            numberMeteorites[i].positionY += numberMeteorites[i].velocityY;
            numberMeteorites[i].centerX += numberMeteorites[i].velocityX;
            numberMeteorites[i].centerY += numberMeteorites[i].velocityY;
            if (numberMeteorites[i].positionY < -40) {
                numberMeteorites[i].positionY = height + 40;
                numberMeteorites[i].centerY = numberMeteorites[i].positionY + numberMeteorites[i].radius;
            } else if (numberMeteorites[i].positionY > height + 40) {
                numberMeteorites[i].positionY = -40
                numberMeteorites[i].centerY = numberMeteorites[i].positionY + numberMeteorites[i].radius;
            }
            if (numberMeteorites[i].positionX < -40) {
                numberMeteorites[i].positionX = width + 40
                numberMeteorites[i].centerX = numberMeteorites[i].positionX + numberMeteorites[i].radius;
            } else if (numberMeteorites[i].positionX > width + 40) {
                numberMeteorites[i].positionX = -40
                numberMeteorites[i].centerX = numberMeteorites[i].positionX + numberMeteorites[i].radius;
            };
            if (immunityTimer >= 300) {
                var distanceShipFromMeteorites = (centerShipPositionXBigCanvas - numberMeteorites[i].centerX) * (centerShipPositionXBigCanvas - numberMeteorites[i].centerX) +
                    (centerShipPositionYBigCanvas - numberMeteorites[i].centerY) * (centerShipPositionYBigCanvas - numberMeteorites[i].centerY);
                if (distanceShipFromMeteorites < 0) {
                    distanceShipFromMeteorites = -1 * distanceShipFromMeteorites;
                };
                if (distanceShipFromMeteorites < (ship1.shipWidth / 2 + numberMeteorites[i].radius) * (ship1.shipWidth / 2 + numberMeteorites[i].radius)) {
                    canvasTop = height / 2 - 400;
                    canvasLeft = width / 2 - 400;
                    numberMeteorites[i].life = -10;
                    ship1.life--;
                    shipVelocityX = 0;
                    shipVelocityY = 0;
                    frameCounter = 0;
                    immunityTimer = 0;
                }

                if (numberBullets.length > 0) {
                    for (var j = 0; j < numberBullets.length; j++) {
                        if (numberBullets[j].exists === true) {
                            var distanceBulletsFromMeteorites = (numberBullets[j].positionX - numberMeteorites[i].centerX) * (numberBullets[j].positionX - numberMeteorites[i].centerX) +
                                (numberBullets[j].positionY - numberMeteorites[i].centerY) * (numberBullets[j].positionY - numberMeteorites[i].centerY);
                            if (distanceBulletsFromMeteorites < 0) {
                                distanceBulletsFromMeteorites = -1 * distanceBulletsFromMeteorites;
                            };
                            if (distanceBulletsFromMeteorites < (numberBullets[j].radius + numberMeteorites[i].radius) * (numberBullets[j].radius + numberMeteorites[i].radius)) {
                                numberMeteorites[i].life -= 60 - numberMeteorites[i].radius + numberBullets[j].radius;
                                numberBullets[j].exists = false;
                                ctx.drawImage(explosionBulletImage, numberBullets[j].positionX, numberBullets[j].positionY, numberBullets[j].radius * 2, numberBullets[j].radius * 2);
                            }
                        }
                    }
                }
            }
        } else if (numberMeteorites[i].life != -100) {
            ctx.drawImage(explosionMeteoriteImage, numberMeteorites[i].positionX, numberMeteorites[i].positionY, 2 * numberMeteorites[i].radius, 2 * numberMeteorites[i].radius);
            numberMeteorites[i].life = -100;
            scoreCounter += numberMeteorites[i].radius;
            numberMeteoritesDestroyed++;
        }
    };

    if (rightButtonPressed === true && leftButtonPressed === false) {
        if (shipAccelerationCounter <= maxShipRotateSpeed) {
            shipAccelerationCounter += shipRotateAcc;
        };
        shipRotateSpeed = Math.PI / 180 * shipAccelerationCounter / 15;
    }
    if (leftButtonPressed === true && rightButtonPressed === false) {
        if (shipAccelerationCounter <= maxShipRotateSpeed) {
            shipAccelerationCounter += shipRotateAcc;
        };
        shipRotateSpeed = -Math.PI / 180 * shipAccelerationCounter / 15;
    };
    if ((leftButtonPressed === true && rightButtonPressed === false) || (leftButtonPressed === false && rightButtonPressed === true)) {
        shipCtx.rotate(shipRotateSpeed);
        if ((counter + shipRotateSpeed / Math.PI * 180 < 360) && (counter + shipRotateSpeed / Math.PI * 180 > 0)) {
            counter += shipRotateSpeed / Math.PI * 180;
        } else if (shipRotateSpeed < 0 && counter >= 0) {
            counter = 360 + (shipRotateSpeed / Math.PI * 180 + counter);
        } else if (shipRotateSpeed > 0 && counter >= 0) {
            counter = shipRotateSpeed / Math.PI * 180 - 360 + counter;
        };
        if (counter >= -0.5 && counter < 90) {
            angle = Math.round(counter);
            position = 1;
        } else if (counter >= 90 && counter < 180) {
            angle = Math.round(90 - counter + 90);
            position = 2;
        } else if (counter >= 180 && counter < 270) {
            angle = Math.round(counter - 180);
            position = 3;
        } else if (counter >= 270 && counter < 359.5) {
            angle = Math.round(90 - counter + 270);
            position = 4;
        };


    } else if ((rightButtonPressed === false && leftButtonPressed === false) || (rightButtonPressed === true && leftButtonPressed === true)) {
        if (shipAccelerationCounter > 10) {
            shipAccelerationCounter--;
            shipRotateSpeed *= 0.9;
            shipCtx.rotate(shipRotateSpeed);
            if ((counter + shipRotateSpeed / Math.PI * 180 < 360) && (counter + shipRotateSpeed / Math.PI * 180 > 0)) {
                counter += shipRotateSpeed / Math.PI * 180;
            } else if (shipRotateSpeed < 0 && counter >= 0) {
                counter = 360 + (shipRotateSpeed / Math.PI * 180 + counter);
            } else if (shipRotateSpeed > 0 && counter >= 0) {
                counter = shipRotateSpeed / Math.PI * 180 - 360 + counter;
            };
        };

        if (counter >= -0.5 && counter < 90) {
            angle = Math.round(counter);
            position = 1;
        } else if (counter >= 90 && counter < 180) {
            angle = Math.round(90 - counter + 90);
            position = 2;
        } else if (counter >= 180 && counter < 270) {
            angle = Math.round(counter - 180);
            position = 3;
        } else if (counter >= 270 && counter < 359.5) {
            angle = Math.round(90 - counter + 270);
            position = 4;
        };

    }
    if (upButtonPressed === true) {
        if (angle != 0) {
            r = cosValues[angle] / sinValues[angle];
            if (frameCounter < 101) {
                ship1Speed = frameCounter / 50 * ship1.speed;
                shipVelocityX = ship1Speed / (r + 1);
                shipVelocityY = shipVelocityX * r;
                frameCounter += 4;
            } else if (frameCounter >= 101) {
                shipVelocityX = ship1Speed / (r + 1);
                shipVelocityY = shipVelocityX * r;
            }

            if (position === 1) {
                canvasLeft += shipVelocityX;
                canvasTop -= shipVelocityY;
            } else if (position === 2) {
                canvasLeft += shipVelocityX;
                canvasTop += shipVelocityY;
            } else if (position === 3) {
                canvasLeft -= shipVelocityX;
                canvasTop += shipVelocityY;
            } else if (position === 4) {
                canvasLeft -= shipVelocityX;
                canvasTop -= shipVelocityY;
            };
        } else if (angle === 0) {
            if (frameCounter < 101) {
                ship1Speed = frameCounter / 50 * ship1.speed;
                frameCounter += 2;
            } else if (frameCounter >= 101) {
                ship1Speed = frameCounter / 50 * ship1.speed;
            };
            if (position === 1) {
                canvasTop -= ship1Speed;
            } else if (position === 2) {
                canvasLeft += ship1Speed;
            } else if (position === 3) {
                canvasTop += ship1Speed;
            } else if (position === 4) {
                canvasLeft -= ship1Speed;
            };
            shipVelocityX = ship1Speed / (r + 1);
            shipVelocityY = shipVelocityX * r;
        }
    }
    if (upButtonPressed === false && frameCounter >= 8) {
        if (angle != 0) {
            r = cosValues[angle] / sinValues[angle];
            ship1Speed = frameCounter / 50 * ship1.speed;
            shipVelocityX = ship1Speed / (r + 1);
            shipVelocityY = shipVelocityX * r;
            frameCounter -= 0.5;

            if (position === 1) {
                canvasLeft += shipVelocityX;
                canvasTop -= shipVelocityY;
            } else if (position === 2) {
                canvasLeft += shipVelocityX;
                canvasTop += shipVelocityY;
            } else if (position === 3) {
                canvasLeft -= shipVelocityX;
                canvasTop += shipVelocityY;
            } else if (position === 4) {
                canvasLeft -= shipVelocityX;
                canvasTop -= shipVelocityY;
            }
        } else if (angle === 0) {
            ship1Speed = frameCounter / 50 * ship1.speed;
            frameCounter -= 0.5;
            if (position === 1) {
                canvasTop -= ship1Speed;
            } else if (position === 2) {
                canvasLeft += ship1Speed;
            } else if (position === 3) {
                canvasTop += ship1Speed;
            } else if (position === 4) {
                canvasLeft -= ship1Speed;
            };
            shipVelocityX = ship1Speed / (r + 1);
            shipVelocityY = shipVelocityX * r;
        }
    } else if (upButtonPressed === false && frameCounter <= 8) {
        shipVelocityX = 0;
        shipVelocityY = 0;
    }

    if (canvasTop < -450) {
        canvasTop = height - 350;
    } else if (canvasTop > height - 350) {
        canvasTop = -450;
    };
    if (canvasLeft > width - 350) {
        canvasLeft = -450;
    } else if (canvasLeft < -450) {
        canvasLeft = width - 350;
    };
    centerShipPositionXBigCanvas = canvasLeft + 400;
    centerShipPositionYBigCanvas = canvasTop + 400;


    if (angle != 0) {
        r = cosValues[angle] / sinValues[angle];
    } else {
        r = 100;
    }

    shipCanvas.style.top = canvasTop + "px";
    shipCanvas.style.left = canvasLeft + "px";

    if (fireButtonPressed === true) {
        if (fireTimer % fireInterval === 0) {
            if (position === 1 || position === 2) {
                var bulletVelocityX = bulletSpeed / (r + 1) + shipVelocityX;
            } else {
                var bulletVelocityX = -bulletSpeed / (r + 1) - shipVelocityX;
            };
            if (position === 1 || position === 4) {
                if (bulletVelocityX > 0) {
                    var bulletVelocityY = -bulletVelocityX * r;
                } else {
                    var bulletVelocityY = bulletVelocityX * r;
                }
            } else {
                if (bulletVelocityX > 0) {
                    var bulletVelocityY = bulletVelocityX * r;
                } else {
                    var bulletVelocityY = -bulletVelocityX * r;
                }
            }
            if (weaponLvl === 1) {
                bulletSpeed = 10;
                fireInterval = 7;
                var bullet1 = new BulletConstructor(centerShipPositionXBigCanvas - 15, centerShipPositionYBigCanvas - 15, bullet3Image, bulletVelocityX, bulletVelocityY, true, 15);
                numberBullets.push(bullet1);
            } else if (weaponLvl === 2) {
                bulletSpeed = 10;
                fireInterval = 5;
                var bullet1 = new BulletConstructor(centerShipPositionXBigCanvas - 16, centerShipPositionYBigCanvas - 16, bulletImage, bulletVelocityX, bulletVelocityY, true, 16);
                numberBullets.push(bullet1);
            } else if (weaponLvl === 3) {
                bulletSpeed = 15;
                fireInterval = 5;
                var bullet1 = new BulletConstructor(centerShipPositionXBigCanvas - 17, centerShipPositionYBigCanvas - 17, bulletImage, bulletVelocityX, bulletVelocityY, true, 17);
                numberBullets.push(bullet1);
            } else if (weaponLvl === 4) {
                bulletSpeed = 20;
                fireInterval = 5;
                var bullet1 = new BulletConstructor(centerShipPositionXBigCanvas - 18, centerShipPositionYBigCanvas - 18, bullet2Image, bulletVelocityX, bulletVelocityY, true, 18);
                numberBullets.push(bullet1);
            } else if (weaponLvl === 5) {
                bulletSpeed = 20;
                fireInterval = 4;
                var bullet2 = new BulletConstructor(centerShipPositionXBigCanvas - 21, centerShipPositionYBigCanvas - 21, bullet2Image, bulletVelocityX, bulletVelocityY, true, 21);
                numberBullets.push(bullet2);
            }
            fireTimer = 1;
        } else {
            fireTimer++;
        }
    } else if (fireButtonPressed === false && fireTimer % 30 !== 0) {
        fireTimer--;
    };


    for (var i = 0; i < numberBullets.length; i++) {
        if (numberBullets[i].exists === true) {
            ctx.drawImage(numberBullets[i].image, numberBullets[i].positionX, numberBullets[i].positionY, numberBullets[i].radius * 2, numberBullets[i].radius * 2);
            numberBullets[i].positionX += numberBullets[i].velocityX;
            numberBullets[i].positionY += numberBullets[i].velocityY;
            if (numberBullets[i].positionX > width + 50 || numberBullets[i].positionX < -50 || numberBullets[i].positionY > height + 50 || numberBullets[i].positionY < -50) {
                numberBullets[i].exists = false;
            }
        }
    };
    if (numberBullets.length > 50) {
        numberBullets.splice(0, 1);
    };

    ship1.draw();


    if (upButtonPressed === true) {
        shipCtx.drawImage(engineImage, 192, 45, 40, 150, -3, 26, 6, 80);
    };
    if (numberMeteoritesDestroyed <= maxNrMeteoritesTotal && ship1.life >= 0 && escape === false) {
        window.requestAnimationFrame(redraw);

    } else {
        gameOver();
    }
}

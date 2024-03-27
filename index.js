const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1253;
canvas.height = 650;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const menu = document.getElementById("menu");
const startButton = document.getElementById("startButton");
const optionsButton = document.getElementById("optionsButton");
const exitButton = document.getElementById("exitButton");
const backgroundOptions = document.getElementById("backgroundOptions");

let gameStarted = false;

var myMusic;
var hitSound;
var jumpSound;
var dmgSound;
var runSound;
var deathSound;
let deathSoundPlayed = false;

myMusic = new sound("./audio/dark-cinematic-atmosphere.mp3");
myMusic.sound.volume = 0.2;
hitSound = new sound("./audio/punch-1.mp3");
hitSound.sound.volume = 0.5;
jumpSound = new sound("./audio/jump.mp3");
dmgSound = new sound("./audio/ough.mp3");
dmgSound.sound.volume = 0.5;
runSound = new sound("./audio/run.mp3");
runSound.sound.volume = 0.8;
deathSound = new sound("./audio/death.mp3");
deathSound.sound.volume = 0.7;


const player = new Fighter({
  position: {
    x: 300,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/PStik/Idle.png",
  framesMax: 5,
  scale: 0.9,
  offset: {
    x: 90,
    y: 157,
  },
  sprites: {
    idle: {
      imageSrc: "./img/PStik/Idle.png",
      framesMax: 5,
    },
    run: {
      imageSrc: "./img/PStik/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/PStik/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/PStik/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/PStik/Attack.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./img/PStik/Take Hit.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./img/PStik/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 20,
      y: 30,
    },
    width: 100,
    height: 50,
  },
});

const enemy = new Fighter({
  position: {
    x: 900,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: -50,
    y: 0,
  },
  imageSrc: "./img/PStik2/Idle.png",
  framesMax: 5,
  scale: 0.95,
  offset: {
    x: 20,
    y: 167,
  },
  sprites: {
    idle: {
      imageSrc: "./img/PStik2/Idle.png",
      framesMax: 5,
    },
    run: {
      imageSrc: "./img/PStik2/Run.png",
      framesMax: 7,
    },
    jump: {
      imageSrc: "./img/PStik2/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/PStik2/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/PStik2/Attack.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./img/PStik2/Take Hit.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./img/PStik2/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: -70,
      y: 30,
    },
    width: 80,
    height: 50,
  },
});

console.log(player);

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

startButton.addEventListener("click", startGame);
optionsButton.addEventListener("click", showOptions);
exitButton.addEventListener("click", exitGame);

backgroundOptions.style.display = "none";
function startGame() {
  if (!gameStarted) {
    menu.style.display = "none";
    gameStarted = true;
    backgroundOptions.style.display = "block";
  }
  bt1.addEventListener("click", bg1);
  bt2.addEventListener("click", bg2);
  bt3.addEventListener("click", bg3);

  function bg1() {    
    backgroundOptions.style.display = "none";
    myMusic.play();
    decreaseTimer();
    function animate() {
      window.requestAnimationFrame(animate);
      c.fillStyle = "black";
      c.fillRect(0, 0, canvas.width, canvas.height);
      background.update();

      c.fillStyle = "rgba(255, 255, 255, 0.15)";
      c.fillRect(0, 0, canvas.width, canvas.height);
      player.update();
      enemy.update();

      player.velocity.x = 0;
      enemy.velocity.x = 0;

      // pergerakan p1
      if (keys.a.pressed && player.lastKey === "a") {
        player.velocity.x = -5;
        player.switchSprite("run");
      } else if (keys.d.pressed && player.lastKey === "d") {
        player.velocity.x = 5;
        player.switchSprite("run");
      } else {
        player.switchSprite("idle");
      }

      // loncat p1
      if (player.velocity.y < 0) {
        player.switchSprite("jump");
      } else if (player.velocity.y > 0) {
        player.switchSprite("fall");
      }

      // pergerakan p2
      if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
        enemy.velocity.x = -5;
        enemy.switchSprite("run");
      } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
        enemy.velocity.x = 5;
        enemy.switchSprite("run");
      } else {
        enemy.switchSprite("idle");
      }

      // loncat p2
      if (enemy.velocity.y < 0) {
        enemy.switchSprite("jump");
      } else if (enemy.velocity.y > 0) {
        enemy.switchSprite("fall");
      }

      // deteksi titik temu dan pengurangan nyawa
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: enemy,
        }) &&
        player.isAttacking &&
        player.framesCurrent === 4
      ) {
        enemy.takeHit();
        dmgSound.play();
        player.isAttacking = false;

        gsap.to("#enemyHealth", {
          width: enemy.health + "%",
        });
      }

      // jika serangan meleset
      if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false;
      }

      // hitbox
      if (
        rectangularCollision({
          rectangle1: enemy,
          rectangle2: player,
        }) &&
        enemy.isAttacking &&
        enemy.framesCurrent === 2
      ) {
        player.takeHit();
        dmgSound.play();
        enemy.isAttacking = false;

        gsap.to("#playerHealth", {
          width: player.health + "%",
        });
      }

      // jika meleset
      if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false;
      }

      // untuk menentukan pemenang
      if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId });
        gameStarted = false;
        if (!deathSoundPlayed) {
          deathSound.play();
          deathSoundPlayed = true;
        }
        window.addEventListener("keydown", space, false);
        function space(e) {
          if (e.keyCode == 32) {
            document.location.reload();
            console.log("RESET");
          }
        }
      }
    }
    //untuk kembali ke menu
    window.addEventListener("keydown", esc, false);
    function esc(e) {
      if (e.keyCode == 27) {
        document.location.reload();
        console.log("RESET");
      }
    }

    // Deklarasi jumlah lompatan dan maks nya
    var maxJumps = 1;
    var jumpCount = 0;
    var canJump = true;
    window.addEventListener("keydown", (event) => {
      if (!player.dead) {
        switch (event.key) {
          case "d":
            // jika player mencapai batas kanan canvas, player berhenti
            if (player.position.x + player.width >= canvas.width - 30) {
              keys.d.pressed = false;
              player.switchSprite("run");
            } else {
              keys.d.pressed = true;
              player.lastKey = "d";
              player.velocity.x = 5;
              player.switchSprite("run");
              if (player.velocity.y != 0) {
                runSound.stop();
              } else {
                runSound.play();
              }
            }
            break;
          // jika player mencapai batas kiri canvas, player berhenti
          case "a":
            if (player.position.x <= player.width + 20) {
              keys.a.pressed = false;
              player.switchSprite("run");
            } else {
              keys.a.pressed = true;
              player.lastKey = "a";
              player.velocity.x = -5;
              player.switchSprite("run");
              if (player.velocity.y != 0) {
                runSound.stop();
              } else {
                runSound.play();
              }
            }
            break;
          case "w":
            // Kondisi jika loncatan player belum sampe maks loncatan
            if (canJump && jumpCount < maxJumps) {
              player.velocity.y = -16;
              jumpSound.play();
              jumpCount++;
              // kondisi jika loncatan mencapai maks
              if (jumpCount == maxJumps) {
                canJump = false;
              }
            }
            // Reset jumlah loncatan ketika menyentuh tanah
            if (player.position.y + player.height >= canvas.height + 100) {
              jumpCount = 0;
              canJump = true;
            }
            break;
          case "s":
            player.attack();
            hitSound.play();
            break;
        }
      }

      if (!enemy.dead) {
        switch (event.key) {
          case "ArrowRight":
            // jika enemy mencapai batas kanan canvas, enemy berhenti
            if (enemy.position.x + enemy.width >= canvas.width - 90) {
              keys.ArrowRight.pressed = false;
              enemy.switchSprite("run");
            } else {
              keys.ArrowRight.pressed = true;
              enemy.lastKey = "ArrowRight";
              enemy.velocity.x = 5;
              enemy.switchSprite("run");
              if (enemy.velocity.y != 0) {
                runSound.stop();
              } else {
                runSound.play();
              }
            }
            break;
          case "ArrowLeft":
            // jika enemy mencapai batas kiri canvas, enemy berhenti
            if (enemy.position.x <= enemy.width - 30) {
              keys.ArrowLeft.pressed = false;
              enemy.switchSprite("run");
            } else {
              keys.ArrowLeft.pressed = true;
              enemy.lastKey = "ArrowLeft";
              enemy.velocity.x = -5;
              enemy.switchSprite("run");
              if (enemy.velocity.y != 0) {
                runSound.stop();
              } else {
                runSound.play();
              }
            }
            break;
          case "ArrowUp":
            // jika enemy mencapai batas kiri canvas, enemy berhenti
            if (canJump && jumpCount < maxJumps) {
              enemy.velocity.y = -16;
              jumpSound.play();
              jumpCount++;
              // kondisi jika loncatan mencapai maks
              if (jumpCount == maxJumps) {
                canJump = false;
              }
            }
            if (enemy.position.y + enemy.height >= canvas.height + 100) {
              jumpCount = 0;
              canJump = true;
            }
            break;
          case "ArrowDown":
            enemy.attack();
            hitSound.play();
            break;
        }
      }
    });

    window.addEventListener("keyup", (event) => {
      switch (event.key) {
        case "d":
          keys.d.pressed = false;
          break;
        case "a":
          keys.a.pressed = false;
          break;
      }

      // enemy keys
      switch (event.key) {
        case "ArrowRight":
          keys.ArrowRight.pressed = false;
          break;
        case "ArrowLeft":
          keys.ArrowLeft.pressed = false;
          break;
      }
    });
    animate();
  }

  function bg2(){
    backgroundOptions.style.display = "none";
    myMusic.play();
    decreaseTimer();
    function animate() {
      window.requestAnimationFrame(animate);
      c.fillStyle = "black";
      c.fillRect(0, 0, canvas.width, canvas.height);
      background1.update();
      
      c.fillStyle = "rgba(255, 255, 255, 0.15)";
      c.fillRect(0, 0, canvas.width, canvas.height);
      player.update();
      enemy.update();

      player.velocity.x = 0;
      enemy.velocity.x = 0;

      // pergerakan p1
      if (keys.a.pressed && player.lastKey === "a") {
        player.velocity.x = -5;
        player.switchSprite("run");
      } else if (keys.d.pressed && player.lastKey === "d") {
        player.velocity.x = 5;
        player.switchSprite("run");
      } else {
        player.switchSprite("idle");
      }

      // loncat p1
      if (player.velocity.y < 0) {
        player.switchSprite("jump");
      } else if (player.velocity.y > 0) {
        player.switchSprite("fall");
      }

      // pergerakan p2
      if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
        enemy.velocity.x = -5;
        enemy.switchSprite("run");
      } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
        enemy.velocity.x = 5;
        enemy.switchSprite("run");
      } else {
        enemy.switchSprite("idle");
      }

      // loncat p2
      if (enemy.velocity.y < 0) {
        enemy.switchSprite("jump");
      } else if (enemy.velocity.y > 0) {
        enemy.switchSprite("fall");
      }

      // deteksi titik temu dan pengurangan nyawa
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: enemy,
        }) &&
        player.isAttacking &&
        player.framesCurrent === 4
      ) {
        enemy.takeHit();
        dmgSound.play();
        player.isAttacking = false;

        gsap.to("#enemyHealth", {
          width: enemy.health + "%",
        });
      }

      // jika serangan meleset
      if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false;
      }

      // hitbox
      if (
        rectangularCollision({
          rectangle1: enemy,
          rectangle2: player,
        }) &&
        enemy.isAttacking &&
        enemy.framesCurrent === 2
      ) {
        player.takeHit();
        dmgSound.play();
        enemy.isAttacking = false;

        gsap.to("#playerHealth", {
          width: player.health + "%",
        });
      }

      // jika meleset
      if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false;
      }

      // untuk menentukan pemenang
      if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId });
        gameStarted = false;
        if (!deathSoundPlayed) {
          deathSound.play();
          deathSoundPlayed = true;
        }
        window.addEventListener("keydown", space, false);
        function space(e) {
          if (e.keyCode == 32) {
            document.location.reload();
            console.log("RESET");
          }
        }
      }
    }
      //untuk kembali ke menu
  window.addEventListener("keydown", esc, false);
  function esc(e) {
    if (e.keyCode == 27) {
      document.location.reload();
      console.log("RESET");
    }
  }

  // Deklarasi jumlah lompatan dan maks nya
  var maxJumps = 1;
  var jumpCount = 0;
  var canJump = true;
  window.addEventListener("keydown", (event) => {
    if (!player.dead) {
      switch (event.key) {
        case "d":
          // jika player mencapai batas kanan canvas, player berhenti
          if (player.position.x + player.width >= canvas.width - 30) {
            keys.d.pressed = false;
            player.switchSprite("run");
          } else {
            keys.d.pressed = true;
            player.lastKey = "d";
            player.velocity.x = 5;
            player.switchSprite("run");
            if (player.velocity.y != 0) {
              runSound.stop();
            } else {
              runSound.play();
            }
          }
          break;
        // jika player mencapai batas kiri canvas, player berhenti
        case "a":
          if (player.position.x <= player.width + 20) {
            keys.a.pressed = false;
            player.switchSprite("run");
          } else {
            keys.a.pressed = true;
            player.lastKey = "a";
            player.velocity.x = -5;
            player.switchSprite("run");
            if (player.velocity.y != 0) {
              runSound.stop();
            } else {
              runSound.play();
            }
          }
          break;
        case "w":
          // Kondisi jika loncatan player belum sampe maks loncatan
          if (canJump && jumpCount < maxJumps) {
            player.velocity.y = -16;
            jumpSound.play();
            jumpCount++;
            // kondisi jika loncatan mencapai maks
            if (jumpCount == maxJumps) {
              canJump = false;
            }
          }
          // Reset jumlah loncatan ketika menyentuh tanah
          if (player.position.y + player.height >= canvas.height + 100) {
            jumpCount = 0;
            canJump = true;
          }
          break;
        case "s":
          player.attack();
          hitSound.play();
          break;
      }
    }

    if (!enemy.dead) {
      switch (event.key) {
        case "ArrowRight":
          // jika enemy mencapai batas kanan canvas, enemy berhenti
          if (enemy.position.x + enemy.width >= canvas.width - 90) {
            keys.ArrowRight.pressed = false;
            enemy.switchSprite("run");
          } else {
            keys.ArrowRight.pressed = true;
            enemy.lastKey = "ArrowRight";
            enemy.velocity.x = 5;
            enemy.switchSprite("run");
            if (enemy.velocity.y != 0) {
              runSound.stop();
            } else {
              runSound.play();
            }
          }
          break;
        case "ArrowLeft":
          // jika enemy mencapai batas kiri canvas, enemy berhenti
          if (enemy.position.x <= enemy.width - 30) {
            keys.ArrowLeft.pressed = false;
            enemy.switchSprite("run");
          } else {
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = "ArrowLeft";
            enemy.velocity.x = -5;
            enemy.switchSprite("run");
            if (enemy.velocity.y != 0) {
              runSound.stop();
            } else {
              runSound.play();
            }
          }
          break;
        case "ArrowUp":
          // jika enemy mencapai batas kiri canvas, enemy berhenti
          if (canJump && jumpCount < maxJumps) {
            enemy.velocity.y = -16;
            jumpSound.play();
            jumpCount++;
            // kondisi jika loncatan mencapai maks
            if (jumpCount == maxJumps) {
              canJump = false;
            }
          }
          if (enemy.position.y + enemy.height >= canvas.height + 100) {
            jumpCount = 0;
            canJump = true;
          }
          break;
        case "ArrowDown":
          enemy.attack();
          hitSound.play();
          break;
      }
    }
  });

  window.addEventListener("keyup", (event) => {
    switch (event.key) {
      case "d":
        keys.d.pressed = false;
        break;
      case "a":
        keys.a.pressed = false;
        break;
    }

    // enemy keys
    switch (event.key) {
      case "ArrowRight":
        keys.ArrowRight.pressed = false;
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = false;
        break;
    }
  });
    animate();
  }  
  function bg3() {
    backgroundOptions.style.display = "none";
    myMusic.play();
    decreaseTimer();
    function animate() {
      window.requestAnimationFrame(animate);
      c.fillStyle = "black";
      c.fillRect(0, 0, canvas.width, canvas.height);
      background2.update();

      c.fillStyle = "rgba(255, 255, 255, 0.15)";
      c.fillRect(0, 0, canvas.width, canvas.height);
      player.update();
      enemy.update();

      player.velocity.x = 0;
      enemy.velocity.x = 0;

      // pergerakan p1
      if (keys.a.pressed && player.lastKey === "a") {
        player.velocity.x = -5;
        player.switchSprite("run");
      } else if (keys.d.pressed && player.lastKey === "d") {
        player.velocity.x = 5;
        player.switchSprite("run");
      } else {
        player.switchSprite("idle");
      }

      // loncat p1
      if (player.velocity.y < 0) {
        player.switchSprite("jump");
      } else if (player.velocity.y > 0) {
        player.switchSprite("fall");
      }

      // pergerakan p2
      if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
        enemy.velocity.x = -5;
        enemy.switchSprite("run");
      } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
        enemy.velocity.x = 5;
        enemy.switchSprite("run");
      } else {
        enemy.switchSprite("idle");
      }

      // loncat p2
      if (enemy.velocity.y < 0) {
        enemy.switchSprite("jump");
      } else if (enemy.velocity.y > 0) {
        enemy.switchSprite("fall");
      }

      // deteksi titik temu dan pengurangan nyawa
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: enemy,
        }) &&
        player.isAttacking &&
        player.framesCurrent === 4
      ) {
        enemy.takeHit();
        dmgSound.play();
        player.isAttacking = false;

        gsap.to("#enemyHealth", {
          width: enemy.health + "%",
        });
      }

      // jika serangan meleset
      if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false;
      }

      // hitbox
      if (
        rectangularCollision({
          rectangle1: enemy,
          rectangle2: player,
        }) &&
        enemy.isAttacking &&
        enemy.framesCurrent === 2
      ) {
        player.takeHit();
        dmgSound.play();
        enemy.isAttacking = false;

        gsap.to("#playerHealth", {
          width: player.health + "%",
        });
      }

      // jika meleset
      if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false;
      }

      // untuk menentukan pemenang
      if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId });
        gameStarted = false;
        if (!deathSoundPlayed) {
          deathSound.play();
          deathSoundPlayed = true;
        }
        window.addEventListener("keydown", space, false);
        function space(e) {
          if (e.keyCode == 32) {
            document.location.reload();
            console.log("RESET");
          }
        }
      }
    }
    //untuk kembali ke menu
    window.addEventListener("keydown", esc, false);
    function esc(e) {
      if (e.keyCode == 27) {
        document.location.reload();
        console.log("RESET");
      }
    }

    // Deklarasi jumlah lompatan dan maks nya
    var maxJumps = 1;
    var jumpCount = 0;
    var canJump = true;
    window.addEventListener("keydown", (event) => {
      if (!player.dead) {
        switch (event.key) {
          case "d":
            // jika player mencapai batas kanan canvas, player berhenti
            if (player.position.x + player.width >= canvas.width - 30) {
              keys.d.pressed = false;
              player.switchSprite("run");
            } else {
              keys.d.pressed = true;
              player.lastKey = "d";
              player.velocity.x = 5;
              player.switchSprite("run");
              if (player.velocity.y != 0) {
                runSound.stop();
              } else {
                runSound.play();
              }
            }
            break;
          // jika player mencapai batas kiri canvas, player berhenti
          case "a":
            if (player.position.x <= player.width + 20) {
              keys.a.pressed = false;
              player.switchSprite("run");
            } else {
              keys.a.pressed = true;
              player.lastKey = "a";
              player.velocity.x = -5;
              player.switchSprite("run");
              if (player.velocity.y != 0) {
                runSound.stop();
              } else {
                runSound.play();
              }
            }
            break;
          case "w":
            // Kondisi jika loncatan player belum sampe maks loncatan
            if (canJump && jumpCount < maxJumps) {
              player.velocity.y = -16;
              jumpSound.play();
              jumpCount++;
              // kondisi jika loncatan mencapai maks
              if (jumpCount == maxJumps) {
                canJump = false;
              }
            }
            // Reset jumlah loncatan ketika menyentuh tanah
            if (player.position.y + player.height >= canvas.height + 100) {
              jumpCount = 0;
              canJump = true;
            }
            break;
          case "s":
            player.attack();
            hitSound.play();
            break;
        }
      }

      if (!enemy.dead) {
        switch (event.key) {
          case "ArrowRight":
            // jika enemy mencapai batas kanan canvas, enemy berhenti
            if (enemy.position.x + enemy.width >= canvas.width - 90) {
              keys.ArrowRight.pressed = false;
              enemy.switchSprite("run");
            } else {
              keys.ArrowRight.pressed = true;
              enemy.lastKey = "ArrowRight";
              enemy.velocity.x = 5;
              enemy.switchSprite("run");
              if (enemy.velocity.y != 0) {
                runSound.stop();
              } else {
                runSound.play();
              }
            }
            break;
          case "ArrowLeft":
            // jika enemy mencapai batas kiri canvas, enemy berhenti
            if (enemy.position.x <= enemy.width - 30) {
              keys.ArrowLeft.pressed = false;
              enemy.switchSprite("run");
            } else {
              keys.ArrowLeft.pressed = true;
              enemy.lastKey = "ArrowLeft";
              enemy.velocity.x = -5;
              enemy.switchSprite("run");
              if (enemy.velocity.y != 0) {
                runSound.stop();
              } else {
                runSound.play();
              }
            }
            break;
          case "ArrowUp":
            // jika enemy mencapai batas kiri canvas, enemy berhenti
            if (canJump && jumpCount < maxJumps) {
              enemy.velocity.y = -16;
              jumpSound.play();
              jumpCount++;
              // kondisi jika loncatan mencapai maks
              if (jumpCount == maxJumps) {
                canJump = false;
              }
            }
            if (enemy.position.y + enemy.height >= canvas.height + 100) {
              jumpCount = 0;
              canJump = true;
            }
            break;
          case "ArrowDown":
            enemy.attack();
            hitSound.play();
            break;
        }
      }
    });

    window.addEventListener("keyup", (event) => {
      switch (event.key) {
        case "d":
          keys.d.pressed = false;
          break;
        case "a":
          keys.a.pressed = false;
          break;
      }

      // enemy keys
      switch (event.key) {
        case "ArrowRight":
          keys.ArrowRight.pressed = false;
          break;
        case "ArrowLeft":
          keys.ArrowLeft.pressed = false;
          break;
      }
    });
    animate();
  }
}

//animasi gambar masih blm bisa
function showOptions() {
  const closeButton = document.querySelector(".close");
  const popUp = document.getElementById("myPopUp");

  popUp.style.display = "block";

  const info1 = new Sprite({
    position: {
      x: 300,
      y: 0,
    },
    velocity: {
      x: 0,
      y: 0,
    },
    offset: {
      x: 0,
      y: 0,
    },
    position: { x: 599, y: 400 },
    imageSrc: "./img/p1/idle.png",
    scale: 2.5,
    framesMax: 4,
    sprites: {
      idle: {
        imageSrc: "./img/p1/Idle.png",
        framesMax: 8,
      },
    },
  });
  function animate() {
    window.requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    info1.draw();
  }
  animate();
  closeButton.addEventListener("click", function () {
    popUp.style.display = "none";
  });
}

function exitGame() {
  if (confirm("Are you sure you want to exit the game?")) {
    window.close();
  }
}

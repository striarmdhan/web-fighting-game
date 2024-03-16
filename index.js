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

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
  scale: 1.25,
});

const shop = new Sprite({
  position: {
    x: 800,
    y: 250,
  },
  imageSrc: "./img/shop.png",
  scale: 2.75,
  framesMax: 6,
});

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
  imageSrc: "./img/p1/Idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157,
  },
  sprites: {
    idle: {
      imageSrc: "./img/p1/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./img/p1/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/p1/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/p1/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/p1/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./img/p1/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./img/p1/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 160,
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
  imageSrc: "./img/p2/Idle.png",
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167,
  },
  sprites: {
    idle: {
      imageSrc: "./img/p2/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "./img/p2/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/p2/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/p2/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/p2/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./img/p2/Take hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./img/p2/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50,
    },
    width: 170,
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

function startGame() {
  // Sembunyikan menu
  menu.style.display = "none";

  decreaseTimer();
  function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    c.fillStyle = "rgba(255, 255, 255, 0.15)";
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // player movement

    if (keys.a.pressed && player.lastKey === "a") {
      player.velocity.x = -5;
      player.switchSprite("run");
    } else if (keys.d.pressed && player.lastKey === "d") {
      player.velocity.x = 5;
      player.switchSprite("run");
    } else {
      player.switchSprite("idle");
    }

    // jumping
    if (player.velocity.y < 0) {
      player.switchSprite("jump");
    } else if (player.velocity.y > 0) {
      player.switchSprite("fall");
    }

    // Enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
      enemy.velocity.x = -5;
      enemy.switchSprite("run");
    } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
      enemy.velocity.x = 5;
      enemy.switchSprite("run");
    } else {
      enemy.switchSprite("idle");
    }

    // jumping
    if (enemy.velocity.y < 0) {
      enemy.switchSprite("jump");
    } else if (enemy.velocity.y > 0) {
      enemy.switchSprite("fall");
    }

    // detect for collision & enemy gets hit
    if (
      rectangularCollision({
        rectangle1: player,
        rectangle2: enemy,
      }) &&
      player.isAttacking &&
      player.framesCurrent === 4
    ) {
      enemy.takeHit();
      player.isAttacking = false;

      gsap.to("#enemyHealth", {
        width: enemy.health + "%",
      });
    }

    // if player misses
    if (player.isAttacking && player.framesCurrent === 4) {
      player.isAttacking = false;
    }

    // this is where our player gets hit
    if (
      rectangularCollision({
        rectangle1: enemy,
        rectangle2: player,
      }) &&
      enemy.isAttacking &&
      enemy.framesCurrent === 2
    ) {
      player.takeHit();
      enemy.isAttacking = false;

      gsap.to("#playerHealth", {
        width: player.health + "%",
      });
    }

    // if player misses
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
      enemy.isAttacking = false;
    }

    // end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
      determineWinner({ player, enemy, timerId });
      if (e.keyCode == 32) {
        document.location.reload();
        console.log("RESET");
      }
    }
  }

  animate();

  document.addEventListener("keydown", space, false);
  function space(e) {
    if (e.keyCode == 32) {
      document.location.reload();
      console.log("RESET");
    }
  }
  window.addEventListener("keydown", (event) => {
    if (!player.dead) {
      switch (event.key) {
        case "d":
          keys.d.pressed = true;
          player.lastKey = "d";
          break;
        case "a":
          keys.a.pressed = true;
          player.lastKey = "a";
          break;
        case "w":
          player.velocity.y = -20;
          break;
        case "s":
          player.attack();
          break;
      }
    }

    if (!enemy.dead) {
      switch (event.key) {
        case "ArrowRight":
          keys.ArrowRight.pressed = true;
          enemy.lastKey = "ArrowRight";
          break;
        case "ArrowLeft":
          keys.ArrowLeft.pressed = true;
          enemy.lastKey = "ArrowLeft";
          break;
        case "ArrowUp":
          enemy.velocity.y = -20;
          break;
        case "ArrowDown":
          enemy.attack();

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
}

function showOptions() {
  // Tampilkan opsi (mungkin dalam bentuk overlay atau layar terpisah)
  console.log("Options menu is not implemented yet");
}

function exitGame() {
  // Mungkin menampilkan konfirmasi sebelum keluar
  if (confirm("Are you sure you want to exit the game?")) {
    // Keluar dari permainan (tutup tab atau jendela, dll.)
    window.close();
  }
}

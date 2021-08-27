var game = function () {
  class Player {
    constructor(name, score, hp) {
      this.name = name;
      this.score = score;
      this.hp = hp;
    }

    getName() {
      return this.name;
    }
    setName(arr) {
      this.name = arr;
    }
    getScore() {
      return this.score;
    }
    setScore(num) {
      this.score = num;
    }
    getHp() {
      return this.hp;
    }
    setHp(num) {
      this.hp = num;
    }
  }


  let player = new Player('Player', 0, 100);
  let computers = [];
  computers.push(new Player('Computer1', 0, 100));
  computers.push(new Player('Computer2', 0, 100));
  computers.push(new Player('Computer3', 0, 100));
  computers.push(new Player('Computer4', 0, 100));
  computers.push(new Player('Computer5', 0, 100));
  let computer = computers[0];

  // Selectors
  const playerScore = document.querySelector('.player-score');
  const computerScore = document.querySelector('.computer-score');
  const playerHp = document.querySelector('.player-hp span');
  const computerHp = document.querySelector('.computer-hp span');
  const resultArea = document.querySelector('.result');
  const match = document.querySelector('.match');
  const intro = document.querySelector('.intro');
  const winner = document.querySelector('.winner');

  // Functions
  const startGame = () => {
    const startBtn = document.querySelector('.intro button');
    startBtn.addEventListener('click', () => {
      intro.classList.remove('fadeIn');
      intro.classList.add('fadeOut');
      match.classList.add('fadeIn');
    });
  }

  const playMatch = () => {
    const options = document.querySelectorAll('.options button');
    const playerHand = document.querySelector('.player-hand');
    const computerHand = document.querySelector('.computer-hand');
    const hands = document.querySelectorAll('.hands img');

    hands.forEach(hand => {
      hand.addEventListener('animationend', function () {
        this.style.animation = "";
        result();
      });
    });

    const computerOptions = ['rock', 'paper', 'scissors'];
    options.forEach(option => {
      option.addEventListener('click', function () {
        // Computer Choice
        const computerNumber = Math.floor(Math.random() * 3);
        const computerChoice = computerOptions[computerNumber];

        setTimeout(() => {
          compareHands(String(this.classList), computerChoice);
          playerHand.src = `./assets/${this.classList}.png`;
          computerHand.src = `./assets/${computerChoice}.png`;
        }, 2000);
        // Animation
        playerHand.style.animation = "shakePlayer 2s ease";
        computerHand.style.animation = "shakeComputer 2s ease";
      });
    });
  }

  const updateScore = () => {
    playerScore.textContent = player.getScore();
    computerScore.textContent = computer.getScore();
  }

  const compareHands = (playerChoice, computerChoice) => {

    if (playerChoice === computerChoice) {
      winner.textContent = 'あいこ';
      return;
    }
    // Check for Rock
    if (playerChoice === 'rock') {
      if (computerChoice === 'scissors') {
        winner.textContent = 'Playerの勝ち！';
        player.setScore(player.getScore() + 1);
        updateScore();
        attack('computer');
        return;
      } else {
        winner.textContent = 'Computerの勝ち！';
        computer.setScore(computer.getScore() + 1);
        updateScore();
        attack('player');
        return;
      }
    }
    // Check for Paper
    if (playerChoice === 'paper') {
      if (computerChoice === 'scissors') {
        winner.textContent = 'Computerの勝ち！';
        computer.setScore(computer.getScore() + 1);
        updateScore();
        attack('player');
        return;
      } else {
        winner.textContent = 'Playerの勝ち！';
        player.setScore(player.getScore() + 1);
        updateScore();
        attack('computer');
        return;
      }
    }
    // Check for Scissors
    if (playerChoice === 'scissors') {
      if (computerChoice === 'paper') {
        winner.textContent = 'Playerの勝ち！';
        player.setScore(player.getScore() + 1);
        updateScore();
        attack('computer');
        return;
      } else {
        winner.textContent = 'Computerの勝ち！';
        computer.setScore(computer.getScore() + 1);
        updateScore();
        attack('player');
        return;
      }
    }
  }

  const attack = (target) => {
    const attackMin = 30;
    const attackMax = 50;

    let attackPointFunc = (attackMin, attackMax) => {
      return Math.floor(Math.random() * (attackMax + 1 - attackMin) + attackMin);
    }

    attackPoint = attackPointFunc(attackMin, attackMax);

    if (target === 'player') {
      player.setHp(player.getHp() - attackPoint);
      playerHp.textContent = player.getHp();
      if (player.getHp() < 0) {
        player.setHp(0);
        playerHp.textContent = 0;
      }
    } else {
      computer.setHp(computer.getHp() - attackPoint);
      computerHp.textContent = computer.getHp();
      if (computer.getHp() < 0) {
        computerHp.textContent = 0;
        createComputer();
      }
    }
  }

  const result = () => {
    if (player.getHp() <= 0) {
      match.classList.remove('fadeIn');
      intro.classList.remove('fadeIn');
      setTimeout(() => {
        resultArea.classList.remove('fadeOut');
        resultArea.classList.add('fadeIn');
        restart();
      }, 1500);
    }
  }

  const restart = () => {
    const restartBtn = document.querySelector('.restart');

    restartBtn.addEventListener('click', () => {
      location.reload();
    });
  }

  const createComputer = () => {
    computers.shift();
    computer = computers[0];
    const computerName = document.querySelector('.computerName');

    computerName.textContent = computer.getName();
    computerScore.textContent = computer.getScore();
    computerHp.textContent = computer.getHp();
  }

  startGame();
  playMatch();

}
game();
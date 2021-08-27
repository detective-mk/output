const game = () => {
  let pScore = 0;
  let cScore = 0;
  let pHp = 100;
  let cHp = 100;
  const playerScore = document.querySelector('.player-score');
  const computerScore = document.querySelector('.computer-score');
  const playerHp = document.querySelector('.player-hp span');
  const computerHp = document.querySelector('.computer-hp span');
  const resultArea = document.querySelector('.result');
  const match = document.querySelector('.match');
  const intro = document.querySelector('.intro');

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
    playerScore.textContent = pScore;
    computerScore.textContent = cScore;
  }

  const compareHands = (playerChoice, computerChoice) => {
    const winner = document.querySelector('.winner');
    if (playerChoice === computerChoice) {
      winner.textContent = 'あいこ';
      return;
    }
    // Check for Rock
    if (playerChoice === 'rock') {
      if (computerChoice === 'scissors') {
        winner.textContent = 'Playerの勝ち！';
        pScore++;
        updateScore();
        attack('computer');
        return;
      } else {
        winner.textContent = 'Computerの勝ち！';
        cScore++;
        updateScore();
        attack('player');
        return;
      }
    }
    // Check for Paper
    if (playerChoice === 'paper') {
      if (computerChoice === 'scissors') {
        winner.textContent = 'Computerの勝ち！';
        cScore++;
        updateScore();
        attack('player');
        return;
      } else {
        winner.textContent = 'Playerの勝ち！';
        pScore++;
        updateScore();
        attack('computer');
        return;
      }
    }
    // Check for Scissors
    if (playerChoice === 'scissors') {
      if (computerChoice === 'paper') {
        winner.textContent = 'Playerの勝ち！';
        pScore++;
        updateScore();
        attack('computer');
        return;
      } else {
        winner.textContent = 'Computerの勝ち！';
        cScore++;
        updateScore();
        attack('player');
        return;
      }
    }
  }

  const attack = (target) => {
    const attackMin = 90;
    const attackMax = 100;

    let attackPoint = (attackMin, attackMax) => {
      return Math.floor(Math.random() * (attackMax + 1 - attackMin) + attackMin);
    }

    if (target === 'player') {
      playerHp.textContent = pHp - attackPoint(attackMin, attackMax);
      pHp = playerHp.textContent;
      if (pHp < 0) {
        pHp = 0;
        playerHp.textContent = 0;
      }
    } else {
      computerHp.textContent = cHp - attackPoint(attackMin, attackMax);
      cHp = computerHp.textContent;
      createComputer();
      // if (cHp < 0) {
      //   cHp = 0;
      //   computerHp.textContent = 0;
      // }
    }
  }

  const result = () => {
    if (pHp <= 0) {
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
      pScore = 0;
      cScore = 0;
      pHp = 100;
      cHp = 100;
      playerScore.textContent = pScore;
      computerScore.textContent = cScore;
      playerHp.textContent = pHp;
      computerHp.textContent = cHp;

      resultArea.classList.remove('fadeIn');
      resultArea.classList.add('fadeOut');
      intro.classList.add('fadeIn');
    });
  }

  const createComputer = () => {
    const computerName = document.querySelector('.computerName');
    if (cHp < 0) {
      computerName.textContent = 'Computer2';
      cHp = 100;
      computerHp.textContent = cHp;
    }
  }

  startGame();
  playMatch();

}

game();
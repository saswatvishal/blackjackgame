let Game = {
  'you': {'scoreSpan':'#game-score', 'div':'#your-box','score':0},
  'dealer': {'scoreSpan':'#dealer-score', 'div':'#dealer-row','score':0},
  'cards': ['2','3','4','5','6','7',
  '8','9','10','K','J','Q','A'],
  'cardsmap': {'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'K':10,'J':10,'Q':10,'A':1},
  'wins': 0,
  'losses': 0,
  'draws': 0,
  'Stand': false,
  'turnsOver': false,
  'logicOver': false
  }
  
  const YOU = Game['you'];
  const DEALER = Game['dealer'];
  
  const hitSound = new Audio('audio/swish.mp3');
  const bustSound = new Audio('audio/aww.mp3');
  const cashSound = new Audio('audio/cash.mp3');
  document.querySelector('#hit-button').addEventListener('click',clickhit);
  document.querySelector('#stand-button').addEventListener('click',dealerlogic);
  document.querySelector('#deal-button').addEventListener('click',blackjackDeal);
  
  
  
  function randomcard() {
  let randomIndex =  Math.floor(Math.random() * 13);
  return Game['cards'][randomIndex];
  }
  
  async function clickhit() {
  if (Game['Stand'] === false) {
  let card = randomcard();
  showcard(card, YOU);
  updateScore(card, YOU);
  showScore(YOU);
  await sleep(1000)
  if (YOU['score'] > 21) {;
    Game['logicOver'] = false;
    Game['Stand'] = true;
  dealerlogic();
  }
  }
  }
  
  function showcard(card, activePlayer) {
  if (activePlayer['score'] + Game['cardsmap'][card] <= 21) {
  let cardImage = document.createElement('img');
  cardImage.src = `./images/${card}.png`;
  document.querySelector(activePlayer['div']).appendChild(cardImage);
  hitSound.play();
  }
  }
  
  function blackjackDeal() {
  
  if (Game['turnsOver'] === true) {
  Game['Stand'] = false;
  dealCard (YOU);
  dealCard (DEALER);
  let resultDiv = document.getElementById('Game-result');
  resultDiv.innerText = "Let's Play";
  resultDiv.style.color = 'white';
  Game['turnsOver'] = false;
  Game['logicOver'] = false;
  }
  }
  
  function dealCard(activePlayer) {
  let Images = document.querySelector(activePlayer['div']).querySelectorAll('img');
  for (i=0; i < Images.length; i++) {
  Images[i].remove();
  }
  hitSound.play();
  activePlayer['score'] = 0;
  document.querySelector(activePlayer['scoreSpan']).innerText = activePlayer['score'];
  document.querySelector(activePlayer['scoreSpan']).style.color = 'white';
  }
  
  function updateScore(card, activePlayer) {
  activePlayer['score'] += Game['cardsmap'][card];
  }
  
  function showScore(activePlayer) {
  if (activePlayer['score'] > 21) {
  document.querySelector(activePlayer['scoreSpan']).innerText = 'BUST!';
  document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
  }else {
  document.querySelector(activePlayer['scoreSpan']).innerText = activePlayer['score'];
  }
  }
  
  function sleep(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async function dealerlogic() {
  if (Game['logicOver'] === false){
    Game['Stand'] = true;
  while (DEALER['score'] < 16) {
  let card = randomcard();
        showcard(card, DEALER);
        updateScore(card, DEALER);
        showScore(DEALER);
        await sleep(2000);
      } 
      Game['turnsOver'] = true;
      let winner = computeWinner();
      showResult(winner);
      Game['logicOver'] = true;
    }
  }
  
  
  function computeWinner() {
    let winner;
  
    if (YOU['score'] <=21) {
      if (YOU['score'] > DEALER['score'] || (DEALER['score'] > 21)) {
        winner = YOU;
      }else if (YOU['score'] < DEALER['score']) {
        console.log('You lost');
        winner = DEALER;
      }else if (YOU['score'] === DEALER['score']) {
        console.log('You draw');
      }
    }else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
      winner = DEALER;
    } else if (YOU['score'] > 21 && DEALER['score'] > 21) {
      console.log('You draw');
    }
    return winner;
  }
  
  function showResult(winner) {
    let message, messageColor;
  
    if (winner === YOU) {
      message = "YOU WON!";
      messageColor =  "green";
      cashSound.play();
      Game['wins']++;
      document.getElementById('wins').innerText = Game['wins'];
    } else if (winner === DEALER) {
      message = "YOU LOST!";
      messageColor = "red";
      bustSound.play();
      Game['losses']++;
      document.getElementById('losses').innerText = Game['losses'];
    } else {
      message = "YOU DRAW!";
      messageColor = "black";
      drawSound.play();
      Game['draws']++;
      document.getElementById('draws').innerText = Game['draws'];
  }
    resultDiv = document.getElementById("Game-result");
    resultDiv.innerText = message;
    resultDiv.style.color =  messageColor;
  }
  
  const triggerControl = (event) => {
    let keyCode = event.keyCode;
    if (keyCode == "72") {
      clickhit();
    } else if (keyCode == "68") {
      blackjackDeal();
    } else if (keyCode == "83") {
      dealerlogic();
    }
  }
  
  addEventListener('keydown', triggerControl);
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const img = new Image();
img.src = "assets/fb.png";

// general settings
let gamePlaying = false;
const gravity = .5;
const speed = 6.2;
const size = [51, 36];
const jump = -11.5;
const cTenth = (canvas.width / 10);

let index = 0,
    bestScore = 0, 
    flight, 
    flyHeight, 
    currentScore, 
    wood;

// wood settings
const woodWidth = 78;
const woodGap = 270;
const woodLoc = () => (Math.random() * ((canvas.height - (woodGap + woodWidth)) - woodWidth)) + woodWidth;

const setup = () => {
  currentScore = 0;
  flight = jump;

  // set initial flyHeight (middle of screen - size of the bocchi)
  flyHeight = (canvas.height / 2) - (size[1] / 2);

  // setup first 3 woods
  woods = Array(3).fill().map((a, i) => [canvas.width + (i * (woodGap + woodWidth)), woodLoc()]);
}

const render = () => {
  // make the wood and bocchi moving 
  index++;

  // ctx.clearRect(0, 0, canvas.width, canvas.height);

  // background first part 
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) % canvas.width) + canvas.width, 0, canvas.width, canvas.height);
  // background second part
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -(index * (speed / 2)) % canvas.width, 0, canvas.width, canvas.height);
  
  // wood display
  if (gamePlaying){
    woods.map(wood => {
      // wood moving
      wood[0] -= speed;

      // top wood
      ctx.drawImage(img, 432, 588 - wood[1], woodWidth, wood[1], wood[0], 0, woodWidth, wood[1]);
      // bottom wood
      ctx.drawImage(img, 432 + woodWidth, 108, woodWidth, canvas.height - wood[1] + woodGap, wood[0], wood[1] + woodGap, woodWidth, canvas.height - wood[1] + woodGap);

      // give 1 point & create new wood
      if(wood[0] <= -woodWidth){
        currentScore++;
        // check if it's the best score
        bestScore = Math.max(bestScore, currentScore);
        
        // remove & create new wood
        woods = [...woods.slice(1), [woods[woods.length-1][0] + woodGap + woodWidth, woodLoc()]];
        console.log(woods);
      }
    
      // if hit the wood, end
      if ([
        wood[0] <= cTenth + size[0], 
        wood[0] + woodWidth >= cTenth, 
        wood[1] > flyHeight || wood[1] + woodGap < flyHeight + size[1]
      ].every(elem => elem)) {
        gamePlaying = false;
        setup();
      }
    })
  }
  // draw bocchi
  if (gamePlaying) {
    ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, cTenth, flyHeight, ...size);
    flight += gravity;
    flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);
  } else {
    ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, ((canvas.width / 2) - size[0] / 2), flyHeight, ...size);
    flyHeight = (canvas.height / 2) - (size[1] / 2);
      // text accueil
    ctx.fillText(`Skor Terbaik : ${bestScore}`, 85, 245);
    ctx.fillText('Sentuh untuk main', 70, 535);
    ctx.font = "bold 30px courier";
  }

  document.getElementById('bestScore').innerHTML = `Terbaik : ${bestScore}`;
  document.getElementById('currentScore').innerHTML = `Saat Ini : ${currentScore}`;

  // tell the browser to perform anim
  window.requestAnimationFrame(render);
}

// launch setup
setup();
img.onload = render;

// start game
document.addEventListener('click', () => gamePlaying = true);
window.onclick = () => flight = jump;
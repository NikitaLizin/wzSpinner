

let canvas = null; 
let ctx = /* canvas.getContext('2d',{alpha:false}); */ null; 
let container = null; 
let spinBtn = null; 
let winnerName =  null; 
let teamPickingH2 = null; 

let teamsContainer = null; 

window.addEventListener("resize", resizeCanvas); 

// Tiers 

let topTier =  []; 
let midLowTier = []; 
let midHighTier = []; 
let bottomTier = []; 


// Canvas Config 
let segments = []; 
let numSegments = segments.length; 
let teamPicking = 0;
let reSpin = false; 
const segmentColors = [' #106fd1',' #5bbcd8',' #227b9a', ' #0e52bb',]; 
let currentAngle = 0;
let spinning = "slow";
let spinVelocity = 0;
let idleSpinVelocity = 0.002; // Slow rotation when idle

scriptOnload(); 

function resizeCanvas() {
 
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;
  const canvasSize = Math.min(containerWidth, containerHeight);

  
  const scale = window.devicePixelRatio || 2;
  canvas.width = canvasSize * scale;
  canvas.height = canvasSize * scale;
  canvas.style.width = `${canvasSize}px`;
  canvas.style.height = `${canvasSize}px`;

  ctx.scale(scale, scale);

  centerX = canvasSize / 2;
  centerY = canvasSize / 2;
  wheelRadius = canvasSize / 2;

  drawWheel();
}


// Draw the wheel
function drawWheel() {
  
  
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineCap = "round"; 
  
  for (let i = 0; i < numSegments; i++) {
    const startAngle = (i * 2 * Math.PI) / numSegments + currentAngle;
    const endAngle = ((i + 1) * 2 * Math.PI) / numSegments + currentAngle;
  
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, wheelRadius, startAngle, endAngle);
    ctx.closePath();
  
    ctx.fillStyle = segmentColors[i % segmentColors.length];
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();
  
      
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((startAngle + endAngle) / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffffff';
    let baseFontSize = wheelRadius / 10;
    let text = segments[i] || "";
    let fontSize = Math.min(baseFontSize, wheelRadius / (text.length * 0.6));
    ctx.font = `${fontSize}px Roboto`;
    ctx.fillText(text, wheelRadius * 0.85, 10);
    ctx.restore();
  }
    

}



// Spin the wheel
function spinWheel() {
  if (spinning === true || numSegments === 0) return; 
  spinning = true;
  /* spinVelocity = Math.random() * 0.1 + 0.2; */
  spinVelocity = Math.random()  + Math.random() + Math.random() * 0.1 + 0.2;
  requestAnimationFrame(animateSpin);
}

// Animate the spinning
function animateSpin() {
  if (spinVelocity > 0.001) {
    currentAngle += spinVelocity;
    if(window.innerWidth <= 600) spinVelocity *= 0.92;
    else spinVelocity *= 0.98 
     // Gradual slowing
    drawWheel();
    requestAnimationFrame(animateSpin);
  } else {
    spinning = false;
    spinVelocity = 0;
    determineWinner();
  }
}

// Determine the winner
async function determineWinner() {

  const segmentAngle = (2 * Math.PI) / numSegments;
  const adjustedAngle = (2 * Math.PI - (currentAngle % (2 * Math.PI))) % (2 * Math.PI);
  const winningIndex = Math.floor(adjustedAngle / segmentAngle);

  updateTeamPickingH2("picking"); 
  winnerName.innerHTML = `${segments[winningIndex]}!`; 
  addPlayerToTeam(segments[winningIndex]); 

  await waitTimer(); 
  winnerName.innerHTML = ""; 
  updateTeamPickingH2("spinning");
    
  // Remove the winning segment
  segments.splice(winningIndex,1); 
  

  /* uppdatePlayerTiers(winningIndex); */ 
  numSegments = segments.length;
  
    

  if ( numSegments > 0) {
    
    

    switchSegmentPos(segments); 
    
    spinWheel();

  } else if (numSegments == 0) {
      
    segments = choseTierToSpin(checkTiers()); 

    if (segments === "none") {

      currentAngle = 0;
      spinning = "slow";
      spinVelocity = 0;
      reSpin = true; 
      setTiers();   
      segments = choseTierToSpin(checkTiers()); 
      numSegments = segments.length; 
      drawWheel();

    } else {

      numSegments = segments.length;
      
      currentAngle = 0;
      spinning = false;
      spinVelocity = 0;
      spinWheel();

    }
       
  }
}

function idleSpin() {
  if (spinning === "slow") {
    currentAngle += idleSpinVelocity;
    drawWheel();
  }
  requestAnimationFrame(idleSpin);
}



function randomizeTiers (tier) {
  let playersInTier = tier.length; 
  let randomize = 0; 

  while (randomize < playersInTier /2 + 2) {

    let randomNr1 = Math.floor(Math.random() * playersInTier); 
    let randomNr2 = Math.floor(Math.random() * playersInTier); 
    let index1 = tier[randomNr1]; 
    let index2 = tier[randomNr2]; 
    tier[randomNr1] = index2; 
    tier[randomNr2] = index1;  

    randomize ++; 

  }
  return tier; 
}

function updateTeamPickingH2 (status) {

  let amountOfTeams = Number(sessionStorage.amountOfTeams); 

  switch(status) {
    case "spinning":

      teamPicking = (teamPicking == amountOfTeams) ? 1 : teamPicking = teamPicking + 1;
      teamPickingH2.innerHTML = `Team ${teamPicking} spinning`;

    break; 

    case "picking": 

      teamPickingH2.innerHTML = `Team ${teamPicking} got`;

    break; 
  }
   
    
  
}

function waitTimer () { 
  return new Promise  ((resolve) => {
    setTimeout(() =>{
      resolve("resolved"); 
    }, 1000); 
  })
}


function createTeamCards () { 

  let amountOfTeams = Number(sessionStorage.amountOfTeams); 

  for (let i = 1; i <= amountOfTeams; i++) {
    const card = document.createElement("div"); 
    const h2 = document.createElement("h2"); 
    h2.innerHTML = `Team ${i}`; 
    card.appendChild(h2); 
    teamsContainer.appendChild(card);  
  }
  
}

function addPlayerToTeam (player) {

  const p = document.createElement("p"); 
  p.innerHTML = player; 
  const card = teamsContainer.children[teamPicking]; 
  card.appendChild(p); 
}

function removePlayers (amountOfTeams) {
  for (let i = 1; i <= amountOfTeams; i++) {
    const container = teamsContainer.children[i]; 
    while (container.children.length > 1) {
      container.removeChild(container.lastChild); 
    }
  }
  reSpin = false; 
}


function setTiers () {

  const players = JSON.parse(sessionStorage.players);
  
 

  // reset the tiers if players are already in them. 
  if (topTier.length > 0) topTier = []; 
  if (midHighTier.length > 0) midHighTier = [];
  if (midLowTier.length > 0) midLowTier = [];  
  if (bottomTier.length > 0) bottomTier = [];  

  players.forEach((player) =>{
    
    if (player.bracket === "Top tier") topTier.push(player.name); 

    else if (player.bracket === "Mid-High tier") midHighTier.push(player.name);
    
    else if (player.bracket === "Mid-Low tier") midLowTier.push(player.name); 
    
    else bottomTier.push(player.name); 

  }); 


}

function checkTiers () {

  /* console.log("Top tier:", topTier + "\n" + "Middle Tier:", middleTier + "\n" + "Bottom tier:",bottomTier); */ 
  
  if (topTier.length > 0) return "Top tier"; 

  else if (midHighTier.length > 0) return "Mid-High tier";
  
  else if (midLowTier.length > 0) return "Mid-Low tier";  

  else if (bottomTier.length > 0) return "Bottom tier"; 

  else return "none"; 

}

function choseTierToSpin (tier) {
  switch (tier) {
    
    case "Top tier": 
      switchSegmentPos(topTier); 
      return topTier; 
    break; 

    case "Mid-High tier": 
      switchSegmentPos(midHighTier);
      return midHighTier; 
    break; 

    case "Mid-Low tier": 
      switchSegmentPos(midLowTier); 
      return midLowTier; 
    break; 

    case "Bottom tier": 
      switchSegmentPos(bottomTier);
      return bottomTier; 
    break; 

    default: 
      return "none"
    break; 
  }
}

function buttonAnimation (e) {

  
  e.classList.add("activeButton"); 

  setTimeout(() =>{
    e.classList.remove("activeButton");  
  },1000); 
  
}

function copyTeams (e) {

  buttonAnimation(e.target); 

  const amountOfTeams = sessionStorage.amountOfTeams; 
  let message = ""; 

  for(let i = 1; i <= amountOfTeams ; i ++) {

    const teamCard = teamsContainer.children[i];
    const teamCardChildren = teamCard.children.length; 
    
   for (let j = 0; j < teamCardChildren; j++) {
      if (j === 0) {
        
        if (i === 0) message = `${teamCard.innerHTML} \n \n` 

        else message = ` ${message} \n \n ${teamCard.children[j].innerHTML}`; 
        
        
      } else {
        message = `${message} \n ${j}). ${teamCard.children[j].innerHTML}`; 
      }
   }
   
  }
  navigator.clipboard.writeText(message); 

}

function copyBtn () {

  let btn = document.createElement("span"); 
  btn.classList.add("material-icons-round"); 
  btn.innerHTML = "content_copy"; 

  btn.addEventListener("click",copyTeams); 

  return btn; 
}

function scriptOnload () {

  createWinnerCard(); 

  createCanvas(); 

  createTeamsContainer();   
  
  setTiers(); 

  /* createShuffleBtn(); */ 
  
  segments = choseTierToSpin(checkTiers()); 
  numSegments = segments.length; 

   

  /* createTeamCards(); */ 

  container.style.display = "flex"; 

  resizeCanvas(); 
  
  updateTeamPickingH2("spinning");
  idleSpin("spin"); 

}

function randomizeTeams (e) {

  buttonAnimation(e.target); 

  if (reSpin) removePlayers(Number(sessionStorage.amountOfTeams)); 

  const amountOfTeams = Number(sessionStorage.amountOfTeams); 
 
  while (numSegments > 0) {

    

    let randomNr = Math.floor(Math.random() * numSegments); 
    let pickedPlayer = segments[randomNr];
    addPlayerToTeam(pickedPlayer);  
    segments.splice(randomNr,1); 
    numSegments = segments.length;  
    teamPicking = (teamPicking == amountOfTeams) ? 1 : teamPicking = teamPicking + 1;
    
    if (numSegments == 0) {
      segments = choseTierToSpin(checkTiers());   
      if (segments === "none") break;
      else numSegments = segments.length;  
    }

  }
  reSpin = true
  setTiers();   
  segments = choseTierToSpin(checkTiers()); 
  numSegments = segments.length;
  
}


function createShuffleBtn () {
  let button = document.createElement("span"); 
  button.classList.add("material-icons-round"); 
  button.innerHTML = "shuffle";
  button.addEventListener("click",randomizeTeams); 
  
  
  return button; 


}

function createCanvas () {
  
  container = document.createElement("div"); 
  container.id = "wheelContainer"; 
  
  canvas = document.createElement("canvas"); 
  canvas.id = "wheelCanvas"; 

  container.appendChild(canvas); 

  let arrow = document.createElement("div"); 
  arrow.classList.add("arrow"); 

  container.appendChild(arrow); 

  spinBtn = document.createElement("button"); 
  spinBtn.id = "spinBtn"; 
  spinBtn.innerHTML = "Spin!"; 

  // Detect spin button click
  spinBtn.addEventListener('click', (event) => {
    if (reSpin) removePlayers(sessionStorage.amountOfTeams);
    console.log(Boolean(spinning)); 
    spinWheel();
  });

  container.appendChild(spinBtn); 

  main.appendChild(container); 

  ctx = canvas.getContext('2d',{alpha:false});

  

}

function createTeamsContainer () {

  teamsContainer = document.createElement("div"); 
  teamsContainer.classList.add("teamsContainer"); 

  let topContainer = document.createElement("div"); 
  topContainer.classList.add("topContainer");

  let copyBt = copyBtn(); 
  let shuffleBtn = createShuffleBtn(); 

  topContainer.appendChild(copyBt); 
  topContainer.appendChild(shuffleBtn); 
  

  teamsContainer.appendChild(topContainer); 
  createTeamCards(); 

  main.appendChild(teamsContainer); 

  if (screenWidth <= 600) teamsHeaderBtn(); 

}

function teamsHeaderBtn () {

  let button = document.createElement("button"); 
    button.innerHTML = "Teams"; 
    button.classList.add("teamsBtn"); 

    let span = document.createElement("span"); 
    span.innerHTML = "visibility"; 
    span.classList.add("material-icons-round"); 

    button.appendChild(span); 

    let menu = document.querySelector(".menu"); 
    menu.appendChild(button);
    
    button.addEventListener("click", (e) => {
      let list = teamsContainer.classList;
      if (list[1] === "closeTeamsContainer") {

        list.replace("closeTeamsContainer","openTeamsContainer");
        span.innerHTML = "visibility"; 

      } else if  (list[1] === "openTeamsContainer") {

        list.replace("openTeamsContainer", "closeTeamsContainer"); 
        span.innerHTML = "visibility_off"; 

      } else {

        list.add("openTeamsContainer"); 
        span.innerHTML = "visibility_off";

      } 
          
        
      
       
    }); 

}

function createWinnerCard () {

  let card = document.createElement("div"); 
  card.classList.add("winnerCard"); 

  teamPickingH2 = document.createElement("h2"); 
  
  card.appendChild(teamPickingH2); 

  winnerName = document.createElement("strong"); 
  
  card.appendChild(winnerName); 

  main.appendChild(card); 
}

function switchSegmentPos (segments) { 
  let numSegments = segments.length; 

  let segmentsSwitched = 0; 

  while (segmentsSwitched < numSegments/2 + 2) {
    
    let randomNr1 = Math.floor(Math.random() * numSegments); 
    let randomNr2 = Math.floor(Math.random() * numSegments); 
    let player1 = segments[randomNr1]; 
    let player2 = segments[randomNr2]; 

    segments[randomNr1] = player2; 
    segments[randomNr2] = player1; 

    segmentsSwitched++; 
    
  }
  
}

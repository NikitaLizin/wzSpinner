



let formContainer = document.querySelector(".form"); 
const header = document.querySelector("header");
let screenWidth = window.innerWidth;
const main = document.querySelector("main");





 


  


 
 

window.addEventListener("resize", resize); 
window.onload = onloadFunction(); 


function setTournamentType () {

  // collect tournament type 
  let tournamentType = collectTournamentType();

   
  
  if (tournamentType) {
  
  // save the tournamentType in session
  sessionStorage.setItem("tournamentType",tournamentType);
  deleteForm(); 
  playerAmountForm();
  createHeaderBtn();     

  // hide the type form. 
  /* form.type.style.display = "none";  */

  /* form.container.children[1].style.display = "none"; */ 

  // remove event listener
  /* form.btn.removeEventListener("click", setTournamentType);  */

  // show the playerAmountForm
  /* form.playerAmount.style.display = "flex";  */

  /* form.container.children[2].style.display = "flex"; */ 

  /* range.addEventListener("input", (e) =>{
    setThumb(e.target.value,thumb.clientWidth); 
    setCount(e.target.value);
    setEmojy(e.target.value);
    setMessage(e.target.value);  
     
  });  */
 

  
  /* range.setAttribute("step",sessionStorage.tournamentType); 
  
  // add new eventListener
  form.btn.addEventListener("click",setPlayerAmount);  */
  
  } else {
    console.log("Need to chose a Tournament type!");
  }
    
    
  
}

function setPlayerAmount (range) {

  let tournamentType = Number(sessionStorage.tournamentType); 
  const playerAmount = checkPlayerAmount(tournamentType, range.value); 

  if (playerAmount) {

    /* form.container.children[2].style.display = "none"; */ 

    // textArea.style.display = "block"; 

    /* form.container.children[3].style.display = "block"; */ 

    // calculate amount of teams depending on tournament type and amount of players

    let amountOfTeams = Number(range.value) / tournamentType; 
    
    // save amount of players in sessionStorage. 
    sessionStorage.setItem("amountOfPlayers",range.value);

    // save amount of teams in session storage. 
    sessionStorage.setItem("amountOfTeams", amountOfTeams);

    deleteForm(); 

    playerNamesForm();
    
    createHeaderBtn(); 

    
    /* form.btn.removeEventListener("click", setPlayerAmount); 
    form.btn.addEventListener("click",setPlayerNames);  */

  } else {
    console.log("u need to have atleast 2 teams"); 
  }
  
}

function setPlayerNames (textArea) {
  const playerInfo = collectPlayerNames(textArea); 
  
  if (!playerInfo) {
    
    /* form.container.children[3].style.display = "none"; */ 

    /* form.btn.removeEventListener("click",setPlayerNames); */ 
    /* form.btn.addEventListener("click",setPlayerTiers);  */ 
    
    /* let bracketForm = form.container.children[4] */
    /* bracketForm.style.display = "flex";  */
    /* createPlayerCards(bracketForm); */

     

    deleteForm(); 
    bracketForm(); 
        
    createHeaderBtn(); 
     
     

  } else {
    console.log(playerInfo); 
  }

}

function setPlayerTiers (container) {

  const tiersCollected = collectTiers(container); 

  if (tiersCollected) {
    /* form.btn.removeEventListener("click",setPlayerTiers); 
    form.container.style.display = "none"; */ 
     
    /* form.container.children[4].style.display = "none"; */ 

    sessionStorage.setItem("brackets",true);
    
    if (Boolean(sessionStorage.spinner)) {
      
      changeMain("spinner"); 
      scriptOnload(); 
       
    } else {
      changeMain("spinner"); 
      loadWheelScript(); 
    } 
    

    
        
    createHeaderBtn(); 

    deleteForm(); 
    
    




    /* changeMain();  */ 

    /*   */

   // load the wheel script  
     
  }
}

function setThumb ( thumb, value,thumbWidth) {
  thumb.style.left = `calc(${value}% - ${thumbWidth/2}px)`; 
}

function setEmojy (thumb,value) {
  if (value == 0) thumb.innerHTML = "&#128557"; 
  else if (value > 0 && value <= 10) thumb.innerHTML = "&#128546"; 
  else if (value > 10 && value <= 15) thumb.innerHTML = "&#128530";
  else if (value > 15 && value <= 25) thumb.innerHTML = "&#128527"; 
  else if (value > 25 && value <= 50) thumb.innerHTML = "&#128526"; 
  else if (value > 50 && value <=100) thumb.innerHTML = "&#128525";
}

function setMessage (rangeMessage,value) {
  if (value == 0) rangeMessage.innerHTML = "Get some friends"; 
  else if (value > 0 && value <= 10) rangeMessage.innerHTML = "fast tourney.."; 
  else if (value > 10 && value <= 15) rangeMessage.innerHTML = "Can Bean skip dinner?";
  else if (value > 15 && value <= 25) rangeMessage.innerHTML = "Argus is starting to drool.."; 
  else if (value > 25 && value <= 50) rangeMessage.innerHTML = "Few more for a rebirth customs.."; 
  else if (value > 50 && value <=100) rangeMessage.innerHTML = "Time to think about big map customs..";
}

function setCount ( rangeValue, value) {
  rangeValue.innerHTML = value; 
}

function checkPlayerAmount (amount, inputValue) {
  if (Number(inputValue) === 0 || Number(inputValue) < amount * 2) return false; 
  else return true; 
}

function loadWheelScript () {
  const script = document.createElement("script"); 
  script.src = "./wheel.js"; 
  document.body.appendChild(script); 
  sessionStorage.setItem("spinner", "true");    
}

function collectPlayerNames (textArea) {
  // Collect all the text inside the textArea 
  let textAreaValue = /* form.container.children[3].value;  */ textArea.value; 

  let rowsValue = textAreaValue.split("\n"); 

  let amountOfPlayers = Number(sessionStorage.amountOfPlayers); 
  
  //Save all the player information inside the players array.  
  let players = []; 
  
  // remove all the empty lines inside the textArea
  let playerNames = rowsValue.filter((line) => {
     
    return line.trim().length > 0; 
  }); 
 
  // if there is to many or to litle players send a error message
  if (playerNames.length > amountOfPlayers) return `You need to remove ${players.length - amountOfPlayers} players `; 
  else if (playerNames.length < amountOfPlayers) return `You need to add ${amountOfPlayers - players.length} players`;    

  // if there is no errors 
  else {

    playerNames.forEach((player, index) => { 
    
        
      const playerInfo = {
        name: player, 
        id: index, 
        bracket: null, 
      }

      players.push(playerInfo); 
    });  
    
    sessionStorage.setItem("players",JSON.stringify(players)); 
    return false;  
  }
  
} 

function createPlayerCards (form) {

  let players = JSON.parse(sessionStorage.players); 

  players.forEach((player)=>{
    const div = document.createElement("div"); 

    const indexInput = document.createElement("input"); 
    indexInput.type = "hidden"; 
    indexInput.value = player.id; 
    
    const tierInput = document.createElement("input"); 
    tierInput.type = "text"; 
    tierInput.disabled = true; 
    tierInput.placeholder = "Click to change tier";  

    const p = document.createElement("p"); 
    p.innerHTML = player.name; 

    div.onclick = function (e) {switchTier(e.target)}; 

    div.appendChild(indexInput); 
    div.appendChild(tierInput);
    div.appendChild(p);  

    form.appendChild(div); 

  }); 
}

function switchTier (element) {
  const tierInput = element.childNodes[1] 
  let value = tierInput.value; 
  
  
  switch (value) {
    case "Bottom tier": 
      element.style.backgroundColor = " #2C88DD";
      tierInput.value = "Middle tier"; 
    break; 
    case "Middle tier": 
      element.style.backgroundColor =  " #1F73C1"
      tierInput.value = "Top tier"; 
    break; 
    default: 
      element.style.backgroundColor =  " #509BE2"
      tierInput.value = "Bottom tier"
    break; 
    }
}

function collectTiers (container) {
  const cards = /* form.container.children[4].children */ container.children; 
  let status = true; 
  
  // create a variable of session storage save player info 
  let players = JSON.parse(sessionStorage.players);
  let amountOfPlayers = players.length;  

  for (let i = 0; i < amountOfPlayers; i++) {
    
    const playerIndex = cards[i].children[0].value 
    const playerBracket = cards[i].children[1].value;

    

    if (!playerBracket) {

      console.log("You have not set a value on card: " + cards[i].children[2].innerHTML); 
      status = false; 
      break; 

    } else {

      players[playerIndex].bracket = playerBracket; 

      if (i+1 === amountOfPlayers) status === true; 
      
    } 
  }

  sessionStorage.players = JSON.stringify(players); 
  return status; 
   
}

function onloadFunction () {
  
  const step = checkFormProgress(); ; 

  if (screenWidth <= 600) createPhoneMenu(); 

  for (let i = 1; i <= step ; i++) {
    headerBtn(i); 
  }
  

  switch(Number(step)) {

    case 1: 
    
      /* form.container.children[1].style.display = "flex";
      form.btn.addEventListener("click", setTournamentType);  */
      typeForm();  

    break; 
    case 2: 

      /* form.container.children[2].style.display = "flex"; 
      range.setAttribute("step",Number(sessionStorage.tournamentType)); 
      form.btn.addEventListener("click",setPlayerAmount);
      range.addEventListener("input", (e) =>{
        setThumb(e.target.value,thumb.clientWidth); 
        setCount(e.target.value);
        setEmojy(e.target.value);
        setMessage(e.target.value);  
         
      }); */

      playerAmountForm(); 

    break; 
    case 3:
      playerNamesForm();
      /* form.btn.addEventListener("click",setPlayerNames); 
      form.container.children[3].style.display = "flex";  */
    
    break;  
    case 4:

      /* form.btn.addEventListener("click",setPlayerTiers)
      let bracketForm = form.container.children[4]
      bracketForm.style.display = "flex"; 
      createPlayerCards(bracketForm); */

      bracketForm(); 

    break;
    case 5: 

      changeMain("spinner");  
      loadWheelScript(); 

    break; 

  }
  
}

function headerBtn (step) {

  const button = document.createElement("button"); 
  button.classList.add("headerBtn"); 


  let status = true; 
  
  
  
  switch (step) {
    case 1: 

           

      button.innerHTML = "Tournament Type";
      
      // add a onClick to the button 
      button.addEventListener("click", () =>{
        let formStatus = formContainer.style.display; 
        changeMain("form"); 
         
        

        if (formStatus === "none") {
          formContainer.style.display = "grid";  
            
          typeForm();  
        } else {
          deleteForm(); 
          typeForm()
        }

        
        
        
      }); 

      

       

        
    break; 
    case 2:   
        
      button.innerHTML = "Amount Of Players"; 
      
      button.addEventListener("click", () =>{
        let formStatus = formContainer.style.display; 
        editMode = true; 
        changeMain("form"); 
        if (formStatus === "none") {
          formContainer.style.display = "grid"; 
          playerAmountForm()  
        } else {
          deleteForm(); 
          playerAmountForm(); 
        }
        
      });   

      
         
    break; 
    case 3: 
        
      button.innerHTML = "Player Names"; 
      button.addEventListener("click", () =>{
        let formStatus = formContainer.style.display; 
        changeMain("form");

        if (formStatus === "none") {
          formContainer.style.display = "grid";   
          playerNamesForm();   
        } else {
          deleteForm(); 
          playerNamesForm(); 
        }
        
      }); 

      
         
    break; 
    case 4:
        
      button.innerHTML = "Player Tiers"; 
      
      button.addEventListener("click", () =>{
        let formStatus = formContainer.style.display; 
        changeMain("form");

        if (formStatus === "none") {
          formContainer.style.display = "grid";   
          bracketForm();   
        } else {
          deleteForm(); 
          bracketForm(); 
        }
        
      }); 

      
        
    break;  
    case 5: 
        
      button.innerHTML = "Wheel"; 
      
      button.addEventListener("click", () =>{

        changeMain("spinner"); 


      }); 

      
        
         
    break; 

    default: 
      status = false; 
    break; 

  }  

 

 

  
  if (status === true) {
    
    if (screenWidth <= 600) document.body.children[0].appendChild(button);
  
    else header.appendChild(button);
  
  } else {
    return false; 
  }

  
  
     
  
}

function collectTournamentType () {
  let inputs = document.querySelectorAll("input[name = type]"); 
  let amountOfInputs = inputs.length
  let tournamentType = null; 


  for (let i = 0; i < amountOfInputs; i++) {
    console.log(inputs[i].checked); 
    if (inputs[i].checked) {
      tournamentType = inputs[i].value; 
      break; 
    } else continue; 

  }

  return tournamentType; 
 
}

function checkFormProgress () {

  if (sessionStorage.brackets) return 5; 

  else if (sessionStorage.players) return 4; 

  else if (sessionStorage.amountOfPlayers) return 3; 

  else if (sessionStorage.tournamentType) return 2; 

  else return 1; 
  
}

function createPhoneMenu () {
  
  // create open menu Btn 
  const  openMenuBtn = document.createElement("span"); 
  openMenuBtn.classList.add("material-icons-round");
  openMenuBtn.innerHTML = "menu";
  openMenuBtn.classList.add("menuBtn"); 
  
  header.appendChild(openMenuBtn);

  // create Menu 

  const menu = document.createElement("div"); 
  menu.classList.add("menu"); 
  menu.style.display = "none";
  
  document.body.insertBefore(menu, document.body.children[0]); 


  // create closeMenuBtn; 

  const closeMenuBtn = document.createElement("span"); 
  closeMenuBtn.classList.add("material-icons-round"); 
  closeMenuBtn.innerHTML = "close"; 
  closeMenuBtn.id = "closeMenuBtn"; 

  menu.appendChild(closeMenuBtn); 

  openMenuBtn.addEventListener("click", () =>{

      menu.style.display = "flex"; 
      menu.style.animation = "openMenu"; 
      menu.style.animationDuration = "120ms"; 
      menu.style.animationTimingFunction = "ease-in-out";
      menu.style.animationFillMode = "forwards"; 
      openMenuBtn.style.display = "none";  
    }); 

    closeMenuBtn.addEventListener("click", () =>{

      menu.style.animation = "closeMenu"; 
      menu.style.animationDuration = "120ms"; 
      menu.style.animationTimingFunction = "ease-in-out"; 
      menu.style.animationFillMode  = "forwards"; 
      openMenuBtn.style.display = "block"; 
    });  

}

// forms 

function createFormButton() {
  let button = document.createElement("button");
  button.id = "selectBtn"; 
  button.innerHTML = "Next"; 

  let span = document.createElement("span"); 
  span.innerHTML = "arrow_forward_ios"; 
  span.classList.add("material-symbols-rounded"); 

  button.appendChild(span); 

  return button; 
}

function createH2 (text) {
  let h2 = document.createElement("h2"); 
  h2.innerHTML = text; 

  return h2; 
}

function typeForm () {

  let div = document.createElement("div"); 
  div.classList.add("typeForm"); 
  div.id = "type"; 

  let amountOfInputs = 3; 

  let h2 = createH2("Select Tournament Type!"); 
   

  
  let button = createFormButton(); 
  button.addEventListener("click", setTournamentType);
  

  formContainer.appendChild(h2); 
  formContainer.appendChild(div); 
  formContainer.appendChild(button); 
  

  

  for (let i = 1; i <= amountOfInputs; i++) {

    let input = document.createElement("input"); 
    input.setAttribute("type", "radio"); 
    input.setAttribute("name", "type");
    input.style.display = "none";  

    let label = document.createElement("label"); 
    label.classList.add("typeLabel"); 


    switch (i) {
      case 1: 

        input.id = "duos"; 
        input.value = "2"; 
      
        label.setAttribute("for", "duos"); 
        label.innerHTML = "Duos"


      break; 

      case 2: 
        
        input.id = "trios"; 
        input.value = "3"; 
        label.setAttribute("for", "trios"); 
        label.innerHTML = "Trios"; 
      
      break; 

      case 3:

        input.id = "quads"; 
        input.value = "4"; 
        label.setAttribute("for", "quads"); 
        label.innerHTML = "Quads"
      
      break; 
    }

    div.appendChild(input); 
    div.appendChild(label); 
    
    
  }


  
  
}

function playerAmountForm () {
  
  let div = document.createElement("div"); 
  div.classList.add("playerAmountForm"); 
  div.id = "playerAmount"; 

  let h2 = createH2("Select Amount Of Players"); 

   

  let h3 = document.createElement("h3"); 
  h3.id = "rangeValue"; 
  h3.innerHTML = "0"; 

  let p = document.createElement("p"); 
  p.id = "rangeMessage"; 
  p.innerHTML = "Get some friends"; 

  let line = document.createElement("div"); 
  line.classList.add("line"); 

  let range = document.createElement("input"); 
  range.setAttribute("type", "range"); 
  range.setAttribute("min", "0"); 
  range.setAttribute("max", "100"); 
  range.value = 0; 
  range.id = "rangeInput"; 
  range.setAttribute("step",Number(sessionStorage.tournamentType)); 

  let button = createFormButton(); 
  button.addEventListener("click", () =>{
    setPlayerAmount(range); 
  })

  let thumb = document.createElement("span"); 
  thumb.classList.add("thumb"); 
  thumb.innerHTML = "&#128557;"; 

  line.appendChild(range); 
  line.appendChild(thumb); 

  div.appendChild(h3); 
  div.appendChild(p); 
  div.appendChild(line); 

  formContainer.appendChild(h2); 
  formContainer.appendChild(div); 
  formContainer.appendChild(button); 

  

  range.addEventListener("input", (e) =>{

    setThumb( thumb, e.target.value,thumb.clientWidth); 
    setCount(h3,e.target.value);
    setEmojy(thumb,e.target.value);
    setMessage(p,e.target.value);  
     
  });


  


  

}

function playerNamesForm () {

  let h2 = document.createElement("h2"); 
  h2.innerHTML = "Input Player Names"; 
  formContainer.appendChild(h2); 

  let textArea = document.createElement("textarea");
  textArea.placeholder = "Type in the player names.."
  textArea.id = "playerNamesArea"; 
  textArea.spellcheck = "false"; 
  textArea.rows = "12"; 

  formContainer.appendChild(textArea); 

  let button = createFormButton();
  button.addEventListener("click", (e) =>{
    setPlayerNames(textArea); 
  });  
  
  formContainer.appendChild(button); 
}

function bracketForm () {
  
  let h2 = document.createElement("h2"); 
  h2.innerHTML = "Sort Players Into Tiers"; 

  formContainer.appendChild(h2); 

  let div = document.createElement("div"); 
  div.classList.add("bracketForm"); 

  formContainer.appendChild(div); 

  let button = createFormButton();
  
  button.addEventListener("click", (e) =>{
    setPlayerTiers(div); 
    e.target.removeEventListener("click",(e)); 
  });  

  formContainer.appendChild(button);
  
  createPlayerCards(div); 


}

function deleteForm () {

  while(formContainer.hasChildNodes()) {
    formContainer.removeChild(formContainer.firstChild); 
  }

}

function changeMain (status) { 

  if (status === "spinner") {

    deleteForm(); 
    formContainer.style.display = "none"; 
    main.style.display = "grid";
     
  } else {
    
    while(main.children.length != 1) {
      main.removeChild(main.lastChild); 
    }

    main.style.display = "flex"; 
  }
}

function createHeaderBtn () {

  let createHeader = 0; 

  let amountOfButtons = document.querySelectorAll(".headerBtn").length; 

  if (sessionStorage.tournamentType && amountOfButtons === 1) createHeader = 2; 
  else if (sessionStorage.amountOfPlayers && amountOfButtons === 2) createHeader = 3; 
  else if (sessionStorage.players && amountOfButtons === 3) createHeader =  4; 
  else if (sessionStorage.brackets && amountOfButtons === 4) createHeader =  5; 
  else if (sessionStorage.spinner && amountOfButtons === 5) createHeader =  6; 
  else return null;

  headerBtn(createHeader); 
} 


function resize () {
  screenWidth = window.innerWidth; 
  let menu = document.querySelector(".menu") || false; 
  let menuBtn = document.querySelector(".menuBtn") || false;  

  if (screenWidth <= 600 ) {
    if (Boolean(menu)) {
      console.log("menu is created"); 
    } else {
      createPhoneMenu(); 
      // add the header buttons to the menu
      menu = document.querySelector(".menu") || false;

      while (header.childElementCount != 1) {
        let btn = header.firstChild; 
        menu.append(btn); 
      }

       

      if (sessionStorage.spinner === "true") teamsHeaderBtn(); 
      
      console.log(menu);
    }
  }
  else if (screenWidth > 600) {
    
    
    if (Boolean(menu)) {
      console.log(menu.childElementCount); 
      let elements = document.querySelectorAll(".headerBtn"); 

      for (let i = 0, x = elements.length; i < x; i++ ) {
        header.appendChild(elements[i]); 
      }
      menu.remove(); 
      menuBtn.remove(); 
       
    }
  }
}
 
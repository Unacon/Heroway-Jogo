
const TILE_SIZE = 48;
const HELMET_OFFSET = 12;
const GAME_SIZE = TILE_SIZE * 20;

const root = document.documentElement;
root.style.setProperty('--tile-size',`${TILE_SIZE}px`) // 48px
root.style.setProperty('--helmet-offset',`${HELMET_OFFSET}px`)  // 12px
root.style.setProperty('--game-size',`${GAME_SIZE}px`) // 960px

// ---------

function createBoard(){
  const boardElement = document.getElementById('board');
  const elements = [];

  function createElement(options){
    let {item, top, left} = options;
    
    const currentElement = {item , currentPosition : {top, left}};
    elements.push(currentElement);

    //console.log(elements);

    const htmlElement = document.createElement('div');
    htmlElement.className = item;
    htmlElement.style.top = `${top}px`;
    htmlElement.style.left = `${left}px`;

    boardElement.appendChild(htmlElement);

    function getNewDirection(buttonPressed, position){
      switch(buttonPressed){
        case 'ArrowUp':
          return({ top: position.top - TILE_SIZE, left: position.left});
        case 'ArrowRight':
          return({ top: position.top, left: position.left + TILE_SIZE});
        case 'ArrowDown':
          return({ top: position.top + TILE_SIZE, left: position.left});
        case 'ArrowLeft':
          return({ top: position.top, left: position.left - TILE_SIZE});
        default:
          return position;
      }
    }

    function validateMoviment(position, conflitItem, item){
      
      if(item === 'mini-demon'){
        if(conflitItem?.item === 'chest' || conflitItem?.item === 'trap'){
          return false;
        }
      }
      
      return(
        position.left >= 48 &&
        position.left <= 864 &&
        position.top >= 96 &&
        position.top <= 816 &&
        conflitItem?.item !== 'forniture'
      )
    }
    
    function getMovimentConflict(position, els){
      const conflitItem = els.find((currentElement) =>{
        return(
          currentElement.currentPosition.top === position.top &&
          currentElement.currentPosition.left === position.left
        )        
      });      
     // console.log(conflitItem);
      return conflitItem;
    }

    function validateConflicts( currentEl, conflitItem){
      function finishGame(massage){
        setTimeout(() => {
          alert(massage);
          location.reload();
        },100);
      }
      
      if(!conflitItem){
        return;
      }

      if(currentEl.item === 'hero'){
        if(
          conflitItem.item === 'mini-demon' ||
          conflitItem.item === 'trap'
        ) {
          finishGame('Is dead');
        }

        if(conflitItem.item === 'chest'){
          finishGame('You Win!!');
        }
      }      

      if(currentEl.item == 'mini-demon' && conflitItem.item == 'hero'){
        finishGame('Is dead');        
      }   
    }


    function move(buttonPressed){
     // console.log('move',buttonPressed);

      const newPosition = getNewDirection(buttonPressed, currentElement.currentPosition);
      const conflitItem = getMovimentConflict(newPosition, elements);
      const isValidatePosition = validateMoviment(newPosition, conflitItem, currentElement.item);
      
      //console.log(isValidatePosition);
      //console.log(elements);

      if(isValidatePosition){
        currentElement.currentPosition = newPosition;
        htmlElement.style.top = `${newPosition.top}px`;
        htmlElement.style.left = `${newPosition.left}px`;

        validateConflicts(currentElement, conflitItem);
      }
    }

    return{
      move : move
    }

  }

  function createItem(options){
    createElement(options);
  }

  function createHero(options){
    const Hero = createElement({
      item : 'hero',
      top : options.top,
      left : options.left
    });

    document.addEventListener('keydown', (event) =>{
     // console.log('keydown foi pressionado',event.key);
      Hero.move(event.key);
    });
  }

  function createEnemy(options){
    const enemy = createElement({
      item : 'mini-demon',
      top : options.top,
      left : options.left
    });

    setInterval(() => {
      const direction = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'];
      const randomIndex = Math.floor(Math.random() * direction.length);
      const randomDirection = direction[randomIndex];
      enemy.move(randomDirection);
      //console.log(randomIndex);
    }, 1000);
    
  }
  
  return{
      createItem: createItem,
      createHero: createHero,
      createEnemy: createEnemy
  }

}
const board =  createBoard();
const number = Math.floor(Math.random()*5)+15; //Varia de 15 a 20
// item -> mini-demon | chest | hero | trap
// top -> number
// left -> number
board.createItem({ item: 'forniture', top: TILE_SIZE * 17, left: TILE_SIZE * 2});
board.createItem({ item: 'forniture', top: TILE_SIZE * 2, left: TILE_SIZE * 3});
board.createItem({ item: 'forniture', top: TILE_SIZE * 2, left: TILE_SIZE * 8});
board.createItem({ item: 'forniture', top: TILE_SIZE * 2, left: TILE_SIZE * 16});

board.createItem({ item: 'forniture', top: TILE_SIZE * 7, left: TILE_SIZE * 14});
board.createItem({ item: 'forniture', top: TILE_SIZE * 8, left: TILE_SIZE * 14});
board.createItem({ item: 'forniture', top: TILE_SIZE * 7, left: TILE_SIZE * 13});
board.createItem({ item: 'forniture', top: TILE_SIZE * 8, left: TILE_SIZE * 13});



board.createItem({ item: 'trap', top: TILE_SIZE * 10, left: TILE_SIZE * 10});
board.createItem({ item: 'chest', top: TILE_SIZE * 2, left: TILE_SIZE * 18});

const positionTop = [17,2,2,2,7,8,7,8,10,2];
const positionLeft = [2,3,8,16,14,14,13,13];
positionTop.push(20);
console.log(positionTop.length);

board.createHero({ top: TILE_SIZE * 16, left: TILE_SIZE * 2});

function validateNumber(left, top){
  for(var i = 0; i < positionTop.length; i++){
    if(positionTop[i] === top && positionLeft[i] === left){
      return false;
    }
  }
  return true;
}

//left 1-18
//top 2-15
for(var i = 0; i < number; i++){
  var numbertop = Math.floor(Math.random()*13)+2;
  var numberleft = Math.floor(Math.random()*18)+1;
  
  const validate = validateNumber(numberleft, numbertop);

  console.log(validate);

  if(validate){
  board.createEnemy({ top: TILE_SIZE * numbertop, left: TILE_SIZE * numberleft});
  positionTop.push(numbertop);
  positionLeft.push(numberleft);
  }else{
    i--;
  }
  
}

for(var i = 0; i < number- 5; i++){  
  var numbertop = Math.floor(Math.random()*13)+2;
  var numberleft = Math.floor(Math.random()*18)+1;

  const validate = validateNumber(numberleft, numbertop);

  if(validate){
  board.createItem({ item: 'trap', top: TILE_SIZE * numbertop, left: TILE_SIZE * numberleft});
  positionTop.push(numbertop);
  positionLeft.push(numberleft);
  }else{
    i--;
  }
}
let canvas;
let button;

let food = [];
let foodLimit = 2;

let hungry = 0;
let full = 1;
let tamaState = hungry;

let tamaX;
let tamaY;
let tamaDiam;

function setup() {

  canvas = createCanvas(600, 600);
  canvas.parent("sketch-container"); //move our canvas inside this HTML element

  tamaX = width/2;
  tamaY = height/2;
  tamaDiam = width/6;

  addGUI();
}

function draw() {
  background(200,200,250);
  
  //Drawing
  noStroke();

  if(tamaState == hungry){
    fill(255);
    if(tamaDiam > width/4){
      tamaState = full;
    }
  }else if(tamaState == full){
    fill(0,255,0);
    if(tamaDiam > width/6){
      if(frameCount % 2 == 0) tamaDiam--; // reduce every second frame
    }else{
      tamaState = hungry;
    }
  }

  circle(tamaX,tamaY,tamaDiam);
  fill(0);
  let mouthOffset = tamaDiam/2;
  rect(tamaX-mouthOffset/2,tamaY,mouthOffset,3);

  updateFood();//update and draw food

  if(food.length > 0 && tamaState == hungry){
    eatFood();
  } 
  
  if(food.length <= foodLimit-1){
    button.html("FEED");
    button.removeClass("inactive");
  }
}

function updateFood(){
  for(let i = food.length-1; i >= 0 ; i--){
    fill(100);
    circle(food[i].x,food[i].y,food[i].d);
    food[i].y -= 1;
    if(food[i].y < 0){
      food.splice(i,1);//remove one from array at index i
    }
  }
}

//This is a dumb creature who only eats the last bit of food added
//How could you update this function so that you use a similar tactic as above in updateFood
//loop backward through the food array, try:
//eat all the food
//OR eat the biggest piece of food
function eatFood(){

  //eats the last bit of food
  // let distanceY =  tamaY - food[food.length-1].y;

  // if(food[food.length-1].y > tamaY){
  //   fill(0);
  //   circle(tamaX,tamaY,tamaDiam/2);
 
  //   if(abs(distanceY) < 10){
  //     tamaDiam += food[food.length-1].d;
  //     food.pop();
  //   }
  // }

  //Eats all the food
  for(let i = food.length-1; i >= 0 ; i--){
    let distanceY =  tamaY - food[i].y;

    if(food[i].y > tamaX){
      fill(0);
      circle(tamaX,tamaY,tamaDiam/2);
    }

    if(abs(distanceY) < 10){
      tamaDiam += food[food.length-1].d;
      food.splice(i,1);
    }
  }

}

function addGUI()
{

  //add a button
  button = createButton("FEED");

  button.addClass("button");

  //Add the play button to the parent gui HTML element
  button.parent("gui-container");
  
  //Adding a mouse pressed event listener to the button 
  button.mousePressed(handleButtonPress); 

}

function handleButtonPress()
{
    
    if(food.length <= foodLimit-1){
      food.push({
          x:width/2,
          y:height,
          d:random(10,40)
        });
    }
    
    if(food.length > foodLimit-1){
      button.html("FEEDING");
      button.addClass("inactive");
    }
  
}


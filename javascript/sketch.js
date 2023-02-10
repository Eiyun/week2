// create our creature class
class Creature {
  // this constructor is called when we define new Creature(...)
  constructor(_x, _y) {
    this.location = new createVector(_x, _y);  // Location of shape
    this.velocity = new createVector(random(-2,50),random(-2,50));  // Velocity of shape
    this.friction = new createVector(0, 0); 
    this.desired = new createVector(0, 0); 
    this.diameter = random(1,40);
    this.speedLimit = random(5,this.diameter/10);
    this.full = 0;
  }

  moveToFood(x, y){

    if(this.full>0){
      return false;
    }

    this.desired.x = x;
    this.desired.y = y;
    let direction = p5.Vector.sub(this.desired, this.location);

    if (direction.mag() < this.diameter/2){
      this.full = 1000;
      return true;
    } 
  
    if(direction.mag() < 200){
      direction.normalize();
      this.velocity.add(direction);
    }

    return false;
  } 

 
  update() {

    if(this.full<100){
      this.friction.x = this.velocity.x * -1;
      this.friction.y = this.velocity.y * -1;
      this.friction.normalize();
      this.friction.mult(0.001);
      this.velocity.add(this.friction);
    }

    this.velocity.limit(this.speedLimit);
    // Add velocity to the location.
    this.location.add(this.velocity);

  
    // Bounce off edges
    if (this.location.x > width){
      this.location.x = width;
      this.velocity.x = this.velocity.x * -1;
    }
    if (this.location.x < 0) {
      this.location.x = 0;
      this.velocity.x = this.velocity.x * -1;
    }
    if (this.location.y < 0) {
      this.location.y = 0;
      this.velocity.y = this.velocity.y * -1;
    }
    if (this.location.y > height) {
      this.location.y = height;
      this.velocity.y = this.velocity.y * -1; 
    }

    if(this.full > 0){
      this.full--;
    }
  

    noStroke();
    fill(map(this.full,0,100,0,255),random(250),random(250));
    rect(this.location.x,this.location.y,this.diameter);
  }
}

//Main sketch below
// an array to store the creatures
let creatures = [];
let food = [];

function setup() {
  // createCanvas(400, 400);

  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container"); 

  addGUI();

  for(let i = 0; i < 50; i++){
    let c = new Creature(random(width), random(height));
    creatures.push(c);
  }
}

function draw() {
  background(255);
  
  
  for (let c of creatures) {
    c.update();
    if(food.length > 0){

      if(c.moveToFood(food[food.length-1].x,food[food.length-1].y)){
        food.pop();
      }
    } 
  }

  updateFood();

  if(button.hasClass("inactive") && food.length == 0){
    button.html("FEED");
    button.removeClass("inactive");
  }

}

function updateFood(){
  for(let i = food.length-1; i >= 0 ; i--){
    fill(random(250),random(250),random(250));
    circle(food[i].x,food[i].y,food[i].d);
    food[i].y += 1;
    if(food[i].y > height){
      food.splice(i,5);
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
    if(food.length == 0 && !button.hasClass("inactive")){
      food.push({
          x:random(width),
          y:random(height/2),
          d:random(5,10)
        });
    }
    
    if(food.length > 0){
      button.html("FEEDING");
      button.addClass("inactive");
    }
  
}

function windowResized() {

  resizeCanvas(windowWidth, windowHeight);

}
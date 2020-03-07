
    var faces;
    var population;
    var w;

    var generation = 0;

    var intersectionPoint; //of DNA

    var mutationRate;

    function setup() {

      createCanvas(700, 340);

      faces = [];
      population = 9;
      w = 70; //width of the whole thing (with rect around)

      generation = 0;
      intersectionPoint = 4;
      mutationRate = 0.15;

      for(var i = 0; i < population; i++){
        faces.push(new Face(20 + i*w,w/2,10, 1,undefined));
      }

    }

    function draw() {

      background(80);

      for(var i = 0; i < faces.length; i++){
        faces[i].display();
      }

      for(var i = 0; i < faces.length; i++){
        if(mouseX >= faces[i].x && mouseX <= faces[i].x+w &&
           mouseY >= faces[i].y && mouseY <= faces[i].y+w){
          faces[i].fitness += 0.1;
        }
      }

      strokeWeight(1);
      textSize(20);
      text("n = next generation", 20, 270);
      text("generation: " + generation, 20, 310);

    }

    function keyPressed() {
      if(key == "n"){
        nextGeneration();
      }
    }

    function nextGeneration() {

      //increment generation
      generation++;
      
      //selection of the best
      var sum = 0;
      var parents = [];

      for(var i = 0; i < faces.length; i++){
        sum += faces[i].fitness;
      }

      var num = random(0,sum);
      var num2 = random(0,sum);
      console.log(num + " | " + num2);

      var last = 0;
      var now = 0;
      for(var i = 0; i < faces.length; i++){
        now += faces[i].fitness;
        if(num > last && num <= now){
          parents.push(faces[i]);
        } 
        if (num2 > last && num2 <= now){
          parents.push(faces[i]);
        }
        last += faces[i].fitness;
      }

      console.log("PARENTS");
      console.log(parents[0].dna);
      console.log(parents[1].dna);
      console.log("------");

      //make new population
      var newDNA = [];
      var newDNA2 = [];
      for(var i = 0; i < intersectionPoint; i++){
        newDNA.push(parents[0].dna[i]);
        newDNA2.push(parents[1].dna[i]);
      }
      for(var i = intersectionPoint; i < 10; i++){
        newDNA.push(parents[1].dna[i]);
        newDNA2.push(parents[0].dna[i]);
      }
      console.log(newDNA);
      console.log(newDNA2);

      for(var i = 0; i < faces.length; i++){
        if(i % 2 == 0){
          faces[i] = new Face(20 + i*w,w/2,10, 0,cloneAr(newDNA));
        } else {
          faces[i] = new Face(20 + i*w,w/2,10, 0,cloneAr(newDNA2));
        }
      }

      
      //mutation
      // -> see obj Face
      
    }

    class Face {

      constructor(x,y,len,randomness,dna){
        this.x = x;
        this.y = y;

        this.fitness = 0;

        this.len = len;

        if(randomness == 1){
          this.dna = [];
          for(var i = 0; i < len; i++){
            this.dna.push(random(0,1));
          }
        } else if(randomness == 0){
          this.dna = dna;
          console.log("generation const.");
          this.mutate();
          for(var i = 0; i < this.dna.length; i++){
            if(this.dna[i] <= 0) { this.dna[i] = 0; console.log("overflow");}
            if(this.dna[i] >= 1) { this.dna[i] = 1; console.log("overflow");}
          }
        }
      }

      display(){
         this.r = map(this.dna[0],0,1,10,60);
         
         this.color = [map(this.dna[1],0,1,0,255),map(this.dna[2],0,1,0,255),map(this.dna[3],0,1,0,255)];

         this.eye_y = map(this.dna[4],0,1,0,15);
         this.eye_x = map(this.dna[5],0,1,0,7);
         this.eye_size = map(this.dna[5],0,1,0,10);
         this.eye_color = [map(this.dna[4],0,1,0,255),map(this.dna[5],0,1,0,255),map(this.dna[6],0,1,0,255)];

         this.mouth_color = [map(this.dna[7],0,1,0,255),map(this.dna[8],0,1,0,255),map(this.dna[9],0,1,0,255)];
         this.mouth_x = map(this.dna[5],0,1,0,25);
         this.mouth_y = map(this.dna[5],0,1,0,35);
         this.mouth_width = map(this.dna[0],0,1,0,50);
         this.mouth_height = map(this.dna[0],0,1,0,10);

         //body
         noStroke();
         fill(this.color[0], this.color[1], this.color[2]);
         var seiten = (w - this.r)/2;
         ellipse(this.x+seiten+this.r/2, this.y+seiten+this.r/2, this.r, this.r);

         //eyes
         fill(this.eye_color[0], this.eye_color[1], this.eye_color[2]);
         ellipse(this.x+seiten+this.r/2-this.eye_x, this.y+seiten+this.r/2-this.eye_y, this.eye_size, this.eye_size);
         ellipse(this.x+seiten+this.r/2+this.eye_x, this.y+seiten+this.r/2-this.eye_y, this.eye_size, this.eye_size);

         //mouth
         fill(this.mouth_color[0], this.mouth_color[1], this.mouth_color[2]);
         rect(this.x+this.mouth_x+seiten, this.y+this.mouth_y+seiten, this.mouth_width, this.mouth_height);

         //rect around
         noFill();
         stroke(0);
         strokeWeight(3);
         rect(this.x, this.y, w,w);

         //display fitness
         textSize(20);
         strokeWeight(1);
         text(floor(this.fitness), this.x+w/2, this.y+w+20);

         //display DNA
         textSize(7);
         stroke(255,0,0);
         text("DNA", this.x, this.y + w + 40);
         stroke(0);
         for(var i = 0; i < this.len; i++){
         text(Math.round(100*this.dna[i])/100, this.x, this.y + w + 50 + i*10);
         }
      }

      mutate() {

        console.log("mutate");

        for(var i = 0; i < this.dna.length; i++){

          var rand = floor(random(100));
          var randMut = random(mutationRate);
          console.log(randMut);
          if(rand % 2 == 0){

            this.dna[i] += randMut;

          } else {

            this.dna[i] -= randMut;

          }

        }

      }
    }

    function cloneAr(arr){
      var out = [];
      for(var i = 0; i < arr.length; i++){
        out.push(arr[i]);
      }
      return out;
    }

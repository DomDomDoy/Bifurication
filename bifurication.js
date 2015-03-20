//initialize graph and context, canvas
/*

Author: Dominic Doyle 
Date: 03/06/2015 

Bifurication Diagram Animation 

*/

//DOM Elements 
var canvas = document.getElementById("graph");
var rval = document.getElementById("rval");
var slider = document.getElementById("slider");
var context = canvas.getContext("2d");

//time interval
var interval;

var Point = function(x, y, xn ,val){

  this.x_can = x;
  this.y_can = y;
  this.xn =  xn;
  this.r_val = val;  
};


var curr_point;

//draw canvas
draw_graph();

//input R value and fix first point
//at t=0, x0 = 0.25
fix_first_point(3.06);
start_simulation(); 

function draw_graph(){ 
  
         
       var pos_x1 =  0;
       var pos_y1 =  40;
       var pos_x2 =  canvas.width;
       var pos_y2 =  canvas.height;
     


     draw_axes();
    
     //three ticks
     draw_scale(3);
     
    
    function draw_axes(){
          context.beginPath();
          context.moveTo(pos_y1, 0); 
          context.lineTo(pos_y1, pos_y2);

          //draw arrows  
          context.moveTo(pos_y1 - 5, 5);
          context.lineTo(pos_y1, 0);  
          context.moveTo(pos_y1 + 5, 5);
          context.lineTo(pos_y1, 0);  
          context.moveTo(pos_y1 - 5, pos_y2 - 5); 
          context.lineTo(pos_y1, pos_y2); 
          context.moveTo(pos_y1 + 5, pos_y2 - 5); 
          context.lineTo(pos_y1, pos_y2);

          context.strokeStyle = "#000";
          context.stroke();
    } 
    
    function draw_scale(amt_ticks){
        
        //compute section size
        var num_of_sections =  amt_ticks + 1;
        var section =  parseFloat(1/(num_of_sections));
        var tick_offset =  5;
        
        
        //draw ticks and labels
        for(var i = 1; i < num_of_sections; i++){
            
             var sect_bound  = (i)*(parseFloat(canvas.height/4));
             context.beginPath();
             context.moveTo(pos_y1 - tick_offset, sect_bound);
             context.lineTo(pos_y1 + tick_offset, sect_bound);
             context.strokeStyle = "#000";
             context.stroke();   
            
             //labels
             var label = section*(num_of_sections  - i);
             var label_offset = pos_y1 + tick_offset + 5;
             context.fillText(label.toString(),label_offset, sect_bound );
        }
        
        
        
    }
    
    

  } 

function handle_slide(){

      console.log(slider.value);
      
      //clear canvas, points and stop evolution 
      stop_simulation();
      clear_canvas();
      
      //redraw graph, update point and restart simulation
      draw_graph();
      curr_point.r_val = slider.value;
      rval.innerHTML = slider.value;
      start_simulation();

}




function start_simulation(){
     
    //evolve.. with 500ms time delay
    interval = window.setInterval(evolve_system, 100);
}

function stop_simulation(){

    clearInterval(interval);
}


function fix_first_point(r_val){

    //fix first point, randomly select xn, choose r=0.8 for  and compute canvas y and fix slider
    var x_can  = 20;
    var xn = parseFloat(Math.random().toPrecision(2));
    
    //compute canvas y coordinate
    var y_can =  compute_y_can(xn);
    
    //fix slider
    slider.value = r_val;
    rval.innerHTML = r_val;
    
    curr_point = new Point(x_can,y_can ,xn , r_val);
    draw_circle();

}



function evolve_system(){
   
    
     //compute xn+1 and canvas y-coordinate
     console.log("evolving...");
     var next_xn = compute_next(curr_point.xn,curr_point.r_val);
     var next_y_can = compute_y_can(next_xn, curr_point.r_val);
     
      //update point and redraw
     curr_point.xn = next_xn;
     curr_point.y_can = next_y_can;
      
     clear_canvas();
     draw_graph();
     draw_circle();
     
        
}

//compute the next xn+1 : logistic equation
function compute_next( xn, r_val){

   return parseFloat(parseFloat(r_val)*(xn) * (1 - xn));
}

function compute_y_can(xn){
   
    return parseInt(Math.round(Math.abs(1 - xn) * canvas.height));

}



function draw_circle(){
     
  var radius =  5;
  console.log(curr_point);  
  context.beginPath();  
  context.arc(curr_point.x_can, curr_point.y_can, radius, 0, Math.PI * 2, false);
  context.closePath();
  context.strokeStyle = "#000";
  context.stroke();
}


function clear_canvas(){
 
    context.clearRect(0, 0, canvas.width, canvas.height);
} 

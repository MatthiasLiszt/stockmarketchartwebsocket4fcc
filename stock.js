
var socket = io();
var el = document.getElementById('output');
var diagram = document.getElementById('diagram');
var serverOn=false;
var graphCount=0; // number of stockmarket diagrams 



$('#companyinputsubmit').click(function(){
   var a=document.getElementById("companyinput").value; 
   console.log("companyinput = "+a);
   console.log("company input submitted");
   if(serverOn){send2Server({companyinput: a});}
});


socket.on('general', function(x) {
        el.innerHTML = 'server message: ' + x.message;
        console.log('socket.on activated');
        console.log(x.message);
        serverOn=true;
       });

socket.on('data',function(x){
         //diagram.innerHTML=JSON.stringify(x);   
         console.log("trying to execute plotDiagram");
         var ngraph="diagram"+graphCount;
         ++graphCount;
         createNewDiv(ngraph);    
         plotDiagram(x,ngraph);  
        });

function send2Server(message){
       console.log("function send2Server executing");
       if(serverOn){socket.emit('general',message);}
      }


function plotDiagram(x,iD){
  var data=x;
  var i,v=data.Elements[0].DataSeries.open.values;
  var vlength=data.Elements[0].DataSeries.open.values.length;
  var acourses=[],ccourses;
  var dates=data.Dates;

  var iDplus='#'+iD;
 
  console.log("in function plotDiagram ; iDplus = "+iDplus);

  // creating data array with stock market data and output to console

  for(i=0;i<vlength;++i)
   {acourses.push(v[i]);}

  ccourses=JSON.stringify(acourses);
  console.log(ccourses);

  // Visualization With D3 

  var cdata = acourses;
  var w = 500, h = 300,margin = 60;
  var y = d3.scale.linear().domain([d3.min(cdata), d3.max(cdata)]).range([ h - margin, margin]);
  var x = d3.scale.linear().domain([0, cdata.length]).range([margin, w - margin]);
  var xAxis = d3.svg.axis().scale(x);
  var yAxis = d3.svg.axis().scale(y).orient("left");

  var vis = d3.select(iDplus)
    .append("svg:svg")
    .attr("width", w)
    .attr("height", h);
 
  var down="translate(0,"+(h-margin) +")";

  vis.append("svg:g").attr("transform", down).call(xAxis);
  vis.append("svg:g").attr("transform", "translate(" + (margin) + ",0)").call(yAxis);

  var lineGen = d3.svg.line()
                  .x(function(d,i) {
                     //console.log("x="+i);
                     return x(i);
                    })
                  .y(function(d) {
                     //console.log("y="+d); 
                     return y(d);
                   });

  vis.append('svg:path')
     .attr('d', lineGen(cdata))
     .attr('stroke', 'green')
     .attr('stroke-width', 2)
     .attr('fill', 'none');

  // code for remove-button

  var parent=document.getElementById(iD);
  var removeButton = document.createElement("input");

  removeButton.type="button";
  removeButton.value="remove";
  removeButton.id="removeButton";
  removeButton.onclick=function(){d3.select(iDplus).remove();};
  parent.appendChild(removeButton);

}

function createNewDiv(iD){
  // creating a div on DOM 
  var granny= document.getElementById("diagram");
  var ndiv = document.createElement("div");
  ndiv.id=iD;
  ndiv.innerHTML=iD+" created."
  granny.appendChild(ndiv);
}

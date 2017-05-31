'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const request = require('request');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

/*
const server = express()
//  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
*/

var app = express();
var http = require('http');
var server = http.createServer(app);
const io = socketIO(server);


io.on('connection', (socket) => {
  console.log('Client connected');
  console.log("trying to send message to client");
  io.emit('general',{message: "it's me your server" });

  socket.on('disconnect', () => console.log('Client disconnected'));

  socket.on('general',function(x){
      if(x!=0)
       {console.log("companyinput = "+x.companyinput);
        stockRequest(x.companyinput);
       }
    });
});


//setInterval(() => io.emit('time', new Date().toTimeString()), 1000);

app.set('port', PORT );


app.get('/',function(req,res){
  res.sendFile(INDEX);
});


app.get('/jquery.min.js',function(req,res){
 var f=path.join(__dirname, 'jquery.min.js');
 console.log("jquery.min.js requested");
 res.sendFile(f);
});

app.get('/stock.js',function(req,res){
 var f=path.join(__dirname, 'stock.js');
 console.log("stock.js requested");
 res.sendFile(f);
});

app.get('/all.css',function(req,res){
 var f=path.join(__dirname, 'all.css');
 console.log("all.css requested");
 res.sendFile(f);
});

app.get('/d3.v3.min.js',function(req,res){
 var f=path.join(__dirname, 'd3.v3.min.js');
 console.log("d3.v3.min.js requested");
 res.sendFile(f);
});

server.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


// Code relevant for Stock data in JSON etc. 


function stockRequest(name){
    var parameters = {  
        Normalized: false,
        NumberOfDays: 31,
        DataPeriod: "Day",
        Elements: [{Symbol: name,Type: "price",Params: ["ohlc"]}]
    };
   //var url = 'http://dev.markitondemand.com/api/v2/Lookup/json?input='+name;
    var url = "http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json?";
 
   url+="parameters="+JSON.stringify(parameters);

   console.log("executing function stockRequest");

   request.get( {
                  url: url,
                  json: true,
                  headers: {'Content-Type': 'application/json'}
                }, function (e, r, data) {
                console.log("callback function stockRequest name= "+name)
                //console.log(JSON.stringify(data));
                if(data.Labels!==undefined)
                 {console.log("data retrieved successfully");
                  io.emit('general',{message: "data retrieved for "+name });
                  io.emit('data',data); 
                 }
                else
                 {console.log("stock code unknown");
                  io.emit('general',{message: name+" is unknown" });
                 }
              });  
}

 
 






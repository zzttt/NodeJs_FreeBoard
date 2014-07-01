var http = require('http');
var url = require('url');
var path = require("path");
var DataController = require('./datacontroller').DataController;
var DataController = new DataController('211.189.20.75', 12345);

http.createServer(function(req, res) {

  var parsedUrl = url.parse(req.url, true);

  var uri = parsedUrl.pathname, filename = path.join(process.cwd(), uri);
  var query = parsedUrl.query;


  var isValidUrl = true;
  var respString = "";
  console.log("===========");
  console.log("uri: " + uri);
  console.log("== query ==");
  for(var data in query)
  	console.log(data+": "+query[data]);
  console.log("===========");

  var record = {};
  		for(var key in query)
  			record[key] = query[key];

  switch(uri){
  	case "/create":
  		respString = "create";
  	break;
  	
  	case "/read":
  		respString = "read";
  	break;

  	case "/update":
  	respString = "update";
  	break;

  	case "/delete":
  	respString = "delete";
  	break;

  	default:
  		respString = "page not found :(";
  		isValidUrl = false;
  	break;

  }

	res.writeHead(404, {'Content-Type': 'text/html'});
	res.end(respString);
  
}).listen(1337, '127.0.0.1');

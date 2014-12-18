var express = require("express"),
    app = express(),
    parseBodyAs = require('body-parser');
    configuration = require("./configuration.json"),
    path = require("path"),
    fs = require("fs"),
    LOG_FILE = path.join(process.cwd(), "log.txt"),
    METEOR_LOG_FILE = path.join(process.cwd(), "log.txt");

initLog();

app.use(parseBodyAs.json());

app.post('/sourcecode', function (req, res) {

  var branch = req.body.ref;

  log("Received post");

  var exec = require('child_process').exec;
  exec('git pull', {
    cwd: configuration.projectPath
  }, function (error, stdout, stderr) {
    if ( error ) {
      log(new Date(), "Unable to update source code");
      log("ERROR:", error);
    } else {
      log(new Date(), "Source code updated");
    }
  });

  res.status(200).end();

});

app.get("/log", function(req, res) {
  res.status(200).sendFile(LOG_FILE);
});

app.get("/log/meteor", function(req, res) {
  res.status(200).sendFile(METEOR_LOG_FILE);
});

var server = app.listen(configuration.port, function () {

  var port = server.address().port;

  log('Automated deployment listening on port', port);
  log('Project path is', configuration.projectPath);

});

function initLog() {
  fs.writeFile(LOG_FILE, '', function(){
  });
}

function log() {

  var currentDate = new Date();

  var formattedDate = currentDate.getFullYear() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getDate() + " " + currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
  
  var messagesArray = [formattedDate + " =>"].concat(Array.prototype.slice.call(arguments));

  console.log.apply(console, messagesArray);

  fs.appendFile(LOG_FILE, messagesArray.join(" ") + "\n", function (err) {
    if (err) {
      console.error("Unable to log to file", err);
    }
  });

}
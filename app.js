var express = require("express"),
    app = express(),
    parseBodyAs = require('body-parser');
    configuration = require("./configuration.json"),
    logger = require("./logger.js");

function deploy(req, res) {

  //Example: refs/heads/develop
  var branch = req.body.ref.substr(req.body.ref.lastIndexOf("/") + 1);

  var configurationForBranch = configuration.branch[branch];

  if ( configurationForBranch ) {
      var exec = require('child_process').exec;
      exec(configurationForBranch.command, {
        cwd: configurationForBranch.path
      }, function (error, stdout, stderr) {
        if ( error ) {
          logger.log("Unable to update source code for branch", branch. error.message);
          logger.log(error);
        } else {
          logger.log("Source code updated for branch", branch);
        }
      });
  } else {
    logger.log("Cannot execute any commands because configuration for branch", branch, "was not found.");
  }

  res.status(200).end();

}

function sendLog(req, res) {
  res.status(200).sendFile(logger.filePath);
}

function sendMeteorLog(req, res) {
  res.status(200).sendFile(logger.filePath);
}

app.use(parseBodyAs.json());

/**
 * @deprecated
 * Backwards compat
 */
app.post('/sourcecode', deploy);
app.post('/v1/deploy/', deploy);
app.get("/log", sendLog);
app.get("/log/meteor", sendMeteorLog);

var server = app.listen(configuration.port, function () {

  var port = server.address().port;

  logger.log('Automated deployment listening on port', port);

});
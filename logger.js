var fs = require("fs");

function Logger(filePath) {
  this.filePath = filePath || "./log.txt";
  fs.writeFile(this.filePath, '', function() {});
}

Logger.prototype.log = function() {

  var now = new Date(),
      currentTime = now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds(),
      parsedMessage = [currentTime, "=>"].concat(Array.prototype.slice.call(arguments, 0));

  console.log.apply(console, parsedMessage);
  fs.appendFile(this.filePath, parsedMessage.join(" "));

};

module.exports = new Logger();
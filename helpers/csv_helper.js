var Converter = require("csvtojson").Converter,
    fs        = require("fs");

module.exports = {
  convertToJSON: function(path, callback) {
    var csvConverter = new Converter({});
    csvConverter.on("end_parsed",function(jsonData){
        callback(jsonData);
    });
    fs.createReadStream(path).pipe(csvConverter);
  }
}

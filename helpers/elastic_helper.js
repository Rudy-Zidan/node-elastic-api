var moment = require('moment');

module.exports = {
  prettyResponse: function(elasticResponse) {
    var pretty = {
      total: elasticResponse.hits.hits.length,
      current_page: elasticResponse.page,
      docs_per_page: elasticResponse.docs_per_page,
      records: []
    };
    elasticResponse.hits.hits.forEach(function(hit) {
      pretty.records.push(hit._source);
    });
    return pretty;
  },
  setDateWithTime: function(time) {
    return moment.utc("2017-01-01 "+time);
  },
  getDateTime: function() {
    var now = moment();
    var time = now.hour() + ':' + now.minutes() + ':' + now.seconds();
    return this.setDateWithTime(time);
  }
}

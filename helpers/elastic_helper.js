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
  setOpeningClosingDates: function(opening_hr, closing_hr) {
    var opening_modifier = opening_hr.split(' ')[1],
        closing_modifier = closing_hr.split(' ')[1],
        opening_hour     = parseInt(opening_hr.split(':')[0]),
        closing_hour     = parseInt(closing_hr.split(':')[0]),
        isNewDay         = (opening_hour >= closing_hour && opening_hour <= 12);

    opening_hr = this.setDateWithTime(opening_hr, "01");
    if(opening_modifier === "PM" && closing_modifier === "AM") {
      closing_hr = this.setDateWithTime(closing_hr, "02");
    } else if((opening_modifier === "AM" && closing_modifier === "AM") && isNewDay) {
      closing_hr = this.setDateWithTime(closing_hr, "02");
    } else if((opening_modifier === "PM" && closing_modifier === "PM") && isNewDay) {
      closing_hr = this.setDateWithTime(closing_hr, "02");
    } else {
      closing_hr = this.setDateWithTime(closing_hr, "01");
    }

    return [opening_hr, closing_hr];
  },
  setDateWithTime: function(time, day) {
    return moment.utc("2017-01-" + day + " " + time);
  },
  getDateTime: function() {
    var now = moment();
    var time = now.hour() + ':' + now.minutes() + ':' + now.seconds();
    return this.setDateWithTime(time, "01");
  }
}

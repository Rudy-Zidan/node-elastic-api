var elasticsearch = require('elasticsearch'),
    _             = require('underscore'),
    elasticHelper = require('./helpers/elastic_helper');

module.exports = {

  client: new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
  }),
  fieldsMapping: function () {
    this.client.indices.putMapping({
      index: 'myindex',
      type: 'restaurant',
      body: {
        properties: {
          opening_hr: {
            type: 'date',
            format: 'yyyy-mm-dd HH:mm:ss'
          },
          closing_hr: {
            type: 'date',
            format: 'yyyy-mm-dd HH:mm:ss'
          }
        }
      }
    });
  },
  documentsIndexing: function(documents) {
    return documents.map(function (document) {
      [document.opening_hr, document.closing_hr] = elasticHelper.setOpeningClosingDates(document.opening_hr, document.closing_hr);
      return [
        { index: { _index: 'res_id_index', _type: 'restaurant', _id: document.id } },
        document
      ];
    });
  },
  // Elastic Bulk API.
  build: function(documents) {
    this.fieldsMapping();
    this.client.bulk({
      body: _.flatten(this.documentsIndexing(documents))
    }, function (err, resp) {
      if(!err) {
        console.log("Indexing Finished");
      } else {
        console.log(error);
      }
    });
  },
  // Elastic Search API.
  search: function(docs_per_page = 10, page = 1, callback) {
    var dateTime = elasticHelper.getDateTime();
    this.client.search({
      index: 'res_id_index',
      type: 'restaurant',
      body: {
        query: {
          bool: {
            must: [
              {
                range: {
                  opening_hr: {
                    lte: dateTime
                  }
                }
              },
              {
                range: {
                  closing_hr: {
                    gt: dateTime
                  }
                }
              }
            ]
          }
        },
        size: docs_per_page,
        from: page
      }
    }, function(error, response) {
      response.page = page;
      response.docs_per_page = docs_per_page
      callback(error, elasticHelper.prettyResponse(response));
    });
  }
}

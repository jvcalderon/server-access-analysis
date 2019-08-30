'use strict'

function requestSize(data, domId) {
  const chartData = _.compose(
    _.mapValues(_.size),
    _.groupBy(_.get('size')),
    _.map(_.compose(
      x => ({size: x < 200 ? '<200B' : x < 400 ? '200B-400B' : x < 600 ? '400B-600B' : x < 1000 ? '600B-1000B' : ''}),
      _.get('document_size')
    )),
    _.filter(x => _.get('document_size', x) < 1000 && _.get('response_code', x) === 200)
  )(data)
  const ctx = document.getElementById(domId).getContext('2d')

  new Chart(ctx, {
    "type": "polarArea",
    "data": {
      "labels": _.keys(chartData),
      "datasets": [
        {
          "label": "HTTP Methods distribution",
          "data": _.values(chartData),
          "backgroundColor": [
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(255, 205, 86)",
            "rgb(147, 215, 45)",
            "rgb(235, 157, 22)"
          ]
        }
      ]
    }
  })
}

'use strict'

function httpMethods(data, domId) {
  const chartData = _.compose(
    _.mapValues(_.size),
    _.groupBy(_.get('request.method'))
  )(data)
  const ctx = document.getElementById(domId).getContext('2d')

  new Chart(ctx, {
    "type": "doughnut",
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

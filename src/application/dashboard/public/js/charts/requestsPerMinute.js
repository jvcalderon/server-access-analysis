'use strict'

function requestsPerMinute(data, domId) {
  const chartData = _.compose(
    _.mapValues(_.size),
    _.groupBy(x => `${_.get('datetime.day', x)}:${_.get('datetime.hour', x)}:${_.get('datetime.minute', x)}`)
  )(data)
  const ctx = document.getElementById(domId).getContext('2d')
  new Chart(ctx, {
    "type": "line",
    "data": {
      "labels": _.keys(chartData),
      "datasets": [
        {
          "label": "Request per minute",
          "data": _.values(chartData),
          "fill": false,
          "borderColor": "rgb(75, 192, 192)",
          "borderWidth": 1,
          "pointRadius": 0,
          "lineTension": 0
        }
      ]
    }
  })
}

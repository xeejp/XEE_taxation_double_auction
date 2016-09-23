import React from 'react'
import throttle from 'react-throttle-render'

import { Card, CardHeader, CardText } from 'material-ui/Card'
import Highcharts from 'react-highcharts'

const Chart = ({users}) => {
  const usersCount = Object.keys(users).length
  const buyerBids = [], sellerBids = []
  let consumerSurplus = 0
  let producerSurplus = 0
  let totalSurplus = 0
  for (let id of Object.keys(users)) {
    const user = users[id]
    if (user.bidded || user.dealt) {
      if (user.role == "buyer") {
        if (user.dealt) consumerSurplus += user.money - user.deal
        buyerBids.push(user.bid)
      } else {
        if (user.dealt) producerSurplus += user.deal - user.money
        sellerBids.push(user.bid)
      }
    }
  }
  totalSurplus = consumerSurplus + producerSurplus
  buyerBids.push(0 - 100)
  sellerBids.push(usersCount * 100 + 100)
  return (
    <Card>
      <CardHeader
        title="市場均衡グラフ"
        actAsExpander={true}
        showExpandableButton={true}
      />
      <CardText expandable={true}>
        <p>消費者余剰：{consumerSurplus}</p>
        <p>生産者余剰：{producerSurplus}</p>
        <p>総余剰：{totalSurplus}</p>
        <Highcharts config={{
          chart: {
            type: 'area',
            animation: false,
            inverted: true
          },
          title: {
            text: null
          },
          xAxis: {
            title: {
              text: '価格'
            },
            min: 0,
            max: usersCount * 100,
            tickInterval: 100,
            reversed: false
          },
          yAxis: {
            title: {
              text: '数量'
            },
            min: 0,
            max: usersCount / 2,
            tickInterval: 1
          },
          plotOptions: {
            area: {
              fillOpacity: 0.5,
              marker: {
                enabled: false
              }
            }
          },
          series: [{
            animation: false,
            name: '需要',
            step: 'right',
            data: buyerBids.sort((a, b) => a - b).map((x, y, a) => [x, a.length - y])
          }, {
            animation: false,
            name: '供給',
            step: 'left',
            data: sellerBids.sort((a, b) => a - b).map((x, y) => [x, y + 1])
          }]
        }} />
    </CardText>
  </Card>
  )
}

export default throttle(Chart, 200)

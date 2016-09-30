import React from 'react'
import { connect } from 'react-redux'
import throttle from 'react-throttle-render'

import { Card, CardHeader, CardText } from 'material-ui/Card'
import Highcharts from 'react-highcharts'
import { calculateTax } from 'shared/tax'

const mapStateToProps = ({
  users, usersCount, taxTarget, taxType, lumpSumTax, proportionalRatio, regressiveRatio, progressiveRatio
}) => ({
  users, usersCount, taxTarget, taxType, lumpSumTax, proportionalRatio, regressiveRatio, progressiveRatio
})

const Chart = ({
  users, usersCount, taxTarget, taxType, lumpSumTax, proportionalRatio, regressiveRatio, progressiveRatio
}) => {
  const buyerBids = [], sellerBids = []
  let consumerSurplus = 0
  let producerSurplus = 0
  let totalSurplus = 0
  for (let id of Object.keys(users)) {
    const user = users[id]
    const role = user.role
    const money = user.money
    if (user.bidded || user.dealt) {
      const tax = calculateTax(usersCount, taxTarget, taxType, lumpSumTax, proportionalRatio, regressiveRatio, progressiveRatio, role, money)
      console.log(tax)
      if (user.role == "buyer") {
        if (user.dealt) consumerSurplus += user.money - user.deal - tax
        buyerBids.push(user.bid)
      } else if (user.role == "seller") {
        if (user.dealt) producerSurplus += user.deal - user.money - tax
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

export default connect(mapStateToProps)(throttle(Chart, 200))

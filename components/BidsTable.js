import React, { Component } from 'react'

import { Card, CardHeader, CardText } from 'material-ui/Card'
import Badge from 'material-ui/Badge'

const BidsTable = ({ buyerBids, sellerBids, deals }) => {
  const rows = []
  const length = Math.max.apply(null, [buyerBids, sellerBids, deals].map(a => a.length))
  const tableValue = (value) => {
    if (typeof value === 'undefined') {
      return ''
    } else {
      return value
    }
  }
  buyerBids = buyerBids.sort((a, b) => b - a)
  sellerBids = sellerBids.sort((a, b) => a - b)
  for (let i = 0; i < length; i ++) {
    rows.push(
      <tr key={i}>
        <td>{tableValue(buyerBids[i])}</td>
        <td>{tableValue(sellerBids[i])}</td>
        <td>{tableValue(deals[i])}</td>
      </tr>
    )
  }
  return (
    <Card
      initiallyExpanded={true}
    >
      <CardHeader
        title={
          <span>
            <Badge badgeContent={buyerBids.length} badgeStyle={{backgroundColor: "rgba(200, 200, 200, 1)"}}>
              <span>買値</span>
            </Badge>
            <Badge badgeContent={sellerBids.length} badgeStyle={{backgroundColor: "rgba(200, 200, 200, 1)"}}>
              <span>売値</span>
            </Badge>
            <Badge badgeContent={deals.length} badgeStyle={{backgroundColor: "rgba(200, 200, 200, 1)"}}>
              <span>成立価格</span>
            </Badge>
          </span>
        }
        actAsExpander={true}
        showExpandableButton={true}
      />
      <CardText expandable={true}>
        <table>
          <thead>
            <tr>
              <th>買値</th>
              <th>売値</th>
              <th>成立価格</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </CardText>
    </Card>
  )
}

export default BidsTable

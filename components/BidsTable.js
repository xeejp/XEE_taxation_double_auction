import React, { Component } from 'react'

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
    <table>
      <thead>
        <tr>
          <th>買値</th>
          <th>売値</th>
          <th>成立金額</th>
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>
  )
}

export default BidsTable

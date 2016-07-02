import React, { Component } from 'react'
import { connect } from 'react-redux'

import BidsTable from 'components/BidsTable'

const mapStateToProps = ({ buyerBids, sellerBids, deals }) => ({
  buyerBids,
  sellerBids,
  deals
})

const ScreenMode = ({ buyerBids, sellerBids, deals }) => (
  <div>
    <BidsTable
      buyerBids={buyerBids}
      sellerBids={sellerBids}
      deals={deals}
    />
  </div>
)

export default connect(mapStateToProps)(ScreenMode)

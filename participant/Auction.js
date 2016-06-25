import React, { Component } from 'react'
import { connect } from 'react-redux'

import BidsTable from 'components/BidsTable'
import BidForm from './BidForm'

const mapStateToProps = ( {personal, buyerBids, sellerBids, deals} ) =>
Object.assign({}, personal, { buyerBids, sellerBids, deals })

const Buyer = ({ money, bidded, bid, dealt }) => {
  if (dealt) {
    return (
      <div>
        <p>{bid}で取引が成立しました。</p>
        <p>利益は{money - bid}です。</p>
      </div>
    )
  } else {
    return (
      <div>
        <p>あなたは買い手です。</p>
        <p>{money}以下の金額で購入することができます。</p>
        <BidForm />
      </div>
    )
  }
}

const Seller = ({ money, bidded, bid, dealt }) => {
  if (dealt) {
    return (
      <div>
        <p>{bid}で取引が成立しました。</p>
        <p>利益は{bid - money}です。</p>
      </div>
    )
  } else {
    return (
      <div>
        <p>あなたは売り手です。</p>
        <p>{money}以上の金額で売却することができます。</p>
        <BidForm />
      </div>
    )
  }
}

const Auction = ({ buyerBids, sellerBids, deals, role, money, bidded, bid, dealt }) => (
  <div>
    <h2>ダブルオークション実験</h2>
    { role == "buyer" ? <Buyer money={money} bidded={bidded} bid={bid} dealt={dealt} /> : null }
    { role == "seller" ? <Seller money={money} bidded={bidded} bid={bid} dealt={dealt} /> : null }
    { role == null ? <p>あなたは現在進行中のダブルオークションには参加していません。</p> : null }
    <BidsTable
      buyerBids={buyerBids}
      sellerBids={sellerBids}
      deals={deals}
    />
  </div>
)

export default connect(mapStateToProps)(Auction)

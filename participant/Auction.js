import React, { Component } from 'react'
import { connect } from 'react-redux'

import Divider from 'material-ui/Divider'

import BidsTable from 'components/BidsTable'
import BidForm from './BidForm'

const mapStateToProps = ( {personal, buyerBids, sellerBids, deals} ) =>
Object.assign({}, personal, { buyerBids, sellerBids, deals })

const Buyer = ({ money, bidded, bid, dealt, deal }) => {
  if (dealt) {
    return (
      <div>
        <p>{deal}で取引が成立しました。（あなたの提案: {bid}）</p>
        <p>利益は{money - deal}です。</p>
      </div>
    )
  } else {
    return (
      <div>
        <p>あなたは買い手です。</p>
        <p>予算である{money}以下の価格で購入することができます。</p>
        {bidded
          ? <p>{bid}で提案中です。</p>
          : null
        }
        <BidForm />
      </div>
    )
  }
}

const Seller = ({ money, bidded, bid, dealt, deal }) => {
  if (dealt) {
    return (
      <div>
        <p>{deal}で取引が成立しました。（あなたの提案: {bid}）</p>
        <p>利益は{deal - money}です。</p>
      </div>
    )
  } else {
    return (
      <div>
        <p>あなたは売り手です。</p>
        <p>仕入れ値である{money}以上の価格で販売することができます。</p>
        {bidded
          ? <p>{bid}で提案中です。</p>
          : null
        }
        <BidForm />
      </div>
    )
  }
}

const Auction = ({ buyerBids, sellerBids, deals, role, money, bidded, bid, dealt, deal }) => (
  <div>
    <h2>ダブルオークション実験</h2>
    { role == "buyer" ? <Buyer money={money} bidded={bidded} bid={bid} dealt={dealt} deal={deal} /> : null }
    { role == "seller" ? <Seller money={money} bidded={bidded} bid={bid} dealt={dealt} deal={deal} /> : null }
    { role == null ? <p>あなたは現在進行中のダブルオークションには参加していません。</p> : null }
    <Divider
        style={{
            marginTop: "5%",
        }}
    />
    <BidsTable
      buyerBids={buyerBids}
      sellerBids={sellerBids}
      deals={deals}
    />
  </div>
)

export default connect(mapStateToProps)(Auction)

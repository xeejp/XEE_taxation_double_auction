import React, { Component } from 'react'
import { connect } from 'react-redux'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import ActionDispatcher from 'components/ActionDispatcher'
import MessageSender from 'components/MessageSender'
import ModeButtons from './ModeButtons'
import MatchingButton from './MatchingButton'
import BidsTable from 'components/BidsTable'
import Users from './Users'

const mapStateToProps = ({buyerBids, sellerBids, deals}) => ({
  buyerBids,
  sellerBids,
  deals
})

class App extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  componentDidMount() {
    sendData("fetch_contents")
  }

  render() {
    const { buyerBids, sellerBids, deals } = this.props
    return (
      <MuiThemeProvider>
        <div>
          <ModeButtons />
          <MatchingButton />
          <Users />
          <BidsTable
            buyerBids={buyerBids}
            sellerBids={sellerBids}
            deals={deals}
          />
        </div>
      </MuiThemeProvider>
    )
  }
}

export default connect(mapStateToProps)(App)

import React, { Component } from 'react'
import { connect } from 'react-redux'

import RaisedButton from 'material-ui/RaisedButton'

import ActionDispatcher from 'components/ActionDispatcher'
import MessageSender from 'components/MessageSender'
import ModeButtons from './ModeButtons'
import MatchingButton from './MatchingButton'
import BidsTable from 'components/BidsTable'
import Users from './Users'
import ScreenMode from './ScreenMode'

import { enableScreenMode } from './actions'

const mapStateToProps = ({ buyerBids, sellerBids, deals, screenMode }) => ({
  buyerBids,
  sellerBids,
  deals,
  screenMode
})

class App extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  componentDidMount() {
    sendData("fetch_contents")
  }

  enableScreenMode() {
    const { dispatch } = this.props
    dispatch(enableScreenMode())
  }

  render() {
    const { buyerBids, sellerBids, deals, screenMode } = this.props
    return (
      <span>
        { screenMode
          ? <ScreenMode />
          : (
            <div>
              <ModeButtons />
              <MatchingButton />
              <div style={{ marginTop: "2%" }}>
                <Users />
              </div>
              <div style={{ marginTop: "2%" }}>
                <BidsTable
                  buyerBids={buyerBids}
                  sellerBids={sellerBids}
                  deals={deals}
                />
              </div>
              <RaisedButton onClick={this.enableScreenMode.bind(this)} primary={true} style={{ marginTop: '5%' }}>スクリーンモードに移行</RaisedButton>
            </div>
          )
        }
      </span>
    )
  }
}

export default connect(mapStateToProps)(App)

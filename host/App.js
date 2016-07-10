import React, { Component } from 'react'
import { connect } from 'react-redux'

import RaisedButton from 'material-ui/RaisedButton'
import Divider from 'material-ui/Divider'

import ActionDispatcher from 'components/ActionDispatcher'
import MessageSender from 'components/MessageSender'
import Chart from 'components/Chart'
import ModeButtons from './ModeButtons'
import MatchingButton from './MatchingButton'
import BidsTable from 'components/BidsTable'
import Users from './Users'
import ScreenMode from './ScreenMode'
import ExperimentKey from './ExperimentKey'

import { enableScreenMode } from './actions'

const mapStateToProps = ({ buyerBids, sellerBids, deals, users, screenMode }) => ({
  buyerBids,
  sellerBids,
  deals,
  users,
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
    const { buyerBids, sellerBids, deals, users, screenMode } = this.props
    return (
      <span>
        { screenMode
          ? <ScreenMode />
          : (
            <div>
              <ExperimentKey />
              <Divider />
              <ModeButtons />
              <MatchingButton
                style={{float: "right"}}
              />
              <Divider
                style={{
                  marginTop: "5%",
                  clear: "right"
                }}
              />
              <div style={{ marginTop: "5%" }}>
                <Users />
              </div>
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
              <Divider
                style={{
                  marginTop: "5%",
                }}
              />
              <Chart
                users={users}
              />
              <RaisedButton onClick={this.enableScreenMode.bind(this)} primary={true} style={{ marginTop: '5%' }}>スクリーンモードに移行</RaisedButton>
            </div>
          )
        }
      </span>
    )
  }
}

export default connect(mapStateToProps)(App)

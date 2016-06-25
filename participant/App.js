import React, { Component } from 'react'
import { connect } from 'react-redux'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import Auction from 'participant/Auction'
import Wait from 'participant/Wait'
import Description from 'participant/Description'
import Result from 'participant/Result'

const mapStateToProps = ({mode}) => ({
  mode
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
    const { mode } = this.props
    return (
      <MuiThemeProvider>
        <div>
          { (mode == "auction") ? <Auction /> : null }
          { (mode == "wait") ? <Wait /> : null }
          { (mode == "description") ? <Description /> : null }
          { (mode == "result") ? <Result /> : null }
        </div>
      </MuiThemeProvider>
    )
  }
}

export default connect(mapStateToProps)(App)

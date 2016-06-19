import React, { Component } from 'react'
import { connect } from 'react-redux'

import ActionDispatcher from 'components/ActionDispatcher'
import MessageSender from 'components/MessageSender'
import ModeButtons from './ModeButtons'

const mapStateToProps = ({}) => ({
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
    return (
      <div>
        <ModeButtons />
        <ActionDispatcher />
        <MessageSender />
      </div>
    )
  }
}

export default connect()(App)

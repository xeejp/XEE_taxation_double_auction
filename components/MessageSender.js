import React, { Component } from 'react'
import { connect } from 'react-redux'

class ActionDispatcher extends Component {
  constructor(props) {
    super(props)
    this.handleChangeAction = this.handleChangeAction.bind(this)
    this.handleChangeParams = this.handleChangeParams.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.state = {
      action: '',
      params: ''
    }
  }

  handleChangeAction(event) {
    const action = event.target.value
    this.setState({ action })
  }

  handleChangeParams(event) {
    const params = event.target.value
    this.setState({ params })
  }

  handleClick(event) {
    event.preventDefault()
    const { dispatch } = this.props
    const { action, params} = this.state
    sendData(action, JSON.parse(params))
  }

  render() {
    const value = this.state.value
    return (
      <form>
        <input action="text" onChange={this.handleChangeAction} value={value} />
        <input action="text" onChange={this.handleChangeParams} value={value} />
        <button onClick={this.handleClick}>Send</button>
      </form>
    )
  }
}

export default connect()(ActionDispatcher)

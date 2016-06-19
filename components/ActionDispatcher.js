import React, { Component } from 'react'
import { connect } from 'react-redux'

class ActionDispatcher extends Component {
  constructor(props) {
    super(props)
    this.handleChangeType = this.handleChangeType.bind(this)
    this.handleChangePayload = this.handleChangePayload.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.state = {
      type: '',
      payload: ''
    }
  }

  handleChangeType(event) {
    const type = event.target.value
    this.setState({ type })
  }

  handleChangePayload(event) {
    const payload = event.target.value
    this.setState({ payload })
  }

  handleClick(event) {
    event.preventDefault()
    const { dispatch } = this.props
    const { type, payload} = this.state
    dispatch(Object.assign({ type }, JSON.parse(payload)))
  }

  render() {
    const value = this.state.value
    return (
      <form>
        <input type="text" onChange={this.handleChangeType} value={value} />
        <input type="text" onChange={this.handleChangePayload} value={value} />
        <button onClick={this.handleClick}>Dispatch</button>
      </form>
    )
  }
}

export default connect()(ActionDispatcher)

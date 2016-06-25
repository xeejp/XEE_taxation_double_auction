import React, { Component } from 'react'
import { connect } from 'react-redux'

import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

import { bid } from './actions'

const mapStateToProps = ({}) => ({
})

class MatchingButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: ''
    }
  }

  handleChange(event) {
    const value = event.target.value
    this.setState({
      value
    })
  }

  handleClick() {
    const { dispatch } = this.props
    const { value } = this.state
    dispatch(bid(parseInt(value, 10)))
  }

  render() {
    const { value } = this.state
    return (
      <div>
        <TextField
          floatingLabelText='提案金額'
          value={value}
          onChange={this.handleChange.bind(this)}
        /><br />
        <RaisedButton
          onClick={this.handleClick.bind(this)}
        >送信</RaisedButton>
      </div>
    )
  }
}

export default connect(mapStateToProps)(MatchingButton)

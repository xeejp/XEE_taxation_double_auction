import React, { Component } from 'react'
import { connect } from 'react-redux'

import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import SnackBar from 'material-ui/SnackBar'

import { bid } from './actions'

const mapStateToProps = ({personal}) => ({
  role: personal.role,
  money: personal.money
})

class MatchingButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: '',
      isValid: false,
      snack: false,
      bid: ''
    }
  }

  closeSnack() {
    this.setState({
      snack: false
    })
  }

  handleChange(event) {
    const value = event.target.value
    const { role, money } = this.props
    const numValue = parseInt(value, 10)
    const isValid = role == "buyer"
      ? numValue <= money
      : numValue >= money
    this.setState({
      value,
      isValid
    })
  }

  handleClick() {
    const { dispatch } = this.props
    const { value } = this.state
    this.setState({
      value: '',
      isValid: false,
      snack: true,
      bid: value
    })
    dispatch(bid(parseInt(value, 10)))
  }

  handleKeyDown(event) {
    const { isValid } = this.state
    if (isValid && (event.key === "Enter" || event.keyCode === 13)) { // Enter
      this.handleClick()
    }
  }

  render() {
    const { value, bid, snack, isValid } = this.state
    return (
      <div>
        <TextField
          floatingLabelText='提案金額'
          value={value}
          onChange={this.handleChange.bind(this)}
          onKeyDown={this.handleKeyDown.bind(this)}
        /><br />
        <RaisedButton
          primary={true}
          disabled={!isValid}
          onClick={this.handleClick.bind(this)}
        >送信</RaisedButton>
        <SnackBar
          open={snack}
          message={bid + 'で提案しました。'}
          autoHideDuration={3000}
          onRequestClose={this.closeSnack.bind(this)}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps)(MatchingButton)

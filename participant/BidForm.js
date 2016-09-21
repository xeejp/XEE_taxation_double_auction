import React, { Component } from 'react'
import { connect } from 'react-redux'

import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import SnackBar from 'material-ui/SnackBar'

import { bid } from './actions'
import { calculateTax, applyTax } from 'shared/tax'

const mapStateToProps = ({
  usersCount, personal, taxTarget, taxType,
  lumpSumTax, proportionalRatio, regressiveRatio, progressiveRatio
}) => {
  const role = personal.role
  const money = personal.money
  return {
    tax: calculateTax(usersCount, taxTarget, taxType, lumpSumTax, proportionalRatio, regressiveRatio, progressiveRatio, role, money),
    role, money, taxTarget, taxType,
    lumpSumTax, proportionalRatio, regressiveRatio, progressiveRatio
  }
}

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
    const { role, money, tax } = this.props
    const numValue = applyTax(role, parseInt(value, 10), tax)
    const isValid = role == "buyer"
      ? numValue <= money
      : numValue >= money
    this.setState({
      value,
      isValid
    })
  }

  handleClick() {
    const { dispatch, tax, role } = this.props
    const { value } = this.state
    this.setState({
      value: '',
      isValid: false,
      snack: true,
      bid: value
    })
    dispatch(bid(applyTax(role, parseInt(value, 10), tax)))
  }

  handleKeyDown(event) {
    const { isValid } = this.state
    if (isValid && (event.key === "Enter" || event.keyCode === 13)) { // Enter
      this.handleClick()
    }
  }

  renderTrial() {
    const bid = parseInt(this.state.value, 10)
    const { role, money, tax } = this.props
    const gain = role == "buyer" ? money - bid : bid - money
    const realBid = applyTax(role, bid, tax)
    return (
      <div>
        {
          tax != 0
          ? <p>あなたは{tax}の税金を収めなければならないので、実際には{realBid}で入札します。</p>
          : <p>あなたは{bid}で入札します。</p>
        }
        <p>取引が成立したとき、あなたは{gain}の利得を手に入れます。</p>
      </div>
    )
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
        />
        <RaisedButton
          primary={true}
          disabled={!isValid}
          onClick={this.handleClick.bind(this)}
        >送信</RaisedButton>
        {isValid ? this.renderTrial() : null}
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

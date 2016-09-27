import React, { Component } from 'react'
import { connect } from 'react-redux'

import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import { Step, Stepper, StepButton } from 'material-ui/Stepper'

import { submitMode, nextMode } from 'host/actions'

import { getMode } from 'util/index'

const modes = ["wait", "description", "auction", "result"]

const mapStateToProps = ({ mode }) => ({
  mode
})

class ModeButtons extends Component {
  changeMode(mode) {
    const { dispatch } = this.props
    dispatch(submitMode(mode))
  }

  backMode() {
    const { dispatch, mode } = this.props
    const modes = ["description", "auction", "result", "wait"]
    let next = modes[modes.length - 1]
    for (let i = modes.length - 1; i >= 0; i --) {
      if (mode == modes[i]) {
        next = modes[(i + modes.length - 1) % modes.length]
        break
      }
    }
    dispatch(submitMode(next))
  }

  nextMode(mode) {
    const { dispatch } = this.props
    dispatch(nextMode())
  }

  render() {
    const { mode } = this.props
    const buttons = []
    for (let i = 0; i < modes.length; i ++) {
      buttons[i] = (
        <Step key={i}>
          <StepButton
            onClick={this.changeMode.bind(this, modes[i])}
          >{getMode(modes[i])}</StepButton>
        </Step>
      )
    }
    return (
      <span>
        <Stepper activeStep={modes.indexOf(mode)} linear={false}>
          {buttons}
        </Stepper>
        <FlatButton onClick={this.backMode.bind(this)} style={{ marginLeft: '3%' }} disabled={mode == "wait"}>戻る</FlatButton>
        <RaisedButton onClick={this.nextMode.bind(this)} primary={true} style={{ marginLeft: '3%' }}>次へ</RaisedButton>
      </span>
    )
  }
}

export default connect(mapStateToProps)(ModeButtons)

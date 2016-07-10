import React, { Component } from 'react'
import { connect } from 'react-redux'

import RaisedButton from 'material-ui/RaisedButton'
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
        <RaisedButton onClick={this.nextMode.bind(this)} primary={true} style={{ marginLeft: '3%' }}>次へ</RaisedButton>
      </span>
    )
  }
}

export default connect(mapStateToProps)(ModeButtons)

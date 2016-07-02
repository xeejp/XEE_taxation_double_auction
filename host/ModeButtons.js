import React, { Component } from 'react'
import { connect } from 'react-redux'

import RaisedButton from 'material-ui/RaisedButton'

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
    const buttons = []
    for (let i = 0; i < modes.length; i ++) {
      buttons[i] = (
        <RaisedButton key={i} onClick={this.changeMode.bind(this, modes[i])} secondary={modes[i] == this.props.mode } style={{ marginRight: i == 0 ? '2%' : '0%' }}>
          {getMode(modes[i])}
        </RaisedButton>
      )
    }
    return (
      <span>
        {buttons}
        <RaisedButton onClick={this.nextMode.bind(this)} primary={true} style={{ marginLeft: '3%' }}>次のモードへ</RaisedButton>
      </span>
    )
  }
}

export default connect(mapStateToProps)(ModeButtons)

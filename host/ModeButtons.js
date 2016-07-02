import React, { Component } from 'react'
import { connect } from 'react-redux'

import RaisedButton from 'material-ui/RaisedButton'

import { submitMode, nextMode } from 'host/actions'

const modes = ["wait", "description", "auction", "result"]

const mapStateToProps = ({ mode }) => ({
  mode
})

class ModeButtons extends Component {
  changeMode(mode) {
    const { dispatch } = this.props
    if (confirm("本当に" + mode + "モードに移行しますか？")) {
      dispatch(submitMode(mode))
    }
  }

  nextMode(mode) {
    const { dispatch } = this.props
    dispatch(nextMode())
  }

  render() {
    const buttons = []
    for (let i = 0; i < modes.length; i ++) {
      buttons[i] = (
        <RaisedButton key={i} onClick={this.changeMode.bind(this, modes[i])} secondary={modes[i] == this.props.mode }>
          {modes[i]}
        </RaisedButton>
      )
    }
    return (
      <div>
        {buttons}
        <RaisedButton onClick={this.nextMode.bind(this)} primary={true}>次のモードへ</RaisedButton>
      </div>
    )
  }
}

export default connect(mapStateToProps)(ModeButtons)

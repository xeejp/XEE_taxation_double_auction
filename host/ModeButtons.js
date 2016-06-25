import React, { Component } from 'react'
import { connect } from 'react-redux'

import RaisedButton from 'material-ui/RaisedButton'

import { changeMode } from 'host/actions'

const modes = ["wait", "description", "auction", "result"]

const mapStateToProps = ({ mode }) => ({
  mode
})

class ModeButtons extends Component {
  changeMode(mode) {
    const { dispatch } = this.props
    dispatch(changeMode(mode))
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
      </div>
    )
  }
}

export default connect(mapStateToProps)(ModeButtons)

import React, { Component } from 'react'
import { connect } from 'react-redux'

import RaisedButton from 'material-ui/RaisedButton'

import { match } from './actions'

const mapStateToProps = ({}) => ({
})

class MatchingButton extends Component {
  handleClick() {
    const { dispatch } = this.props
    dispatch(match())
  }

  render() {
    const { style } = this.props
    return (
      <RaisedButton
        onClick={this.handleClick.bind(this)}
        style={style}
      >
        再マッチング
      </RaisedButton>
    )
  }
}

export default connect(mapStateToProps)(MatchingButton)

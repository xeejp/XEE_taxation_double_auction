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
    return (
      <RaisedButton
        onClick={this.handleClick.bind(this)}
        primary={true}
        style={{
          marginLeft: '1%'
        }}
      >
        マッチング
      </RaisedButton>
    )
  }
}

export default connect(mapStateToProps)(MatchingButton)

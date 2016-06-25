import React, { Component } from 'react'
import { connect } from 'react-redux'

const mapStateToProps = ({}) => ({
})

class Wait extends Component {
  render() {
    return (
      <div>
        <p>実験が待機状態です。</p>
        <p>この画面のままお待ち下さい。</p>
      </div>
    )
  }
}

export default connect(mapStateToProps)(Wait)

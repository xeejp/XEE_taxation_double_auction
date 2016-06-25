import React, { Component } from 'react'
import { connect } from 'react-redux'

const mapStateToProps = ({}) => ({
})

class Result extends Component {
  render() {
    return (
      <div>
        <p>結果画面</p>
      </div>
    )
  }
}

export default connect(mapStateToProps)(Result)

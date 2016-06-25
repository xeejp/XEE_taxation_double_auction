import React, { Component } from 'react'
import { connect } from 'react-redux'

const mapStateToProps = ({}) => ({
})

class Description extends Component {
  render() {
    return (
      <div>
        <h2>ダブルオークション実験の説明</h2>
      </div>
    )
  }
}

export default connect(mapStateToProps)(Description)

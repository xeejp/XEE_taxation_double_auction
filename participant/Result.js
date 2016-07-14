import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Card, CardTitle, CardAction, CardText } from 'material-ui/Card'

const mapStateToProps = ({}) => ({})

class Result extends Component {
    render() {
        return (
            <Card>
                <CardTitle title="ダブルオークション実験" subtitle="結果"/>
                <CardText>
                    <p>スクリーンをご覧ください。</p>
                </CardText>
            </Card>
        )
    }
}

export default connect(mapStateToProps)(Result)

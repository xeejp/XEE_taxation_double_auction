import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, CardTitle, CardText, CardAction } from 'material-ui/Card'

const mapStateToProps = ({}) => ({})

class Description extends Component {
    render() {
        return (
        <Card>
            <CardTitle title="ダブルオークション実験" subtitle="説明"/>
                <CardText>
                    <p>これからある財の取引を行います。<br/>
                    あなたは、なるべく多くの利益が出るように取引してください。</p>

                    <p>実験が開始されると、コンピュータが自動的に参加者を売り手と買い手に振り分けます。</p>

                    <p>売り手になった人は、なるべく高い価格で財を販売することで、より多くの利益を上げることができます。<br/>
                    買い手になった人は、なるべく低い価格で財を購入することで、より多くの利益を上げることができます。</p>
                
                    <p>売り手は仕入れ値よりも低い価格で財を販売することはできません。<br/>
                    買い手は予算よりも高い価格で財を購入することはできません。</p>

                    <p>提案価格は正の整数で入力しなければなりません。<br/>
                    また、提案価格は取引が成立するまで何度でも変更することができます。</p>
                </CardText>
            </Card>
        )
    }
}

export default connect(mapStateToProps)(Description)

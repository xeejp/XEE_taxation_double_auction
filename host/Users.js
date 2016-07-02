import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Card, CardHeader, CardText } from 'material-ui/Card'

import { getRole } from 'util/index'

const User = ({ id, role, money, bid, bidded, dealt }) => (
  <tr>
    <td>{id}</td>
    <td>{getRole(role)}</td>
    <td>{money}</td>
    <td>{
      dealt
        ? bid + "で成立"
        : bidded
          ? bid + "を入札"
          : "未入札"
    }</td>
  </tr>
)

const mapStateToProps = ({ users }) => ({ users })

const Users = ({ users }) => (
  <Card>
    <CardHeader
      title={"Users (" + Object.keys(users).length + "人)"}
      actAsExpander={true}
      showExpandableButton={true}
    />
    <CardText expandable={true}>
      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>役割</th>
            <th>お金</th>
            <th>状態</th>
          </tr>
        </thead>
        <tbody>
          {
            Object.keys(users).map(id => (
              <User
                key={id}
                id={id}
                role={users[id].role}
                money={users[id].money}
                bid={users[id].bid}
                bidded={users[id].bidded}
                dealt={users[id].dealt}
              />
              ))
          }
        </tbody>
      </table>
    </CardText>
  </Card>
)

export default connect(mapStateToProps)(Users)

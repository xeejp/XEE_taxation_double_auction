import React, { Component } from 'react'
import { connect } from 'react-redux'

import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import FlatButton from 'material-ui/FlatButton'

import {
  submitTaxType, submitTaxTarget,
  submitLumpSumTax, submitProportionalRatio,
  submitRegressiveRatio, submitProgressiveRatio
} from './actions'

const LUMP_SUM_STEP = 100
const PROPORTIONAL_STEP = 10
const REGRESSIVE_STEP = 10
const PROGRESSIVE_STEP = 10

const mapStateToProps = ({
  taxType, taxTarget,
  lumpSumTax, proportionalRatio,
  regressiveRatio, progressiveRatio
}) => ({
  taxType, taxTarget,
  lumpSumTax, proportionalRatio,
  regressiveRatio, progressiveRatio
})

const actionCreators = {
  submitTaxType, submitTaxTarget,
  submitLumpSumTax, submitProportionalRatio,
  submitRegressiveRatio, submitProgressiveRatio
}

class TaxForm extends Component {
  constructor(props) {
    super(props)
    this.handleChangeTarget = this.handleChangeTarget.bind(this)
    this.handleChangeType = this.handleChangeType.bind(this)
    this.increaseTaxTenth = this.increaseTax.bind(this, null, 10)
    this.decreaseTaxTenth = this.decreaseTax.bind(this, null, 10)
    this.increaseTax = this.increaseTax.bind(this, null, 1)
    this.decreaseTax = this.decreaseTax.bind(this, null, 1)
  }

  handleChangeTarget(event, value) {
    this.props.submitTaxTarget(value)
  }

  handleChangeType(event, value) {
    this.props.submitTaxType(value)
  }

  increaseTax(event, div) {
    console.log(div)
    const {
      taxType,
      lumpSumTax, proportionalRatio,
      regressiveRatio, progressiveRatio,
      submitLumpSumTax, submitProportionalRatio,
      submitRegressiveRatio, submitProgressiveRatio
    } = this.props
    switch (taxType) {
      case "lump_sum": this.props.submitLumpSumTax(lumpSumTax + LUMP_SUM_STEP / div)
        break
      case "proportional": this.props.submitProportionalRatio(proportionalRatio + PROPORTIONAL_STEP / div)
        break
      case "regressive": this.props.submitRegressiveRatio(regressiveRatio + REGRESSIVE_STEP / div)
        break
      case "progressive": this.props.submitProgressiveRatio(progressiveRatio + PROGRESSIVE_STEP / div)
        break
    }
  }

  decreaseTax(event, div) {
    const {
      taxType,
      lumpSumTax, proportionalRatio,
      regressiveRatio, progressiveRatio,
      submitLumpSumTax, submitProportionalRatio,
      submitRegressiveRatio, submitProgressiveRatio
    } = this.props
    switch (taxType) {
      case "lump_sum": this.props.submitLumpSumTax(lumpSumTax - LUMP_SUM_STEP / div)
        break
      case "proportional": this.props.submitProportionalRatio(proportionalRatio - PROPORTIONAL_STEP / div)
        break
      case "regressive": this.props.submitRegressiveRatio(regressiveRatio - REGRESSIVE_STEP / div)
        break
      case "progressive": this.props.submitProgressiveRatio(progressiveRatio - PROGRESSIVE_STEP / div)
        break
    }
  }

  renderTargetForm() {
    const { taxTarget } = this.props
    return (
      <RadioButtonGroup
        name="target"
        valueSelected={taxTarget}
        onChange={this.handleChangeTarget}
      >
        <RadioButton
          value="both"
          label="全体"
        />
        <RadioButton
          value="seller"
          label="売り手"
        />
        <RadioButton
          value="buyer"
          label="買い手"
        />
      </RadioButtonGroup>
    )
  }

  renderTypeForm() {
    const { taxType } = this.props
    return (
      <RadioButtonGroup
        name="type"
        valueSelected={taxType}
        onChange={this.handleChangeType}
      >
        <RadioButton
          value="lump_sum"
          label="一括税"
        />
        <RadioButton
          value="proportional"
          label="比例税"
        />
        <RadioButton
          value="regressive"
          label="逆進税"
        />
        <RadioButton
          value="progressive"
          label="累進税"
        />
      </RadioButtonGroup>
    )
  }

  renderEditForm() {
    const {
      taxType,
      lumpSumTax, proportionalRatio,
      regressiveRatio, progressiveRatio
    } = this.props
    switch (taxType) {
      case "lump_sum":
        return (
          <span>{lumpSumTax}</span>
        )
      case "proportional":
        return (
          <span>{proportionalRatio/100}</span>
        )
      case "regressive":
        return (
          <span>{regressiveRatio/100}</span>
        )
      case "progressive":
        return (
          <span>{progressiveRatio/100}</span>
        )
    }
  }

  render() {
    return (
      <div>
        <p>課税対象</p>
        {this.renderTargetForm()}
        <p>課税の種類</p>
        {this.renderTypeForm()}
        <p>課税内容</p>
        <div>
          <FlatButton
            label="<<"
            onClick={this.decreaseTax}
          />
          <FlatButton
            label="<"
            onClick={this.decreaseTaxTenth}
          />
          {this.renderEditForm()}
          <FlatButton
            label=">"
            onClick={this.increaseTaxTenth}
          />
          <FlatButton
            label=">>"
            onClick={this.increaseTax}
          />
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, actionCreators)(TaxForm)

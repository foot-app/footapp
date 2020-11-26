import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Row from '../common/layout/row'
import Grid from '../common/layout/grid'
import ProfileEditFormPositionsFut7 from './profileEditFormPositionsFut7'
import ProfileEditFormPositionsFutsal from './profileEditFormPositionsFutsal'

class ProfileEditFormPositions extends Component {
    constructor(props) {
        super(props)
        this.changeMatchType = this.changeMatchType.bind(this)
    }

    componentDidUpdate() {
        const matchType = $('#matchType').val()
        this.treatPositionsVisibility(matchType)
        this.loadUserPositions()
    }

    loadUserPositions() {
        const profile = this.props.profile
        const fut7Positions = profile.fut7Positions
        const futsalPositions = profile.futsalPositions

        fut7Positions.forEach(position => {
            $(`input[name='fut7-positions-${position}']`).prop('checked', true)
        })

        futsalPositions.forEach(position => {
            $(`input[name='futsal-positions-${position}']`).prop('checked', true)
        })
    }

    changeMatchType(event) {
        this.treatPositionsVisibility(event.target.value)
    }

    treatPositionsVisibility(selectInputValue) {
        if (selectInputValue == "futsal") {
            $('.profileEdit-positions-futsal').show()
            $('.profileEdit-positions-fut7').hide()
        }
        else {
            $('.profileEdit-positions-futsal').hide()
            $('.profileEdit-positions-fut7').show()
        }
    }

    render() {
        return (
            <fieldset>
                <legend>Posições</legend>
                <div className='form-group'>
                    <Row>
                        <Grid cols='12 4' offset='0 2'>
                            <label htmlFor='matchType'>Tipo de partida</label>
                            <select name='matchType' id='matchType' className='form-control' data-test-id='matchType' onChange={this.changeMatchType}>
                                <option value='fut7'>Fut7</option>
                                <option value='futsal'>Futsal</option>
                            </select>
                        </Grid>
                        <ProfileEditFormPositionsFut7 />
                        <ProfileEditFormPositionsFutsal />
                    </Row>
                </div>
            </fieldset>
        )
    }
}

const mapStateToProps = state => ({ 
    profile: state.profile.userInfo
})
const mapDispatchToProps = dispatch => bindActionCreators({  } , dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(ProfileEditFormPositions)
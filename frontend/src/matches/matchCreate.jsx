import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { toastr } from 'react-redux-toastr'

import { create } from './matchActions'

import Grid from '../common/layout/grid'
import Row from '../common/layout/row'
import { Link } from 'react-router'
import MatchCreateForm from './matchCreateForm'


class matchCreate extends Component {
    constructor(props) {
        super(props)
        this.createMatch = this.createMatch.bind(this)
    }

    createMatch(values) {
        this.props.create(values)
    }

    render() {
        return (
            <div id='matchCreate-content' className='container'>
                <Row>
                    <Grid cols='12' className='text-center'>
                        <h2>Crie sua partida</h2>
                    </Grid>
                </Row>
                <Row>
                    <Grid cols='12' className='text-center'>
                        <MatchCreateForm onSubmit={this.createMatch}/>
                    </Grid>
                </Row>
            </div>
        )
    }
}

const mapStateToProps = state => ({})
const mapDispatchToProps = dispatch => bindActionCreators({ create } , dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(matchCreate)
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Grid from '../common/layout/grid'
import Row from '../common/layout/row'
import { Link } from 'react-router'

class Matches extends Component {
    constructor(props) {
        super();
    }

    render() {
        return (
            <div id='matches-container' className='container'>
                <Row id='button-row'>
                    <Grid cols='12' className='text-center'>
                        <Link to='/match/create' className='btn btn-warning' role='button' data-test-id='createMatchButton'>Criar partida</Link>
                    </Grid>
                </Row>
            </div>
        )
    }
}

const mapStateToProps = state => ({ })
const mapDispatchToProps = dispatch => bindActionCreators({} , dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Matches)
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Grid from '../common/layout/grid'
import Row from '../common/layout/row'
import { Link } from 'react-router'
import { loadMyMatches } from './matchActions'

class Matches extends Component {
    constructor(props) {
        super();
    }

    componentWillMount() {
        this.props.loadMyMatches()
        console.log(this.props.match.myMatches)
    }

    renderMatchesTable() {
        return this.props.match.myMatches.map((match, index) => {
            const { name, matchType} = match
            return (
                <tr key={index} data-test-id={`table_item_${index}`}>
                    <td>{name}</td>
                    <td>{matchType}</td>
                </tr>
            )
        })
    }

    renderTableHeader() {
        return (
            <tr>
                <th>NOME</th>
                <th>TIPO</th>
            </tr>
        )
    }

    render() {
        return (
            <div id='matches-container' className='container'>
                <div>
                    <h1 id='table-title'>Minhas Partidas</h1>
                    <table id='my-matches'> 
                        <tbody>
                            {this.renderTableHeader()}
                            {this.renderMatchesTable()}
                        </tbody>
                    </table>
                </div>
                <Row id='button-row'>
                    <Grid cols='12' className='text-center'>
                        <Link to='/match/create' className='btn btn-warning' role='button' data-test-id='createMatchButton'>Criar partida</Link>
                    </Grid>
                </Row>
            </div>
        )
    }
}

const mapStateToProps = state => ({ 
    match: state.match 
})
const mapDispatchToProps = dispatch => bindActionCreators({ loadMyMatches } , dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Matches)
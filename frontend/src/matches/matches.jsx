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
    }

    renderMatchesTable() {
        return this.props.match.myMatches.map((match, index) => {
            const { name, matchType} = match
            const date = this.formatDate(match.date)
            return (
                <tr key={index} data-test-id={`table_item_${index}`}>
                    <td>{name}</td>
                    <td>{matchType}</td>
                    <td>{date}</td>
                </tr>
            )
        })
    }

    formatDate(stringDate) {
        const date = new Date(stringDate)
        let month = String(date.getMonth() + 1);
        let day = String(date.getDate());
        const year = String(date.getFullYear());
        const hour = String(date.getHours());
        const minutes = String(date.getMinutes());

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return `${day}/${month}/${year} - ${hour}:${minutes}`;
    }

    renderTableHeader() {
        return (
            <tr>
                <th>NOME</th>
                <th>TIPO</th>
                <th>DATA E HORÁRIO</th>
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
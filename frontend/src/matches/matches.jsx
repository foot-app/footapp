import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { toastr } from 'react-redux-toastr'

import Grid from '../common/layout/grid'
import Row from '../common/layout/row'
import { Link } from 'react-router'
import { loadMyMatches, deleteMatch } from './matchActions'

class Matches extends Component {
    constructor(props) {
        super();
    }

    componentWillMount() {
        this.props.loadMyMatches()
    }

    onClickEventDeleteMatch(event) {
        let promise = this.props.deleteMatch(event.target.id);
            promise.then(() => {
                this.props.loadMyMatches();
            })
            promise.catch(e => {
                e.response.data.errors.forEach(error => toastr.error('Erro', error))
            })
    }

    renderMatchesTable() {
        return this.props.match.myMatches.map((match, index) => {
            const { _id, name, matchType} = match
            const date = this.formatDate(match.date)
            return (
                <tr key={_id} data-test-id={`table_item`}>
                    <td>{name}</td>
                    <td>{matchType}</td>
                    <td>{date}</td>
                    <td>
                        <i data-test-id='delete-match-button' id={_id} onClick={ event => this.onClickEventDeleteMatch(event)} className="fa fa-trash trash-icon"></i>
                    </td>
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
                <th></th>
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
    match: state.match,
})
const mapDispatchToProps = dispatch => bindActionCreators({ loadMyMatches, deleteMatch } , dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Matches)
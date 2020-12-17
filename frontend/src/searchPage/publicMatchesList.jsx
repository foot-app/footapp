import React from 'react';
import axios from 'axios';
import consts from '../consts';

class PublicMatchesList extends React.Component {
    
    constructor(props) {
        super();
    }

    renderTableHeader() {
        return (
            <tr>
                <th>Nome da partida</th>
                <th>Data</th>
                <th>Número de participantes</th>
                <th></th>
            </tr>
        )
    }

    renderPublicMatchesItens() {
        return this.props.publicMatches.map((match, index) => {
            const { name } = match
            const matchDate = this.formatDate(match.date);
            return (
                <tr key={index}>
                    <td>{name}</td>
                    <td>{matchDate}</td>
                    <td>{match.participants.length}</td>
                    <td><button onClick={() => this.joinMatch(match._id)} className='btn btn-success'>Participar</button></td>
                </tr>
            )
        })
    }

    joinMatch(matchId) {
        const userKey = '_footapp'
        const userInfoLocalStorage = JSON.parse(localStorage.getItem(userKey));
        const userNickname = userInfoLocalStorage.nickname;
        axios.post(`${consts.API_URL}/publicMatches/join`, { matchId, userNickname })
            .then(resp => {
                toastr.success('Sucesso', 'Participação cadastrada com sucesso!')
            })
            .catch(e => {
                e.response.data.errors.forEach(error => toastr.error('Erro', error))
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

    render() {

        return (
            <div>
                <h2 id='table-title'>Partidas Públicas</h2>
                <table id='public-matches-table'>
                    <tbody>
                        {this.renderTableHeader()}
                        {this.renderPublicMatchesItens()}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default PublicMatchesList;
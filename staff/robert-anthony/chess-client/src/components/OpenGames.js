import React, {Component} from 'react'
import {ListGroup, ListGroupItem} from 'reactstrap'
import PropTypes from 'prop-types'; // ES6


class OpenGames extends Component {

  static propTypes = {
    onUserClick: PropTypes.func,
    games: PropTypes.array,
    nickname: PropTypes.string,
    currentGameViewed: PropTypes.object,
    userList:PropTypes.array,
  }

  state = {
    error: "",
  }

  onUserClick = (e, game) => {
    e.preventDefault()
    this.props.onUserClick(game)
  }


  render() {
    let {props: {games, nickname, currentGameViewed}} = this
    let userList
    if (games.length) {
      games = games.filter(game => !(game.state === 'invited' && game.initiator === nickname))
      userList = games.map(game => {
        let isCurrent = false
        if (currentGameViewed && (currentGameViewed.id === game.id)) isCurrent = true
        return <ListGroupItem key={game + Math.random()} tag="a" href="#"
                              onClick={e => this.onUserClick(e, game)}>{`${game.opponent}`}&nbsp;{(game.state === 'invited') &&
        <i className='far fa-user-circle'></i>}&nbsp;{(game.toPlay === nickname) &&
        <i className='fas fa-chess-pawn'></i>}&nbsp;{isCurrent && <i className='far fa-eye'></i>} </ListGroupItem>
      })
    }
    return   <div className="userList opengames_userList">
          <ListGroup>
            {games.length ? userList : <li>You are not playing any games with anyone at the moment</li>}
          </ListGroup>
        </div>




  }

}

export default OpenGames
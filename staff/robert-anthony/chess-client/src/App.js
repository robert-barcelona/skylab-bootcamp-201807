import React, {Component} from 'react'
import {Switch, Route, withRouter, Redirect} from 'react-router-dom'
import Register from './components/Register'
import Main from './components/Main'
import Login from './components/Login'
import Games from './components/Games'
import socketIOClient from 'socket.io-client';

import logic from "./logic"
import NavBar from "./components/NavBar"
import Invite from "./components/Invite"
import {UncontrolledAlert} from 'reactstrap'

class App extends Component {

  socket = null

  constructor() {
    let nickname, token

    super()

    this.state = {
      nickname: sessionStorage.getItem('nickname') || '',
      token: sessionStorage.getItem('token') || '',
      users: JSON.parse(sessionStorage.getItem('users')) || [],
      error: "",
      currentGames: JSON.parse(sessionStorage.getItem('currentGames')) || [],
    }

    if (sessionStorage.getItem('nickname')) // we are returning from a page refresh
    {
      nickname = sessionStorage.getItem('nickname')
      token = sessionStorage.getItem('token')
      this.setupSocketListeners(nickname, token)  // add socket listeners again
    }
  }

  clearError = () =>  this.setState({error:''})

  onError = error => this.setState({error})

  onAcknowledgeGameOver = (nickname, gameID) => {
    const {state: {token}} = this
    this.clearError()
    logic.onAcknowledgeGameOver(nickname, gameID, token)
      .then(_ => this.getCurrentGamesForUser(nickname, token))
      .catch(({message}) => this.onError(message))
  }

  componentDidMount() {
    const {state: {nickname, token}} = this
    this.clearError()
    if (this.isLoggedIn()) this.getCurrentGamesForUser(nickname, token)
  }

  getCurrentGamesForUser = (nickname, token) => {
    return logic.getGamesForUser(nickname, token)
      .then(currentGames => {
        this.setState({currentGames})
        sessionStorage.setItem('currentGames', JSON.stringify(currentGames))
      })
      .catch(({message}) => this.onError(message))
  }

  getUsersForString = (str, token) => {
    const {state: {nickname}} = this
    logic.getUsersForString(nickname, str, token)
      .then(users => {
        sessionStorage.setItem('users', JSON.stringify(users))
        this.setState({users})
      })
      .catch(({message}) => this.onError(message))
  }

  onRespondToGameRequest = (destination, gameID, answer) => {
    const {state: {nickname, token}} = this
    this.clearError()
    logic.respondToGameRequest(nickname, destination, gameID, answer, token)
      .then(_ => this.getCurrentGamesForUser(nickname, token))
  }

  onRequestGame = (destination) => {
    this.clearError()
    logic.requestGame(this.state.nickname, destination, this.state.token)
      .catch(({message}) => this.onError(message))
  }


  setupSocketListeners = (nickname, token) => {

  //  this.socket = socketIOClient(`https://tranquil-ridge-60570.herokuapp.com/`);
    this.socket = socketIOClient(`http://localhost:8080`);
    if (this.socket) {

      this.socket.on(`error ${nickname}`, message => console.error(message))

      this.socket.on(`update to games ${nickname}`, () => {
        console.log(`%c update to games ${nickname}`, 'background: #222; color: #bada55');
        this.getCurrentGamesForUser(nickname, token)

      })

      this.socket.on('user disconnected', () => {
        const {state: {token}} = this
        if (token) this.getUsersForString('', token)
      })

      this.socket.on('user connected', () => {
        const {state: {token}} = this
        if (token) this.getUsersForString('', token)
      })

      this.socket.on('reconnect', (attemptNumber) => {
        console.error(`socket reconnect on client side, attemptNumber = ${attemptNumber}`)

      });

      this.socket.on('disconnect', (reason) => {
        console.error(`socket disconnect on client side, reason = ${reason}`)
        if (reason === 'io server disconnect') {
          // the disconnection was initiated by the server, you need to reconnect manually
          this.onLogout()
        }
        // else the socket will automatically try to reconnect
      });

    } else console.error("Error establishing connection to socket server")

  }


  onLoggedIn = (nickname, token) => {
    this.setupSocketListeners(nickname, token)
    this.getCurrentGamesForUser(nickname, token)
    this.setState({nickname: nickname, token})
    this.socket.emit('authenticated', nickname)
    sessionStorage.setItem('nickname', nickname)
    sessionStorage.setItem('token', token)
  }

  onGameMove = (move, gameID, opponent) => {
    const {state: {nickname, token}} = this
    this.clearError()
    logic.makeAGameMove(nickname, opponent, move, gameID, token)
      .then(_ =>  this.getCurrentGamesForUser(nickname,token))
      .catch(({message}) => this.onError(message))
  }

  onInviteUser = user => {
    const {state: {nickname, token}} = this
    this.clearError()
    logic.requestGame(this.state.nickname, user, this.state.token)
      .then(_ => this.getCurrentGamesForUser(nickname, token))
      .catch(({message}) => this.onError(message))
  }


  isLoggedIn() {
    return !!this.state.nickname
  }

  onLogout = () => {
    // this.socket.emit('logout', this.state.nickname)
    this.setState({nickname: '', token: '',users:[],currentGames:[]})
// removesocketlisteners ??
    sessionStorage.clear()
  }

  render() {
    const {nickname, users, error, token, currentGames} = this.state

    return <div>
      <header>
        <NavBar nickname={nickname} isLoggedIn={this.isLoggedIn()} onLogout={this.onLogout}/>
      </header>
      {error && <UncontrolledAlert color="dark"> {error}</UncontrolledAlert>}
      <main>
        <Switch>
          <Route exact path="/" render={() => <Main/>}/>
          <Route path="/main" render={() => <Main/>}/>
          <Route path="/register" render={() => this.isLoggedIn() ? <Redirect to="/main"/> : <Register
            onError={this.onError}
            clearError={this.clearError}

          />}/>

          <Route path="/games" render={() => this.isLoggedIn() ?
            <Games
              onError={this.onError}
              clearError={this.clearError}
              onAcknowledgeGameOver={this.onAcknowledgeGameOver}
              onGameMove={this.onGameMove}
              currentGames={currentGames}
              onRespondToGameRequest={this.onRespondToGameRequest}
              nickname={nickname}
            /> : <Redirect to="/main"/>}/>
          <Route path="/invite" render={() => this.isLoggedIn() ?
            <Invite

              onUserClick={this.onInviteUser}
              currentGames={currentGames}
              allUsers={users}
              nickname={nickname}
              onUserSearchByString={term => this.getUsersForString(term, token)}
            /> : <Redirect to="/main"/>}/>
          <Route path="/login" render={() => this.isLoggedIn() ? <Redirect to="/main"/> :
            <Login
              onError={this.onError}
              clearError={this.clearError}
              onLoggedIn={this.onLoggedIn}/>}/>
        </Switch>
      </main>
      <footer>
      </footer>
    </div>
  }
}

export default withRouter(App)

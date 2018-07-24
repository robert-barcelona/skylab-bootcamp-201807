import React, { Component } from 'react'

class Logout extends Component {

    state = { 
        username: null, 
        password: null 
    }

    keepUsername = event => this.setState({ username: event.target.value })
    keepPassword = event => this.setState({ password: event.target.value })

    onLogout = event => {
        event.preventDefault()
        const { username, password } = this.state
        this.props.onLogin(username, password)
    }

    render() {
        return <form onSubmit={this.onLogout}>
                    <input type="text" onChange={this.keepUsername} placeholder="enter your username" />
                    <input type="password" onChange={this.keepPassword} placeholder="enter your password" />
                    <button type="submit">Logout</button>
                </form>
    }
}

export default Logout
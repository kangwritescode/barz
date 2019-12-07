import React, { Component } from 'react';
import Navbar from './containers/Navbar/Navbar'
import Scribble from './containers/Scribble/Scribble'
import Hub from './containers/Hub/Hub'
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import ReactPlayer from 'react-player'
import { connect } from 'react-redux'
import Judge from './containers/Judge/Judge'
import { fetchUserData, authCheckState } from './store/actions/auth'
import Wordsmiths from './containers/Wordsmiths/Wordsmiths'
import './App.css'
import firebase from 'firebase'
import Landing from './containers/Landing/Landing';
import DevModal from './components/DevModal/DevModal';


class App extends Component {


  state = {
    showPopup: false
  }


  componentDidMount() {
    if (this.props.location.pathname.slice(1) === 'recruit-david') {
      // this.signIn()
    } else {
      this.props.onTryAutoSignin()
    }
  }
  componentDidUpdate = (prevProps, prevState) => {
    if (!prevProps.authenticated && this.props.authenticated) {
      // this.togglePopup(true)
    }
    if (prevProps.username != this.props.username) {
      if (this.props.username === 'recruit_david') {
        if (this.props.username === 'recruit_david') {
          setTimeout(() => {
            alert("You've been auto-signed in with the recruit_david profile!")
          }, 1000)

        }
      }
    }
  }
  signIn = async () => {
    const uid = await this.authenticate('recruitDavid@gmail.com', 'recruitDavid')
    var db = firebase.firestore()
    db.collection('users').doc(uid).get().then(() => {
      this.props.fetchUserData(uid)
    })
  }
  authenticate = async (email, password) => {

    return await firebase.auth().signInWithEmailAndPassword(email, password)
      .then(successObj => {

        var uid = successObj.user.uid
        var refreshToken = successObj.user.refreshToken
        let expirationDate = new Date()
        expirationDate.setHours(expirationDate.getHours() + 100)

        localStorage.setItem('token', refreshToken)
        localStorage.setItem('expirationDate', expirationDate)
        localStorage.setItem('uid', uid)
        return successObj.user.uid

      })
      .catch(function (error) {
        console.log(error)
        throw error
      });
  }



  togglePopup = (bool) => {
    this.setState({
      ...this.state,
      showPopup: bool
    })
  }

  render() {

    if (this.props.location.pathname.slice(1) === 'recruit-david') {
      this.signIn()
      return <Redirect to="/" />
    }

    if (this.props.autoSignInOver && !this.props.authenticated) {
      return <Landing />
    }

    return (
      <div className="App">
        {this.state.showPopup ? <DevModal togglePopup={this.togglePopup} /> : null}
        <Navbar />
        <ReactPlayer
          volume={this.props.volume * 1.0 / 100}
          url={this.props.musicURL} a
          playing={this.props.playing}
          loop
          width="0px"
          height="0px" />
        <Switch>
          <Route path="/scribble" component={Scribble} ></Route>
          <Route path="/judge" component={Judge} ></Route>
          <Route path="/wordsmiths" component={Wordsmiths} ></Route>
          <Route path="/hub" component={Hub} ></Route>
          <Route path="/:username" component={Hub}></Route>
          <Route path="/" component={Hub}></Route>
        </Switch>
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    playing: state.music.playing,
    musicURL: state.music.musicURL,
    volume: state.music.volume,
    authenticated: state.user.loggedIn,
    email: state.user.email,
    autoSignInOver: state.user.autoSignInOver,
    photoURL: state.user.photoURL,
    username: state.user.username
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignin: () => dispatch(authCheckState()),
    fetchUserData: (uid) => dispatch(fetchUserData(uid)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));

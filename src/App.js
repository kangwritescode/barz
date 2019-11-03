import React, { Component } from 'react';
import Navbar from './components/Navbar/Navbar'
import Scribble from './components/Scribble/Scribble'
import Hub from './containers/Hub/Hub'
import { Route, Switch, withRouter } from 'react-router-dom';
import ReactPlayer from 'react-player'
import { connect } from 'react-redux'
import Judge from './containers/Judge/Judge'
import { fetchUserData, authCheckState } from './store/actionCreators'
import Wordsmiths from './containers/Wordsmiths/Wordsmiths'
import './App.css'
import Landing from './containers/Landing/Landing';


class App extends Component {

  componentDidMount() {
    this.props.onTryAutoSignin()
  }

  render() {

    let app = (
        <div>
          <Navbar />
          <ReactPlayer
            volume={this.props.volume * 1.0 / 100}
            url={this.props.musicURL}a
            playing={this.props.playing}
            loop
            width="0px"
            height="0px" />
  
          <Switch>
            <Route path="/scribble" component={Scribble} ></Route>
            <Route path="/judge" component={Judge} ></Route>
            <Route path="/wordsmiths" component={Wordsmiths} ></Route>
            <Route path="/hub" component={Hub} ></Route>
            <Route path="/" component={Hub}></Route>
          </Switch>
        </div>
  
      )
  
    


      return (
        <div className="App">
          {app}
        </div>
      )
  }
}
const mapStateToProps = state => {
  return {
    playing: state.playing,
    musicURL: state.musicURL,
    volume: state.volume,
    authenticated: state.loggedIn,
    email: state.email

  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignin: () => dispatch(authCheckState()),
    fetchUserData: (uid) => dispatch(fetchUserData(uid))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));

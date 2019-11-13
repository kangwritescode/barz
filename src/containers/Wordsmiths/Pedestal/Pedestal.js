import React, { Component } from 'react'
import './Pedestal.css'
import 'firebase/firestore'
import copy from 'clipboard-copy'
import ig from '../../../assets/handles/ig.png'
import fb from '../../../assets/handles/fb.png'
import sc from '../../../assets/handles/sc.png'
import yt from '../../../assets/handles/yt.png'
import PopNotif from '../../../shared/PopNotif/PopNotif'
import firebase from 'firebase'
import 'firebase/firestore'

class Pedestal extends Component {

    static defaultProps = {
        defaultURL: 'https://firebasestorage.googleapis.com/v0/b/barz-86ae0.appspot.com/o/mysteryman%2Fmysteryman.png?alt=media&token=7b1e5a7c-ede3-46ff-a036-70636e528cd2',
        rapper: {}
    }
    state = {
        photoURL: '',
        user: null,
        fetching: false
    }

    componentDidUpdate = async (prevProps, prevState) => {

        if (prevProps.rapper !== this.props.rapper) {
            this.setState({
                ...this.state,
                fetching: true
            })
            let db = firebase.firestore()
            let user = await db.collection('users').doc(this.props.rapper.uid).get()
                .then(doc => {
                    return doc.data()
                })
            let photoURL = await this.fetchRapperPhotoURL(user.photoRef)

            this.setState({
                ...this.state,
                user: user,
                photoURL: photoURL,
                fetching: false
            })
        }
    }

    fetchRapperPhotoURL = async (photoRef) => {

        let storage = firebase.storage()
        return storage.ref(photoRef).getDownloadURL()
            .then(url => {
                return url
            })
            .catch(err => {
                console.log(err)
            });

    }

    // credit to stackoverflow.com/questions/13627308
    getOrdinal = (i) => {
        let j = i % 10
        let k = i % 100
        if (j === 1 && k !== 11) { return "st" }
        if (j === 2 && k !== 12) { return "nd" }
        if (j === 3 && k !== 13) { return "rd" }
        else { return "th" }
    }

    openSocialMedia = (type, url) => {

        try {

            if (url && type === 'ig') {
                window.open(`www.instagram.com/${url}`)
            }
            else if (url) {
                window.open(url)
            }
        }
        catch (err) {
            console.log("sorry that link is broken")
        }
    }

    addhttp = (url) => {
        if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
            url = "http://" + url;
        }
        return url;
    }


    render() {


        // fetching ?
        let fetching = this.state.fetching ? 'fetching' : null
        console.log(fetching, 'sfsdfsd')

        // relevantRapper
        let releventRapper = this.props.rapper
        // general information
        let username = releventRapper ? releventRapper.username : 'Select a User'
        let city = releventRapper ? releventRapper.city : null
        let state = releventRapper ? releventRapper.state : null
        let gender = releventRapper ? releventRapper.gender : null
        let cityStateGender = releventRapper ? `${city}, ${state} | ${gender}` : null
        let rank = releventRapper ? releventRapper.rank + this.getOrdinal(releventRapper.rank) : null
        let subCount = releventRapper ? releventRapper.submissionCount : null
        let score = releventRapper ? releventRapper.votes : null

        // databaseUser
        let firebaseUser = this.state.user

        // handles
        let hasFB = firebaseUser && firebaseUser.handles.facebook ? firebaseUser.handles.facebook : null
        let hasIG = firebaseUser && firebaseUser.handles.instagram ? firebaseUser.handles.instagram : null
        let hasSC = firebaseUser && firebaseUser.handles.soundcloud ? firebaseUser.handles.soundcloud : null
        let hasYT = firebaseUser && firebaseUser.handles.youtube ? firebaseUser.handles.youtube : null

        // everything ( firebaseUser, relevantUser, photoRef) is loaded

        return (
            <div className="Pedestal">
                <div id="Pedestal-Header">Spotlight</div>
                <div className="spotlight-block" id="spotlight-block-one">
                    <div className={`spotlight-username`}>{username}</div>
                    <div className={`spotlight-details`}>{cityStateGender}</div>
                    <div className={`spotlight-photo-container`}>
                        <img className={`spotlight-photo ${fetching}`} alt="" src={this.state.photoURL ? this.state.photoURL : this.props.defaultURL} />
                    </div>
                </div>
                <div className="spotlight-block" id="spotlight-block-two">
                    <div className="spotlight-stats-container">
                        {this.props.sort === "Best" ?
                            <div className="stat-holder">
                                <div className={`stat-value`}>{rank}</div>
                                <div className="stat"><u>{this.props.rapper ? 'Rank' : null}</u></div>
                            </div> : null}
                        <div className="stat-holder">
                            <div className={`stat-value`}>{score}</div>
                            <div className="stat"><u>{this.props.rapper ? 'Score' : null}</u></div>
                        </div>
                        <div className="stat-holder">
                            <div className={`stat-value`}>{subCount}</div>
                            <div className="stat"><u>{this.props.rapper ? 'Posts' : null}</u></div>
                        </div>
                    </div>
                </div>
                <div className="spotlight-block" id="spotlight-block-three">
                    <div className={`spotlight-handles-container ${fetching}`}>
                        {hasFB ?
                            <a className={`handle-container handle-activated`} href={this.addhttp(hasFB)} target="_blank">
                                <img className={`spotlight-fb`} alt="" src={fb}></img>
                            </a> : null}
                        {hasIG ?
                            <a className={`handle-container handle-activated`} href={`https://www.instagram.com/${hasIG}/`} target="_blank">
                                <img className={`spotlight-ig`} alt="" src={ig}></img>
                            </a> : null}
                        {hasSC ?
                            <a className={`handle-container handle-activated`} href={this.addhttp(hasSC)} target="_blank">
                                <img className={`spotlight-sc`} alt="" src={sc}></img>
                            </a> : null}
                        {hasYT ?
                            <a className={`handle-container handle-activated`} href={this.addhttp(hasYT)} target="_blank">
                                <img className={`spotlight-yt`} alt="" src={yt}></img>
                            </a> : null}

                    </div>
                </div>
                <div></div>
            </div>
        )
    }
}

export default Pedestal
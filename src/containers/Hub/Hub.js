import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import './Hub.css'
import firebase from 'firebase'
// import Aux from '../../hoc/Aux/'
import { getOrdinal } from '../../shared/getOrdinal'
import yox from '../../assets/yox.m4v'
import ProfileBox from './ProfileBox/ProfileBox'
import Profile from './Profile/Profile'
import UploadImage from './Profile/UploadImage/UploadImage'
import AddHandles from './Profile/AddHandles/AddHandles'
import FollowBox from './FollowBox/FollowBox'
import Turntable from '../../components/Scribble/Turntable/Turntable'


const Hub = (props) => {

    const [showPhotoModal, setShowPhotoModal] = useState(false)
    const [showUploadHandles, toggleUploadHandles] = useState(false)
    const [imgURL, setImgURL] = useState('')
    const [votes, setVotes] = useState([])
    const [myPlace, setMyPlace] = useState(null)
    const [myScore, setMyScore] = useState(0)

    // componentDidMount
    useEffect(() => {
        fetchVotes()
        return () => {
        };
    }, [])
    useEffect(() => {
        if (votes.length !== 0) {
            setMyPlace(myPlaceFinder())
        }
        return () => {
        };
    }, [votes])

    const fetchVotes = () => {
        var db = firebase.firestore()
        var fetchedVotes = []
        db.collection('postVotes').get()
            .then(snapshot => {
                var fetchedVote;
                snapshot.forEach(vote => {
                    fetchedVote = {
                        ...vote.data(),
                        vid: vote.id
                    }
                    fetchedVotes.push(fetchedVote)
                })
                setVotes(fetchedVotes)
            })
    }

    const myPlaceFinder = () => {
        const dict = {}
        console.log(dict)
        votes.forEach(vote => {
            if (vote.receiverID in dict) {
                dict[vote.receiverID] = dict[vote.receiverID] + vote.value
            } else {
                dict[vote.receiverID] = vote.value
            }
        })
        var arr = []
        for (let key in dict) {
            var obj = { uid: key, score: dict[key] }
            arr.push(obj)
        }
        arr = arr.sort((a, b) => {
            if (a.score > b.score) {
                return -1
            } return 1
        })
        var myPosition
        arr.forEach((item, index) => {
            if (item.uid === props.uid) {
                myPosition = index + 1
                setMyScore(item.score)
            }
        })
        // if you've received no votes
        if (!myPosition) {
            return arr.length + 1
        }
        return myPosition
    }

    const profile = (
        <div className="hub-layout">

            {/* modal and ui */}
            {showPhotoModal ? <UploadImage setShowPhotoModal={setShowPhotoModal} setImgURL={setImgURL} /> : null}
            {showUploadHandles ? <AddHandles toggleUploadHandles={toggleUploadHandles} /> : null}
            <img id="backup-img" src={imgURL} alt="" />
            <video id="yox" src={yox} autoPlay={true} loop={true} playsInline={true} muted />
            <div id="yoxOverlay" />
            <div id="mv-cred">YEAR OF THE OX - MOOD CONTROL CYPHER</div>

            {/* main content */}
            <div className='column-container'>
                <div className='left-column'>
                    <div className='left-column__profile-box-container'>
                        <ProfileBox
                            setShowPhotoModal={setShowPhotoModal}
                            toggleUploadHandles={toggleUploadHandles}
                            wrappedBy='Hub'
                            myPlace={myPlace}
                            myPoints={myScore}/>
                    </div>
                    <FollowBox />
                </div>
                <div className='middle-column'></div>
                <div className='right column'>
                    <div className='news-and-updates'></div>
                    <div></div>
                </div>
            </div>
        </div>
    )

    return profile

}

const mapStateToProps = state => {
    return {
        loggedIn: state.loggedIn,
        autoSignInOver: state.autoSignInOver,
        email: state.email,
        username: state.username,
        sex: state.sex,
        photoURL: state.photoURL,
        uid: state.uid
    }
}

export default connect(mapStateToProps, null)(Hub)


import React, { Component } from 'react'
import './ManyPost.css'
import firebase from 'firebase'
import 'firebase/firestore'
import manyComment from '../../../../../assets/manyComment.png'
import manyFlame from '../../../../../assets/manyFlame.png'
import ViewedPost from '../../../../../components/Scribble/MyBars/ViewedBar/ViewedPost'

class ManyPost extends Component {
    state = {
        photoURL: 'https://firebasestorage.googleapis.com/v0/b/barz-86ae0.appspot.com/o/mysteryman%2Fmysteryman.png?alt=media&token=7b1e5a7c-ede3-46ff-a036-70636e528cd2',
        score: 0,
        commentsCount: 0,

    }
    componentDidMount() {
        this.fetchPhotoURL(this.props.photoRef)
        this.fetchScore()
        this.fetchCommentsCount()
    }

    fetchPhotoURL = async (photoRef) => {
        var storage = firebase.storage()
        storage.ref(photoRef).getDownloadURL()
            .then(url => {
                this.setState({
                    ...this.state,
                    photoURL: url
                })
            })
            .catch(err => {
                console.log(err)
            });
    }

    
    fetchScore = () => {
        var db = firebase.firestore()
        db.collection('postVotes').where('pid', '==', this.props.pid).onSnapshot(snap => {
            var score = 0
            snap.docs.forEach(doc => {
                score += doc.data().value
            })
            score = Math.max(score, 0)
            this.setState({
                ...this.state,
                score: score
            })
        })

    }

    fetchCommentsCount = () => {
        var db = firebase.firestore()
        db.collection('postComments').where('pid', '==', this.props.pid).onSnapshot(snap => {
            const count = snap.size
            console.log(count)
            this.setState({
                ...this.state,
                commentsCount: count
            })
        })
    }



    render() {

        // date
        var verboseDate = this.props.createdOn.toDate().toDateString()
        const date = verboseDate.slice(4, verboseDate.length)

        // content
        var content = this.props.content.lineOne + ' / ' + this.props.content.lineTwo

        // votes 
        var score = this.state.score

        // comments count
        const commentsCount = this.state.commentsCount



        return (
            <div className='many-post' onClick={() => this.props.toggleModal('showPost', true, this.props.pid)}>
                <header>
                    <div className='many-post-details'>
                        <img className='many-post-pic' src={this.state.photoURL}></img>
                        <div className='many-post-name-date-container'>
                            <h6>{this.props.username}</h6>
                            <p>{date}</p>
                        </div>
                    </div>
                    <div className='many-post-misc'>
                        <img className='manyComment' src={manyComment} />
                        {commentsCount}
                        <img className='manyFlame' src={manyFlame} />
                        {score}
                    </div>
                </header>
                <div className='many-post-body'>
                    <p>{content + '...'}</p>
                </div>

            </div>
        )
    }
}

export default ManyPost

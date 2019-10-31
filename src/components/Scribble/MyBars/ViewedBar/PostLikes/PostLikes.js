import React, { Component } from 'react'
import { connect } from 'react-redux'
import firebase from 'firebase'
import 'firebase/firestore'


import './PostLikes.css'

class PostLikes extends Component {
    static defaultProps = {
        pid: ''
    }
    state = {
        votes: 0,
        noOfVoters: 0,
        myVote: 0
    }
    componentDidMount() {
        this.fetchInfo()

    }
    fetchInfo = () => {
        const db = firebase.firestore()
        db.collection('postVotes').where('pid', '==', this.props.viewedPost.pid).get()
            .then(snapshot => {
                var votes = 0
                const voters = new Set()
                var myVote = 0
                // for every vote of this post
                snapshot.docs.forEach(like => {
                    var vote = like.data()
                    if (vote.value === 1 || vote.value === -1) {
                        myVote = this.props.uid === vote.voterID ? Math.max(vote.value, 0) : 0
                        votes += Math.max(vote.value, 0)
                        voters.add(vote.voterID)
                    }

                })
                votes = votes < 0 ? 0 : votes
                var noOfVoters = voters.size
                console.log(myVote)
                this.setState({
                    ...this.state,
                    myVote: myVote,
                    votes: votes,
                    noOfVoters: noOfVoters
                })
            })
    }

    render() {
        var buttonStyle = this.state.myVote === 1 ? 'lit-up' : null;
        return (
            <div className='likes'>
                <div className='fire-icon-container'>
                    <i className={`fas fa-fire likes-icon ${buttonStyle}`}></i>
                </div>
                <div className='total-score'>
                    {this.state.votes} total pt{this.state.votes === 1 ? null : 's'}.
                </div>
                <div className='fans'>
                    {this.state.noOfVoters} {this.state.noOfVoters === 1 ? 'fan' : 'fans'}
                </div>

            </div>
        )
    }
}

const mapStatetoProps = state => {
    return {
        uid: state.uid
    }
}

export default connect(mapStatetoProps, null)(PostLikes)

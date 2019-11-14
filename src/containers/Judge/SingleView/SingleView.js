import React, { Component } from 'react'
import './SingleView.css'
import firebase from 'firebase'
import 'firebase/firestore'
import { connect } from 'react-redux'
import shuffle from 'shuffle-array'
import * as actionTypes from '../../../store/actions/actionsTypes'
import FourBars from './FourBars/FourBars'


class SingleView extends Component {


    state = {

        submissions: [{
            content: {
                lineOne: '',
                lineTwo: '',
                lineThree: '',
                lineFour: '',
            },
        }],
        votes: {
        },
        vote: {
            value: 0
        },

        pointer: 0,
        showBars: false,
        showErrMsg: false,
        errMsg: 'this is the default errMsg',

        popInLeft: 'pop-in-left',
        popInRight: 'pop-in-right',
        vote: null,

        sort: "Newest",
        filter: "All Posts",
        view: "Explore",


        // ManyPost
        showPost: false,
        pid: ''

    }



    componentDidMount = async () => {

        this.fetchSubmissions()
        this.fetchVotes()

        this.setState({
            ...this.state,
            showBars: true
        })
    }


    fetchSubmissions = async () => {
        let db = firebase.firestore()
        let submissions = []
        return db.collection('submissions').get().then(querySnapshot => {
            querySnapshot.forEach((doc) => {
                let post = {
                    ...doc.data(),
                    pid: doc.id
                }
                submissions.push(post)
            })
            console.log('yeeeehaw')
            this.setState({
                ...this.state,
                submissions: submissions
            })
        }).catch(err => {
            console.log(err)
        })
    }
    fetchVotes = async () => {
        let db = firebase.firestore()
        const votes = {}
        db.collection('postVotes').onSnapshot(querySnapshot => {
            querySnapshot.forEach((doc) => {
                let vote = { ...doc.data() }
                votes[doc.id] = vote
            })
            this.setState({
                ...this.state,
                votes: votes
            })
        }, err => {
            console.log(err)
        })
    }
    // fetch function
    findVote = () => {
        let submissions = [...this.state.submissions]
        submissions = this.sort_submissions(submissions)
        submissions = this.filter_submissions(submissions)
        let currSub = submissions[this.state.pointer]
        if (currSub) {
            let votes = this.state.votes
            for (let key in votes) {
                let vote = votes[key]
                if (vote.pid === currSub.pid && vote.voterID === this.props.uid) {
                    return {
                        ...vote,
                        vid: key
                    }
                }
            }
        } else {
            return null
        }
        
    }

    sort_submissions = (submissions) => {
        submissions = [...submissions]
        switch (this.props.sort) {
            case 'Newest':
                submissions = submissions.sort((a, b) => {
                    let first = a.createdOn.toDate()
                    let second = b.createdOn.toDate()
                    return first > second ? -1 : 1
                })
                return submissions
            case 'Oldest':
                submissions = submissions.sort((a, b) => {
                    let first = a.createdOn.toDate()
                    let second = b.createdOn.toDate()
                    return first < second ? -1 : 1
                })
                return submissions
            default:
                return submissions
        }
    }
    filter_submissions = (submissions) => {
        if (this.props.filter === 'All Posts') {
            return submissions
        }
        console.log('before submissions', submissions)
        submissions = [...submissions]
        let votes = this.state.votes
        votes = Object.values(votes)
        let myVotes = votes.filter(vote => vote.voterID === this.props.uid)

        submissions = submissions
            .filter(submission => {
                let thisVotes = myVotes.filter(vote => vote.pid === submission.pid)
                let unvoted = true
                thisVotes.forEach(vote => {
                    if (vote.value === 1 || vote.value === -1) {
                        unvoted = false
                    }
                })
                if (this.props.filter === 'Unvoted') {
                    return unvoted
                } else {
                    return !unvoted
                }
            })
        console.log('after submissions', submissions)
        return submissions
    }

    // increments single view post 
    incDec = async (num) => {

        let newPointer;
        let submissions = [...this.state.submissions]
        submissions = this.sort_submissions(submissions)
        submissions = this.filter_submissions(submissions)

        // edge cases for pointer
        if (this.state.pointer + num === submissions.length) {
            newPointer = 0
        } else if (this.state.pointer + num === -1) {
            newPointer = submissions.length - 1
        } else {
            newPointer = this.state.pointer + num
        }

        this.setState({
            ...this.state,
            popInLeft: 'pop-out-left',
            popInRight: 'pop-out-right'
        }, () => {
            setTimeout(() => {
                this.setState({
                    ...this.state,
                    pointer: newPointer,
                    popInLeft: 'pop-in-left',
                    popInRight: 'pop-in-right',
                })
            }, 600)
        })
    }

    // vote and check functions
    vote = async (vote) => {

        if (this.checkLoggedIn()) {
            let db = firebase.firestore()
            let myVote = this.findVote()
            let value = myVote && myVote.value === vote ? 0 : vote

            let submissions = [...this.state.submissions]
            submissions = this.sort_submissions(submissions)
            submissions = this.filter_submissions(submissions)

            const submission = submissions[this.state.pointer]
            console.log(submission, 'vote submission')
            if (myVote) {
                let updatedVote = {
                    ...myVote,
                    value: value,
                    date: new Date()
                }
                db.collection('postVotes').doc(myVote.vid).set(updatedVote)
                    .then(() => console.log('vote updated successfully'))
                    .catch(err => console.log('could not update vote', err))
            }
            else {
                vote = {
                    value: value,
                    date: new Date(),
                    pid: submission.pid,
                    receiverID: submission.uid,
                    voterID: this.props.uid,
                    postDate: submission.createdOn,
                    address: submission.address
                }
                db.collection('postVotes').add(vote)
                    .then(() => {
                        this.setState({
                            ...this.state,
                            vote: vote
                        })
                    })
                    .catch(err => { console.log('could not add vote', err) })

            }
        }
    }
    checkLoggedIn = () => {
        if (!this.props.uid) {
            this.setState({
                ...this.state,
                showErrMsg: true,
                errMsg: 'Login to Judge!'
            })
            return false
        }
        return true
    }
    infoSet = () => {
        if (this.props.needsInfo) {
            this.setState({
                ...this.state,
                showErrMsg: true,
                errMsg: 'Set Info to Judge!'
            })
            return false
        }
        return true
    }
    resetErrState = () => {
        this.setState({
            ...this.state,
            showErrMsg: false
        })
    }


    toggleModal = async (modal, value, pid) => {
        this.setState({
            ...this.state,
            [modal]: value,
            pid: pid
        })
    }



    render() {


        let content;
        let submissions = [...this.state.submissions]
        submissions = this.sort_submissions(submissions)
        submissions = this.filter_submissions(submissions)

        if (submissions.length === 0 || !submissions[this.state.pointer]) {
            if (this.props.filter === "Unvoted") {
                content = (<div className="filter-null-msg">You've voted on all posts!</div>)
            } else if (this.props.filter === "Voted") {
                content = (<div className="filter-null-msg">You haven't voted on any posts!</div>)
            } else {
                content = (<div className="filter-null-msg">Sorry. Having some issues fetching posts.</div>)
            }
        }
        else {


            let vote = this.findVote()
            const upvoteStyle = vote && vote.value === 1 ? 'lit-up' : null
            const downvoteStyle = vote && vote.value === -1 ? 'lit-trash' : null


            content = (
                <FourBars
                    showErrMsg={this.state.showErrMsg}
                    onAnimationEnd={this.resetErrState}
                    errMsg={this.state.errMsg}
                    popInLeft={this.state.popInLeft}
                    popInRight={this.state.popInRight}
                    submission={submissions[this.state.pointer]}
                    incDec={this.incDec}
                    vote={this.vote}
                    downvoteStyle={downvoteStyle}
                    upvoteStyle={upvoteStyle}
                />
            )

        }

        return (
            <div className='judge-content-container'>
                {this.state.showBars ? content : <div className="loader">Loading...</div>}
            </div>

        )
    }
}

const mapStateToProps = state => {
    return {
        uid: state.user.uid,
        needsInfo: state.user.needsInfo,}
}


export default connect(mapStateToProps, null)(SingleView)

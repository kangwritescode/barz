import React, { Component } from 'react'
import firebase from 'firebase'
import { connect } from 'react-redux'
import 'firebase/firestore'
import './ManyView.css'
import ManyPost from './ManyPost/ManyPost'
import earl from '../../../../assets/artistSpotlight/earl-spotlight.png'
import ViewedPost from '../../../../components/Scribble/MyBars/ViewedBar/ViewedPost'
import timeDict from '../../../Wordsmiths/WordSmithsTools/timeDict'
import ReactPlayer from 'react-player'
import Turntable from '../../../../components/Scribble/Turntable/Turntable'

class ManyView extends Component {

    state = {
        submissions: [],
        votes: {},
        comments: [],


    }

    componentDidMount = () => {
        this.fetchSubmissions()
        this.fetchVotes()
        this.fetchSubmissionComments()
    }


    fetchSubmissionComments = () => {
        const db = firebase.firestore()
        db.collection('postComments').onSnapshot((snapshot) => {
            var comments = []
            for (var comment of snapshot.docs) {
                var comment = {
                    ...comment.data(),
                    cid: comment.id
                }
                comments.push(comment)
            }
            this.setState({
                ...this.state,
                comments: comments
            })

        })
    }

    fetchSubmissions = () => {
        const db = firebase.firestore()
        db.collection('submissions').onSnapshot((snapshot) => {
            var submissions = []
            for (var submission of snapshot.docs) {
                var submission = {
                    ...submission.data(),
                    pid: submission.id
                }
                submissions.push(submission)
            }
            this.setState({
                ...this.state,
                submissions: submissions
            })

        })
    }

    fetchVotes = () => {
        var db = firebase.firestore()
        const votes = {}
        db.collection('postVotes').onSnapshot(querySnapshot => {
            querySnapshot.forEach((doc) => {
                var vote = { ...doc.data() }
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



    submissionLikes = (pid) => {
        var votes = Object.values(this.state.votes)
        var postVotes = votes.filter(vote => vote.pid === pid && vote.value === 1)
        console.log(postVotes)
        return postVotes.length
    }

    submissionComments = (pid) => {
        var comments = [...this.state.comments]
        var postComments = comments.filter(comment => comment.pid === pid)
        return postComments.length
    }

    sort_submissions = (submissions) => {
        var submissions = [...submissions]
        switch (this.props.sort) {
            case 'Newest':
                submissions = submissions.sort((a, b) => {
                    var first = a.createdOn.toDate()
                    var second = b.createdOn.toDate()
                    return first > second ? -1 : 1
                })
                break;
            case 'Oldest':
                submissions = submissions.sort((a, b) => {
                    var first = a.createdOn.toDate()
                    var second = b.createdOn.toDate()
                    return first < second ? -1 : 1
                })
                break;
            case 'Likes':
                submissions = submissions.sort((a, b) => {
                    var aVotes = this.submissionLikes(a.pid)
                    var bVotes = this.submissionLikes(b.pid)
                    return aVotes > bVotes ? -1 : 1
                })
                break;
            case 'Comments':
                submissions = submissions.sort((a, b) => {
                    var aComments = this.submissionComments(a.pid)
                    var bComments = this.submissionComments(b.pid)
                    return aComments > bComments ? -1 : 1
                })
                break;
            default:
                break;
        }
        return submissions
    }

    filter_submissions = (submissions) => {
        var submissions = [...submissions]

        // Voted / Unvoted filter
        if (this.props.filter !== 'All Posts') {
            var votes = this.state.votes
            votes = Object.values(votes)
            var myVotes = votes.filter(vote => vote.voterID === this.props.uid)
            submissions = submissions
                .filter(submission => {
                    var thisVotes = myVotes.filter(vote => vote.pid === submission.pid)
                    var unvoted = true
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
        }
        // Coast filter
        if (this.props.coast !== 'All Coasts') {
            switch (this.props.coast) {
                case 'West':
                    submissions = submissions.filter(submission => submission.address.region === 'West')
                    break;
                case 'East':
                    submissions = submissions.filter(submission => submission.address.region === 'East')
                    break;
                case 'South':
                    submissions = submissions.filter(submission => submission.address.region === 'South')
                    break;
                case 'Midwest':
                    submissions = submissions.filter(submission => submission.address.region === 'Midwest')
                    break;
                default:
                    break;
            }
        }
        // Time filter
        submissions = submissions.filter(submission => {
            var now = new Date()
            var passedMilliseconds = now - submission.createdOn.toDate().getTime()
            var passedDays = (passedMilliseconds / 1000 / 60 / 60 / 24)
            return passedDays < timeDict[this.props.time]
        })
        return submissions
    }



    render() {

        var submissions = [...this.state.submissions]
        submissions = this.sort_submissions(submissions)
        submissions = this.filter_submissions(submissions)
        var manyPosts = null
        if (submissions.length > 0) {
            var manyPosts = submissions.map((submission, index) => {

                return (
                    <ManyPost
                        key={submission.pid}
                        index={index}
                        toggleModal={this.props.toggleModal}
                        {...submission} />
                )
            })
        }


        return (
            <div className='many-view-layout'>
                <div className='many-view'>
                    <div className='many-view__posts'>
                        {manyPosts}
                    </div>
                    <div className='many-view__widgets'>
                        <div className='tv'>
                            <div className='tv__header'>
                                <div>BARZ.TV</div>
                            </div>
                            <ReactPlayer
                                controls
                                volume={.8}
                                url={'https://www.youtube.com/watch?v=vH6lAFxnYkM'}
                                playing={false}
                                width="100%"
                                height="12em" />
                        </div>
                        <div className='artist-spotlight' onClick={() => this.props.togglePro(true)}>
                            <div className='artist-spotlight__header'>
                                <div>PRO.SPOTLIGHT</div>
                            </div>
                            <div className='img-wrapper'>
                                <img alt='earl' src={earl}></img>
                            </div>
                            <div className='text'>
                                "It's the blackest <br />
                                piece of trash they  <br />
                                done seen in   <br />
                                a RV park..."
                            </div>
                        </div>
                        <div className='turntable-wrapper'>
                            <Turntable />
                        </div>

                    </div>
                </div>
            </div>

        )
    }
}

const mapStateToProps = state => {
    return {
        uid: state.uid
    }
}

export default connect(mapStateToProps, null)(ManyView)

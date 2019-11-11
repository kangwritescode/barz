import React, { Component } from 'react'
import firebase from 'firebase'
import { connect } from 'react-redux'
import 'firebase/firestore'
import './ManyView.css'
import ManyPost from './ManyPost/ManyPost'
import timeDict from '../../../Wordsmiths/WordSmithsTools/timeDict'
import Turntable from '../../../../components/Scribble/Turntable/Turntable'
import Commenter from './Commenter/Commenter'
import Community from './Community/Community'
import DeleteComment from '../../../../components/Scribble/MyBars/ViewedBar/DeleteComment/DeleteComment'


class ManyView extends Component {

    static defaultProps = {
        closesCommenter: [
            "many-view__posts",
            "many-view",
            "many-view__modules",
            "sticky-wrapper",
            "Community",
            'many-view-layout'
        ]

    }

    state = {
        submissions: [],
        votes: [],
        comments: [],
        postSelected: false,
        selectedPost: null,
        showDeleteComment: false,
        cid: null
    }

    componentDidMount = () => {
        this.fetchSubmissions()
        this.fetchVotes()
        this.fetchSubmissionComments()
        document.addEventListener('click', this.toggleCommenter)
    }
    componentWillUnmount = () => {
        document.removeEventListener('click', this.toggleCommenter)
    }




    toggleCommenter = (event) => {
        this.props.closesCommenter.forEach(className => {
            if (event.target.classList.contains(className)) {
                this.setState({
                    ...this.state,
                    postSelected: false
                })
            }
        });   
    }

    toggleDeleteCommentModal = (bool, cid) => {
        this.setState({
            ...this.state,
            showDeleteComment: bool,
            cid: cid
        })
    }


    fetchSubmissionComments = () => {
        const db = firebase.firestore()
        db.collection('postComments').onSnapshot((snapshot) => {
            var comments = []
            for (var comment of snapshot.docs) {
                comment = {
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
                submission = {
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

        db.collection('postVotes').onSnapshot(querySnapshot => {
            const votes = []
            querySnapshot.forEach((doc) => {
                var vote = {
                    ...doc.data(),
                    vid: doc.id
                }
                votes.push(vote)
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
        submissions = [...submissions]
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
        submissions = [...submissions]

        // Voted / Unvoted filter
        if (this.props.filter !== 'All Posts') {
            var votes = this.state.votes
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


    selectPost = (pid) => {
        var post = this.state.submissions.filter(submission => submission.pid === pid)
        post = post[0]
        this.setState({
            postSelected: true,
            selectedPost: post
        })
    }


    render() {

        console.log(this.state.votes)

        var submissions = [...this.state.submissions]
        submissions = this.sort_submissions(submissions)
        submissions = this.filter_submissions(submissions)
        var manyPosts = null
        if (submissions.length > 0) {
            manyPosts = submissions.map((submission, index) => {

                return (
                    <ManyPost
                        key={submission.pid}
                        comments={this.state.comments.filter(comment => comment.pid === submission.pid)}
                        index={index}
                        selectPost={this.selectPost}
                        votes={this.state.votes.filter(vote => vote.pid === submission.pid)}
                        {...submission} />
                )
            })
        }

        return (
            <div className='many-view-layout'>
                {this.state.showDeleteComment ? <DeleteComment cid={this.state.cid} toggleDeleteCommentModal={this.toggleDeleteCommentModal}/> : null}
                <div className='many-view'>
                    <div className='many-view__posts'>
                        {manyPosts}
                    </div>
                    <div className='many-view__modules'>
                        <div className='sticky-wrapper'>
                            <Commenter
                                customStyle={{body: {backgroundColor: 'rgba(255, 255, 255, 0.95)'}, header: {backgroundColor: 'rgba(255, 255, 255, 0.95)'}}}
                                selectedPost={this.state.selectedPost}
                                postSelected={this.state.postSelected}
                                comments={this.state.comments}
                                toggleDeleteCommentModal={this.toggleDeleteCommentModal} />
                            <Community submissions={this.state.submissions} />
                            <div className='turntable-wrapper'>
                                <Turntable />
                            </div>
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

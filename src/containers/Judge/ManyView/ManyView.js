import React, { Component } from 'react'
import firebase from 'firebase'
import { connect } from 'react-redux'
import 'firebase/firestore'
import './ManyView.css'
import ManyPost from './ManyPost/ManyPost'
import timeDict from '../../Wordsmiths/WordSmithsTools/timeDict'
import Turntable from '../../Scribble/Turntable/Turntable'
import Commenter from './Commenter/Commenter'
import Community from './Community/Community'
import DeleteComment from '../../Scribble/MyBars/ViewedBar/DeleteComment/DeleteComment'
import CircularSpinner from '../../../shared/CircularSpinner/CircularSpinner'


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
        cid: null,
        isDoneFetching: false

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


    setIsDoneFetching = (bool) => {
        this.setState({
            ...this.state,
            isDoneFetching: bool
        })
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
            let comments = []
            for (let comment of snapshot.docs) {
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
            let submissions = []
            for (let submission of snapshot.docs) {
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
        let db = firebase.firestore()

        db.collection('postVotes').onSnapshot(querySnapshot => {
            const votes = []
            querySnapshot.forEach((doc) => {
                let vote = {
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
        let votes = Object.values(this.state.votes)
        let postVotes = votes.filter(vote => vote.pid === pid && vote.value === 1)
        console.log(postVotes)
        return postVotes.length
    }

    submissionComments = (pid) => {
        let comments = [...this.state.comments]
        let postComments = comments.filter(comment => comment.pid === pid)
        return postComments.length
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
                break;
            case 'Oldest':
                submissions = submissions.sort((a, b) => {
                    let first = a.createdOn.toDate()
                    let second = b.createdOn.toDate()
                    return first < second ? -1 : 1
                })
                break;
            case 'Likes':
                submissions = submissions.sort((a, b) => {
                    let aVotes = this.submissionLikes(a.pid)
                    let bVotes = this.submissionLikes(b.pid)
                    return aVotes > bVotes ? -1 : 1
                })
                break;
            case 'Comments':
                submissions = submissions.sort((a, b) => {
                    let aComments = this.submissionComments(a.pid)
                    let bComments = this.submissionComments(b.pid)
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
            let votes = this.state.votes
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
            let now = new Date()
            let passedMilliseconds = now - submission.createdOn.toDate().getTime()
            let passedDays = (passedMilliseconds / 1000 / 60 / 60 / 24)
            return passedDays < timeDict[this.props.time]
        })
        return submissions
    }


    selectPost = (pid) => {
        let post = this.state.submissions.filter(submission => submission.pid === pid)
        post = post[0]
        this.setState({
            postSelected: true,
            selectedPost: post
        })
    }


    render() {

        console.log(this.state.votes)

        let submissions = [...this.state.submissions]
        submissions = this.sort_submissions(submissions)
        submissions = this.filter_submissions(submissions)
        let manyPosts = <CircularSpinner />
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

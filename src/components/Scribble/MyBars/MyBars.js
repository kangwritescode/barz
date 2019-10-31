import React, { Component } from 'react'
import firebase from '../../../Firebase'
import { connect } from 'react-redux'
import 'firebase/firestore'
import './MyBars.css'
import ViewedPost from './ViewedBar/ViewedPost'
import GenID from '../../../shared/GenID'


class MyBars extends Component {

    static monthString = {
        '1': 'January',
        '2': 'February',
        '3': 'March',
        '4': 'April',
        '5': 'May',
        '6': 'June',
        '7': 'July',
        '8': 'August',
        '9': 'September',
        '10': 'October',
        '11': 'November',
        '12': 'December'
    }

    state = {
        posts: [],
        showPost: false,
        viewedPost: null
    }

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.focused === 'Post' && this.props.focused === 'MyBars') {
            await this.fetchVotes(this.props.uid)
            this.fetchPosts(this.props.uid)
        } else if (prevState.showPost === true && this.state.showPost === false) {
            await this.fetchVotes(this.props.uid)
            this.fetchPosts(this.props.uid)
        }

    }


    fetchPosts = async (uid) => {
        var db = firebase.firestore()
        await db.collection('submissions').where("uid", "==", uid).orderBy('createdOn', 'desc').get()
            .then(querySnapshot => {
                var posts = []
                querySnapshot.forEach(doc => {
                    var post = {
                        ...doc.data(),
                        pid: doc.id
                    }
                    posts.push(post)
                })
                this.setState({
                    ...this.state,
                    posts: posts
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    fetchVotes = async (uid) => {
        var db = firebase.firestore()
        await db.collection('postVotes').where('receiverID', '==', uid).get()
            .then(querySnapshot => {
                var votes = {}
                querySnapshot.forEach(doc => {
                    var vote = doc.data()
                    votes[vote.pid] = votes[vote.pid] ? Math.max(votes[vote.pid] + vote.value< 0) : Math.max(vote.value, 0)
                })
                console.log(votes)
                this.setState({
                    ...this.state,
                    votes: votes
                })
                 
            })
    }

    getOrdinal = (i) => {
        var j = i % 10
        var k = i % 100
        if (j == 1 && k != 11) { return "st" }
        if (j == 2 && k != 12) { return "nd" }
        if (j == 3 && k != 13) { return "rd" }
        else { return "th" }
    }

    insertDateHeaders = (inputArr) => {
        // create a copy
        var arr = [...inputArr]
        var currYear = 0
        var currMonth = 0
        var i = 0
        while (i < arr.length) {
            var postYear = arr[i].createdOn.toDate().getUTCFullYear()
            var postMonth = arr[i].createdOn.toDate().getUTCMonth() + 1

            // if a new year is introduced, update
            if (postYear !== currYear) {
                currYear = postYear
            }
            // if a new month is introduced, or the same month but different year
            if (postMonth !== currMonth || postMonth == currMonth && currYear != postYear) {
                arr.splice(i, 0, [postMonth, currYear])
                currMonth = postMonth
                i += 1
            } else {
                i += 1
            }
        }
        // return copy with inserted variables
        return arr
    }

    toggleModal = (modal, value) => {
        this.setState({
            ...this.state,
            [modal]: value
        })
    }

    viewPost = async (pid) => {
        this.setState({
            ...this.state,
            showPost: true,
            viewedPost: pid
        })
    }


    render() {

        // UI
        let focused = this.props.focused === "MyBars"
        let myBarsId = focused ? 'mybars-expanded' : 'mybars-compressed'
        let widgetHeader = focused ? 'my-bars-header-compressed' : 'my-bars-header-expanded'
        let postsContainerId = focused ? 'posts-container-opaque' : 'posts-container-transparent'
        
        // insert the date headers into the array
        var posts = [...this.state.posts]
        if (this.state.posts) {
            posts = this.insertDateHeaders(this.state.posts)
        }

        return (
            <div className="my-bars" id={myBarsId}>
                <div className={`my-bars-widget-header`} id={widgetHeader} onClick={!focused ? this.props.toggle : null}>Manage</div>
                <div className="posts-container" id={postsContainerId}>
                    {posts.map((post) => {
                        if ((typeof post === 'array' || post instanceof Array)) {
                            return <div id='month-header' key={GenID()}>{MyBars.monthString[post[0]]} {post[1]}</div>
                        }
                        return (
                            <div className="a-post" onClick={() => this.viewPost(post.pid)} key={GenID()}>
                                <div id='likes-overlay'>
                                    <span><i className="fas fa-fire" id="my-bars-flame"></i></span>
                                    {this.state.votes[post.pid] > 0 ? this.state.votes[post.pid] : 0}
                                </div>
                                <p>{post.content.lineOne + "..."}</p>
                            </div>
                        )
                    })}
                </div>
                {this.state.showPost ? <ViewedPost toggleViewedPost={this.toggleModal} pid={this.state.viewedPost} toggleModal={this.toggleModal}/> : null }                
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        uid: state.uid
    }
}

export default connect(mapStateToProps, null)(MyBars)


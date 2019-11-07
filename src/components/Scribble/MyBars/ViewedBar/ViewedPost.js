import React, { Component } from 'react'
import { connect } from 'react-redux'
import firebase from '../../../../Firebase'
import 'firebase/firestore'
import './ViewedPost.css'
import TextareaAutosize from 'react-autosize-textarea'
import DeletePost from './DeletePost/DeletePost'
import PostLikes from './PostLikes/PostLikes'
import PostComments from './PostComments/PostComments'
import DeleteComment from './DeleteComment/DeleteComment'
import * as actionTypes from '../../../../store/actions'

class ViewedPost extends Component {


    state = {
        viewedPost: null,
        showDropdown: false,
        showDeleteModal: false,
        stagedCID: '',
        showDeleteCommentModal: false,
        viewerIMG: 'https://firebasestorage.googleapis.com/v0/b/barz-86ae0.appspot.com/o/mysteryman%2Fmysteryman.png?alt=media&token=7b1e5a7c-ede3-46ff-a036-70636e528cd2',
        commentInput: '',
        comments: []
    }


    componentDidMount = () => {
        document.addEventListener('click', this.toggleDropdownListener)
        this.fetchPost(this.props.pid)
        this.fetchComments(this.props.pid)
        this.fetchPhotoURL()
    }
    componentWillUnmount = () => {
        document.removeEventListener('click', this.toggleDropdownListener)
    }

    fetchPhotoURL = () => {
        if (this.props.photoRef) {
            var storage = firebase.storage();
            storage.ref(this.props.photoRef).getDownloadURL().then(url => {
                this.setState({
                    ...this.state,
                    viewerIMG: url
                })
            }).catch(function (error) {
                console.log("error in Profile.js: ", error)
            });
        }
    }

    fetchComments = (pid) => {
        var db = firebase.firestore()
        db.collection('postComments').where('pid', '==', this.props.pid).orderBy('date').onSnapshot(snapshot => {
            var comments = []
            snapshot.forEach(doc => {
                var comment = {
                    ...doc.data(),
                    cid: doc.id
                }
                comments.push(comment)
            })
            this.setState({
                comments: comments
            })
        }, err => {
            console.log(err)
        })
    }

    fetchPost = (pid) => {
        // document.getElementById
        var db = firebase.firestore()
        db.collection('submissions').doc(pid).get()
            .then(querySnapshot => {
                var post = {
                    ...querySnapshot.data(),
                    pid: pid
                }
                this.setState({
                    ...this.state,
                    viewedPost: post
                })
            })
            .catch(err => {
                console.log('[MyBars.js] func viewPost', err)
            })
    }

    toggleDropdownListener = (event) => {
        const postDropMenu = document.getElementById('post-drop-menu')
        if (event.target.classList.contains('three-dots') && !postDropMenu.classList.contains('post-drop-menu-show')
            || event.target.classList.contains('dot') && !postDropMenu.classList.contains('post-drop-menu-show')) {

            postDropMenu.classList.add('post-drop-menu-show')
        } else {
            postDropMenu.classList.remove('post-drop-menu-show')
        }
    }

    countVotes = (voteObj) => {
        var votes = 0
        for (let key in voteObj) {
            votes += voteObj[key] === 1 ? 1 : 0
        }
        return votes
    }
    toggleModal = (modal, value) => {
        console.log(modal, value)
        this.setState({
            ...this.state,
            [modal]: value
        })
    }


    toggleDeleteCommentModal = (bool, cid, wasDeleted) => {
        this.setState({
            ...this.state,
            showDeleteCommentModal: bool,
            stagedCID: cid
        })
    }


    onChangeHandler = event => {
        event.target.value = event.target.value.replace(/[\r\n\v]+/g, '')
        this.setState({
            ...this.state,
            commentInput: event.target.value
        })
    }

    generateComment = () => {

        return {
            comment: this.state.commentInput,
            uid: this.props.uid,
            username: this.props.username,
            pid: this.props.pid,
            photoRef: this.props.photoRef,
            receiverUID: this.state.viewedPost.uid,
            receiverUsername: this.state.viewedPost.username,
            date: new Date()
        }
    }

    postComment = async event => {
        var db = firebase.firestore()
        event.preventDefault()
        var comment = this.generateComment()
        await db.collection('postComments').add(comment)
            .then(res => console.log('commented successfully'))
            .catch(err => console.log(err))
        this.setState({
            ...this.state,
            commentInput: ''
        })

    }

    generateDate = () => {
        const date = this.state.viewedPost.createdOn.toDate()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const year = date.getFullYear() + ''
        return month + '.' + day + '.' + year.slice(2, 4)
    }

    render() {

        var editable = this.state.viewedPost && (this.props.uid === this.state.viewedPost.uid) ? true : false
        var deleteOption = !editable ? null : (
            <div className="post-drop-item" id="delete-post" onClick={() => this.toggleModal('showDeleteModal', true)}>Delete</div>
        )
        var post = (
            <div className="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        )
        if (this.state.viewedPost) {
            var bars = '"' + this.state.viewedPost.content.lineOne + ' / '
                + this.state.viewedPost.content.lineTwo + ' / '
                + this.state.viewedPost.content.lineThree + ' / '
                + this.state.viewedPost.content.lineFour + '"'
            post = (
                <div id='four-date-likes-comments-wrapper'>
                    <div className='cell-one'>
                        <div id="four-bars">
                            <p>
                                {bars} <br />
                                <div className='bars-footer'>
                                    <span className='username'>{this.state.viewedPost.username}</span>
                                    <br />
                                    <span className='date-posted'>{this.generateDate()}</span>
                                </div>
                            </p>
                        </div>
                    </div>
                    <div className='cell-two'>
                        <div className='dots-block'>
                            <div className='three-dots' id='three-dots'>
                                <div className="post-drop-menu" id="post-drop-menu">
                                    {deleteOption}
                                    <div className="post-drop-item" id="close-post" onClick={() => this.props.toggleModal('showPost', false)}>Close Window</div>
                                </div>
                                <div className='dot'></div>
                                <div className='dot'></div>
                                <div className='dot'></div>
                            </div>
                        </div>
                        <div className='cell-two-content-wrapper'>

                            <div className='likes-comments-wrapper'>

                                <PostComments toggleModal={this.toggleDeleteCommentModal} comments={this.state.comments} viewedPost={this.state.viewedPost} />
                                <PostLikes viewedPost={this.state.viewedPost} />
                                <form className='post-comment'>
                                    <div className='img-wrapper'><img alt='alt' src={this.state.viewerIMG} className='comment-user-img'></img></div>
                                    <TextareaAutosize
                                        onChange={this.onChangeHandler}
                                        value={this.state.commentInput}
                                        placeholder='Thoughts...'
                                        maxLength='200'
                                        className='comment-input'
                                        spellCheck="false">
                                    </TextareaAutosize>
                                    <button onClick={event => this.postComment(event)}>Post</button>
                                </form>
                            </div>
                        </div>

                    </div>


                </div>
            )
        }
        return (
            <div id='viewed-post-wrapper'>
                <div id='viewed-post-backdrop' onClick={() => this.props.toggleModal('showPost', false)}></div>
                {this.state.showDeleteModal ? <DeletePost toggleViewedPost={this.props.toggleViewedPost} pid={this.state.viewedPost.pid} toggleModal={this.props.toggleModal} /> : null}
                {this.state.showDeleteCommentModal ? <DeleteComment cid={this.state.stagedCID} toggleModal={this.toggleDeleteCommentModal} /> : null}
                {post}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        uid: state.uid,
        username: state.username,
        photoURL: state.photoURL
    }
}

export default connect(mapStateToProps, null)(ViewedPost)

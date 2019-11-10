import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import './Hub.css'
import firebase from 'firebase'
import FireApi from '../../FireApi/FireApi'
import yox from '../../assets/yox.m4v'
import ProfileBox from './ProfileBox/ProfileBox'
import UploadImage from './Profile/UploadImage/UploadImage'
import AddHandles from './Profile/AddHandles/AddHandles'
import FollowBox from './FollowBox/FollowBox'
import Turntable from '../../components/Scribble/Turntable/Turntable'
import Commenter from '../Judge/JudgeBarz/ManyView/Commenter/Commenter'
import HubNavBar from './HubNavBar/HubNavBar'
import ManyPost from '../Judge/JudgeBarz/ManyView/ManyPost/ManyPost'
import GenID from '../../shared/GenID'
import DeleteComment from '../../components/Scribble/MyBars/ViewedBar/DeleteComment/DeleteComment'
import HubTools from './HubTools/HubTools'
import DeleteAccount from './Profile/DeleteAccount/DeleteAccount'


const Hub = (props) => {


    // show modals
    const [showPhotoModal, setShowPhotoModal] = useState(false)
    const [showUploadHandles, toggleUploadHandles] = useState(false)
    const [showDeleteComment, setShowDeleteComment] = useState(false)
    const [showDeleteAcc, toggleDeleteAcc] = useState(false)
    const [commentCID, setCommentCID] = useState(null);
    // photo related
    const [imgURL, setImgURL] = useState('')
    // votes/score related
    const [votes, setVotes] = useState([])
    const [myPlace, setMyPlace] = useState(null)
    const [myScore, setMyScore] = useState(0)
    // follows
    const [follows, setFollows] = useState([])
    // posts
    var [posts, setPosts] = useState([])
    const [postSelected, setPostSelected] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null)
    // comments
    const [comments, setComments] = useState([])
    // feed related
    var [feed, setFeed] = useState('Personal')


    // componentDidMount
    useEffect(() => {

        // unchanging variables
        const closesCommenter = [
            'columns-container',
            'left-column',
            'middle-column',
            'right-column',
            'yox'
        ]

        const toggleCommenter = (event) => {
            closesCommenter.forEach(className => {
                if (event.target.classList.contains(className)) {
                    setPostSelected(false)
                }
            })
        }
        const fetchVotesListener = FireApi.allVotesListener(setVotes)
        const fetchFollowsListener = FireApi.allFollowsListener(setFollows)
        const fetchPostsListener = FireApi.allPostsListener(setPosts)
        const fetchCommentsListener = FireApi.allSubmissionCommentsListener(setComments)
        document.addEventListener('click', toggleCommenter)
        return () => {
            fetchVotesListener()
            fetchFollowsListener()
            fetchPostsListener()
            fetchCommentsListener()
            document.removeEventListener('click', toggleCommenter)
        }
    }, [])

    useEffect(() => {
        // helper function

        if (votes.length !== 0) {
            setMyPlace(HubTools.myPlaceFinder(votes, props.uid))
            var likes = votes.filter(vote => vote.receiverID === props.uid && vote.value === 1)
            var dislikes = votes.filter(vote => vote.receiverID === props.uid && vote.value === -1)
            var score = (Math.max(likes.length - dislikes.length, 0))
            setMyScore(score)
        }
        return () => {
        };
    }, [props.uid, votes])


    const selectPost = (pid) => {
        var post = posts.filter(submission => submission.pid === pid)
        post = post[0]
        setPostSelected(true)
        setSelectedPost(post)
    }

    const sortAndFilter = (type, parameter) => {
        setFeed(parameter)
    }
    const sortByNewest = (posts) => {
        return posts.sort((a, b) => {
            if (a.createdOn > b.createdOn) {
                return -1
            } return 1
        })
    }
    const toggleDeleteCommentModal = (bool, cid) => {
        setCommentCID(cid)
        setShowDeleteComment(bool)
    }


    // render ~~~~~~~~~~~~

    // Custom Styles 
    var manyPostsCustomStyle = {
        username: {
            fontSize: '1em'
        },
        paragraph: {
            width: '16em',
            fontSize: '1.4em'
        },
        body: {
            backgroundColor: 'rgba(0, 0, 0, 0.81)'
        }
    }
    var commenterCustomStyle = {
        wrapper: {
            width: '16.5em',
        },
        selectAPost: {
            fontSize: '1em',
            top: '2.5em'
        },
        body: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
        },
        header: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)'
        }
    }

    // Post Sorting and Filtering

    var manyPosts;
    if (feed === 'Personal') {
        posts = posts.filter(post => props.uid === post.uid)
        posts = sortByNewest(posts)
        manyPosts = posts.map(post => {
            return (
                <ManyPost
                    comments={comments.filter(comment => comment.pid === post.pid)}
                    key={GenID()}
                    customStyle={manyPostsCustomStyle}
                    selectPost={selectPost}
                    votes={votes.filter(vote => vote.pid === post.pid)}
                    {...post}
                />
            )
        })
    }
    if (feed === 'Following') {
        var myFollows = follows.filter(follow => follow.from === props.uid)
        var followingUIDs = new Set()
        myFollows.forEach(follow => { followingUIDs.add(follow.to) })
        posts = posts.filter(post => followingUIDs.has(post.uid))
        posts = sortByNewest(posts)
        manyPosts = posts.map(post => {
            return (
                <ManyPost
                    comments={comments.filter(comment => comment.pid === post.pid)}
                    key={GenID()}
                    customStyle={manyPostsCustomStyle}
                    selectPost={selectPost}
                    votes={votes.filter(vote => vote.pid === post.pid)}
                    {...post}
                />
            )
        })
    }



    return (
        <div className="hub-layout">
            <HubNavBar sortAndFilter={sortAndFilter} feed={feed} />

            {/* modal and ui */}
            {showPhotoModal ? <UploadImage setShowPhotoModal={setShowPhotoModal} setImgURL={setImgURL} /> : null}
            {showUploadHandles ? <AddHandles toggleUploadHandles={toggleUploadHandles} /> : null}
            {showDeleteComment ? <DeleteComment cid={commentCID} toggleDeleteCommentModal={toggleDeleteCommentModal} /> : null}
            {showDeleteAcc ? <DeleteAccount toggleDeleteAcc={toggleDeleteAcc} /> : null}

            <img id="backup-img" src={imgURL} alt="" />
            <video className='yox' id="yox" src={yox} autoPlay={true} loop={true} playsInline={true} muted />
            <div id="yoxOverlay" />
            <div id="mv-cred">YEAR OF THE OX - MOOD CONTROL CYPHER</div>

            {/* main content */}
            <div className={`hub-layout__body-wrapper`}>
                <div className='columns-container'>
                    <div className='left-column'>
                        <div className='left-column__profile-box-container'>
                            <ProfileBox
                                setShowPhotoModal={setShowPhotoModal}
                                toggleUploadHandles={toggleUploadHandles}
                                toggleDeleteAcc={toggleDeleteAcc}
                                wrappedBy='Hub'
                                myPlace={myPlace}
                                myPoints={Math.max(myScore, 0)} />
                        </div>
                        <FollowBox follows={follows} />
                        <div className={`left-column__turntable-wrapper`}>
                            {/* <Turntable customStyle={turntableStyle} /> */}
                        </div>
                    </div>
                    <div className='middle-column'>
                        {manyPosts}
                    </div>
                    <div className='right-column'>
                        <Commenter
                            toggleDeleteCommentModal={toggleDeleteCommentModal}
                            customStyle={commenterCustomStyle}
                            selectedPost={selectedPost}
                            postSelected={postSelected}
                            comments={comments} />
                        <div className={`turntable-wrapper`}>
                            <Turntable />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

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


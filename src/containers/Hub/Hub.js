import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import './Hub.css'
import firebase from 'firebase'
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


const Hub = (props) => {



    // show modals
    const [showPhotoModal, setShowPhotoModal] = useState(false)
    const [showUploadHandles, toggleUploadHandles] = useState(false)
    const [showDeleteComment, setShowDeleteComment] = useState(false)
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

        const fetchVotesListener = fetchVotes()
        const fetchFollowsListener = fetchFollows()
        const fetchPostsListener = fetchPosts()
        const fetchCommentsListener = fetchSubmissionComments()
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
        if (votes.length !== 0) {
            setMyPlace(myPlaceFinder())
        }
        return () => {
        };
    }, [props.uid, votes])






    const fetchPosts = () => {
        var db = firebase.firestore()
        const fetchedPosts = []
        const listener = db.collection('submissions').onSnapshot(snapshot => {
            snapshot.forEach(doc => {
                fetchedPosts.push({
                    ...doc.data(),
                    pid: doc.id
                })
            })
            setPosts(fetchedPosts)
        })
        return listener
    }
    const fetchVotes = () => {
        var db = firebase.firestore()

        const listener = db.collection('postVotes').onSnapshot(snapshot => {
            console.log('votes listener detected a change')
            var fetchedVote;
            var fetchedVotes = []
            snapshot.forEach(vote => {
                fetchedVote = {
                    ...vote.data(),
                    vid: vote.id
                }
                fetchedVotes.push(fetchedVote)
            })
            setVotes(fetchedVotes)
        })
        return listener
    }
    const fetchFollows = () => {
        const db = firebase.firestore()
        const listener = db.collection('follows').onSnapshot(snapshot => {
            var fetchedFollows = []
            snapshot.forEach(doc => {
                fetchedFollows.push(doc.data())
            })
            setFollows(fetchedFollows)
        }, err => console.log(err))
        return listener
    }

    const fetchSubmissionComments = () => {
        const db = firebase.firestore()
        const listener = db.collection('postComments').onSnapshot((snapshot) => {
            var comments = []
            for (var comment of snapshot.docs) {
                comment = {
                    ...comment.data(),
                    cid: comment.id
                }
                comments.push(comment)
            }
            setComments(comments)
        })
        return listener
    }





    const selectPost = (pid) => {
        var post = posts.filter(submission => submission.pid === pid)
        post = post[0]
        setPostSelected(true)
        setSelectedPost(post)
    }

    const sortAndFilter = (type, parameter) => {
        // set appropriate UI
        setFeed(parameter)
    }
    const sortByNewest = (posts) => {
        return posts.sort((a, b) => {
            if (a.createdOn > b.createdOn) {
                return -1
            } return 1
        })
    }
    const filterMine = (posts) => {
        return posts.filter(post => props.uid === post.uid)
    }

    const toggleDeleteCommentModal = (bool, cid) => {
        setCommentCID(cid)
        setShowDeleteComment(bool)
    }


    // render ~~~



    const turntableStyle = {
        vinyl: {
            height: '7em',
            width: '7em',
        },
        glare: {
            height: '6.4em'
        },
        slider: {
            left: '-2.4em'
        }
    }

    // many post stuff
    var manyPosts;
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
    console.log(comments)
    if (feed === 'Personal') {
        posts = filterMine(posts)
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
    // commenter stuff
    var commenterCustomStyle = {
        wrapper: {
            width: '16em',
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


    return (
        <div className="hub-layout">
            <HubNavBar sortAndFilter={sortAndFilter} feed={feed} />

            {/* modal and ui */}
            {showPhotoModal ? <UploadImage setShowPhotoModal={setShowPhotoModal} setImgURL={setImgURL} /> : null}
            {showUploadHandles ? <AddHandles toggleUploadHandles={toggleUploadHandles} /> : null}
            {showDeleteComment ? <DeleteComment cid={commentCID} toggleDeleteCommentModal={toggleDeleteCommentModal}/> : null}
            <img id="backup-img" src={imgURL} alt="" />
            <video className='yox' id="yox" src={yox} autoPlay={true} loop={true} playsInline={true} muted />
            <div id="yoxOverlay" />
            <div id="mv-cred">YEAR OF THE OX - MOOD CONTROL CYPHER</div>

            {/* main content */}
            <div className='columns-container'>
                <div className='left-column'>
                    <div className='left-column__profile-box-container'>
                        <ProfileBox
                            setShowPhotoModal={setShowPhotoModal}
                            toggleUploadHandles={toggleUploadHandles}
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


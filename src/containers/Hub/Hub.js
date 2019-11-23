import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import FireApi from '../../Api/FireApi/FireApi'
import yoxIMG from '../../assets/images/yoxIMG.png'
import yox from '../../assets/videos/yox.m4v'
import CircularSpinner from '../../components/CircularSpinner/CircularSpinner'
import { GenID } from '../../shared/utility'
import Commenter from '../Judge/ManyView/Commenter/Commenter'
import ManyPost from '../Judge/ManyView/ManyPost/ManyPost'
import DeleteComment from '../Scribble/MyBars/ViewedBar/DeleteComment/DeleteComment'
import Turntable from '../Scribble/Turntable/Turntable'
import AddHandles from './AddHandles/AddHandles'
import DeleteAccount from './DeleteAccount/DeleteAccount'
import FollowBox from './FollowBox/FollowBox'
import './Hub.css'
import HubNavBar from './HubNavBar/HubNavBar'
import HubTools from './HubTools/HubTools'
import ProfileBox from './ProfileBox/ProfileBox'
import UploadImage from './ProfileBox/UploadImage/UploadImage'
import InfoGetter from './InfoGetter/InfoGetter'
import * as actions from '../../store/actions/ui'


const Hub = (props) => {
    // routing 
    const [keyPressed, setKeyPressed] = useState(null)
    // loader
    const [doneFetching, setDoneFetching] = useState(false)
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
    const [myPlace, setMyPlace] = useState(0)
    const [myScore, setMyScore] = useState(0)
    // follows
    const [follows, setFollows] = useState([])
    // posts
    const [posts, setPosts] = useState([])
    const [postState, setPostState] = useState({
        postSelected: false,
        selectedPost: null,
        focusedElement: null
    })
    // comments
    const [comments, setComments] = useState([])
    // feed related
    let [feed, setFeed] = useState(props.hubUI.feed)


    // componentDidMount
    useEffect(() => {

        // unchanging letiables
        const closesCommenter = [
            'columns-container',
            'left-column',
            'middle-column',
            'right-column',
            'yox',
            'hub-layout__body-wrapper'
        ]

        const toggleCommenter = (event) => {
            closesCommenter.forEach(className => {
                if (event.target.classList.contains(className)) {
                    setPostState({
                        ...postState,
                        postSelected: false,
                        focusedElement: null,
                    })
                }
            })
        }
        const fetchVotesListener = FireApi.allVotesListener(setVotes)
        const fetchFollowsListener = FireApi.allFollowsListener(setFollows)
        const fetchPostsListener = FireApi.allPostsListener(setPosts, setDoneFetching)
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

    // routes
    useEffect(() => {
        const assignRedirect = (event) => {
            switch (event.key) {
                case '2': return setKeyPressed(2)
                case '3': return setKeyPressed(3)
                case '4': return setKeyPressed(4)
                default: break;
            }
        }
        document.addEventListener('keydown', assignRedirect)
        return () => {
            document.removeEventListener('keydown', assignRedirect)
        };
    }, [])

    useEffect(() => {
        if (votes.length !== 0) {
            setMyPlace(HubTools.myPlaceFinder(votes, props.uid))
            let likes = votes.filter(vote => vote.receiverID === props.uid && vote.value === 1)
            let dislikes = votes.filter(vote => vote.receiverID === props.uid && vote.value === -1)
            let score = (Math.max(likes.length - dislikes.length, 0))
            setMyScore(score)
        }
        if (props.hubUI) {
            setFeed(props.hubUI.feed)
        }
        return () => {
        };
    }, [props.uid, votes, props.hubUI])

    useEffect(() => {

        setPostState({
            postSelected: false,
            selectedPost: null,
            focusedElement: null
        })
        document.getElementById('hub-layout__body-wrapper').scrollTop = 0;
        return () => {
        };
    }, [feed])
    const selectPost = (pid) => {
        let post = posts.filter(submission => submission.pid === pid)
        post = post[0]

        // focus selected element
        var myElement = document.querySelector(`#scrollTo${pid}`);

        scrollToPost(myElement)
        // scroll to selected element
        setPostState({
            ...postState,
            focusedElement: myElement,
            selectedPost: post,
            postSelected: true
        })


    }

    const sortAndFilter = (type, parameter) => {
        props.setHubUI({feed: parameter})
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
    const scrollToPost = (element) => {
        var topPos = element.offsetTop;
        document.getElementById('hub-layout__body-wrapper').scrollTop = topPos - 45;

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
        whole: {
            backgroundColor: 'rgba(0, 0, 0, 0.81)'
        }
    }
    var withSelectedPostStyle = {
        ...manyPostsCustomStyle,
        whole: {
            ...manyPostsCustomStyle.whole,
            border: '1px solid grey'
        }
    }
    const commenterCustomStyle = {
        wrapper: {
            width: '16.5em',
        },
        selectAPost: {
            fontSize: '1em',
            top: '2.5em'
        },
        body: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
        },
        header: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)'
        }
    }

    // Post Sorting and Filtering
    var displayedPosts;
    let manyPosts;
    if (feed === 'Personal') {
        displayedPosts = posts.filter(post => props.uid === post.uid)
        displayedPosts = sortByNewest(displayedPosts)
        if (!doneFetching) {
            manyPosts = <CircularSpinner />
        }
        else if ((displayedPosts === undefined) || (displayedPosts.length === 0)) {
            manyPosts = <div className={`middle-column__notification`}>
                <div className={``}>You haven't posted any barz yet!</div>
            </div>
        } else {
            manyPosts = displayedPosts.map(post => {
                console.log(post)
                var style = manyPostsCustomStyle
                if (postState.selectedPost && post.pid === postState.selectedPost.pid) {
                    style = withSelectedPostStyle
                }
                return (
                    <ManyPost
                        comments={comments.filter(comment => comment.pid === post.pid)}
                        key={GenID()}
                        customStyle={style}
                        selectPost={selectPost}
                        votes={votes.filter(vote => vote.pid === post.pid)}
                        {...post}
                    />
                )
            })
        }

    }
    if (feed === 'Following') {
        let myFollows = follows.filter(follow => follow.from === props.uid)
        let followingUIDs = new Set()
        myFollows.forEach(follow => { followingUIDs.add(follow.to) })
        displayedPosts = posts.filter(post => followingUIDs.has(post.uid))
        displayedPosts = sortByNewest(displayedPosts)
        if (!doneFetching) {
            manyPosts = <CircularSpinner />
        }
        else if ((displayedPosts === undefined) || (displayedPosts.length === 0)) {
            manyPosts = <div className={`middle-column__notification`}>
                <div className={``}>No posts to show!</div>
            </div>
        } else {
            manyPosts = displayedPosts.map(post => {
                var style = manyPostsCustomStyle
                if (postState.selectedPost && post.pid === postState.selectedPost.pid) {
                    style = withSelectedPostStyle
                }
                return (
                    <ManyPost
                        comments={comments.filter(comment => comment.pid === post.pid)}
                        key={GenID()}
                        customStyle={style}
                        selectPost={selectPost}
                        votes={votes.filter(vote => vote.pid === post.pid)}
                        {...post}
                    />
                )
            })
        }

    }
    var middleColumn = (
        <div className='middle-column'>
            {manyPosts}
        </div>
    )
    if (props.needsInfo) {
        middleColumn = (
            <InfoGetter />
        )
    }
    var content = (
        <div className="hub-layout">
            <HubNavBar sortAndFilter={sortAndFilter} feed={feed} />

            {/* modal and ui */}
            {showPhotoModal ? <UploadImage setShowPhotoModal={setShowPhotoModal} setImgURL={setImgURL} /> : null}
            {showUploadHandles ? <AddHandles toggleUploadHandles={toggleUploadHandles} /> : null}
            {showDeleteComment ? <DeleteComment cid={commentCID} toggleDeleteCommentModal={toggleDeleteCommentModal} /> : null}
            {showDeleteAcc ? <DeleteAccount toggleDeleteAcc={toggleDeleteAcc} /> : null}

            <img id="backup-img" src={yoxIMG} alt="" />
            <video className='yox' id="yox" src={yox} autoPlay={true} loop={true} playsInline={true} muted />
            <div id="yoxOverlay" />
            <div id="mv-cred">Year of the Ox - "Mood Control Cypher"</div>

            {/* main content */}
            <div className={`hub-layout__body-wrapper`} id='hub-layout__body-wrapper'>
                <div className='columns-container'>
                    <div className='left-column'>
                        <div className='left-column__profile-box-container'>
                            <ProfileBox
                                setShowPhotoModal={setShowPhotoModal}
                                toggleUploadHandles={toggleUploadHandles}
                                toggleDeleteAcc={toggleDeleteAcc}
                                wrappedBy='Hub'
                                myPlace={myPlace}
                                myPoints={Math.max(myScore, 0)}
                                isLoading={!doneFetching} />
                        </div>
                        <FollowBox follows={follows} />
                    </div>
                    {middleColumn}
                    <div className='right-column'>
                        <Commenter
                            toggleDeleteCommentModal={toggleDeleteCommentModal}
                            customStyle={commenterCustomStyle}
                            selectedPost={postState.selectedPost}
                            postSelected={postState.postSelected}
                            comments={comments} />
                        <div className={`turntable-wrapper`}>
                            <Turntable />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )


    // switch (keyPressed) {
    //     case 2: return content = <Redirect to='/scribble'></Redirect>
    //     case 3: return content = <Redirect to='/judge'></Redirect>
    //     case 4: return content = <Redirect to='/wordsmiths'></Redirect>
    //     default: break;

    // }
    console.log(props.hubUI)
    return content

}

const mapStateToProps = state => {
    return {
        loggedIn: state.user.loggedIn,
        email: state.user.email,
        username: state.user.username,
        sex: state.user.sex,
        photoURL: state.user.photoURL,
        uid: state.user.uid,
        needsInfo: state.user.needsInfo,
        hubUI: state.ui.hub
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setHubUI: (newState) => dispatch(actions.updateHubUI(newState))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Hub)


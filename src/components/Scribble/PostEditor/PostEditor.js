import React, { useState, useEffect } from 'react'
import './PostEditor.css'
import { connect } from 'react-redux'
import FireApi from '../../../FireApi/FireApi'
import ManyPost from '../../../containers/Judge/JudgeBarz/ManyView/ManyPost/ManyPost'
import Commenter from '../../../containers/Judge/JudgeBarz/ManyView/Commenter/Commenter'
import DeleteComment from '../MyBars/ViewedBar/DeleteComment/DeleteComment'

const PostEditor = (props) => {

    const [comments, setComments] = useState([])
    const [votes, setVotes] = useState([])
    const [post, setPost] = useState(null)
    const [cid, setCid] = useState(null)

    useEffect(() => {

        FireApi.fetchSinglePost(setPost, props.pid)
        const commentsListener = FireApi.allSubmissionCommentsListener(setComments, props.pid)
        const votesListener = FireApi.allVotesListener(setVotes, props.pid)

        return () => {
            commentsListener()
            votesListener()
        };
    }, [props.pid])

    var content = null
    if (post) {
        content = (
            <div className={`editor-layout`}>
                {cid ?
                    <DeleteComment
                        cid={cid}
                        toggleDeleteCommentModal={() => setCid(false)}
                    />
                    : null}
                <div className='editor-backdrop' onClick={() => props.toggleEditor(null)} />
                <div className={`editor-layout__content-container`}>
                    <ManyPost
                        comments={comments.filter(post => post.pid === props.pid)}
                        selectPost={() => null}
                        votes={votes.filter(vote => vote.pid === props.pid)}
                        {...post} />
                    <div className={`content-container-edit-container`}>
                        <Commenter
                            toggleDeleteCommentModal={(bool, cid) => setCid(cid)}
                            customStyle={{body: {height: '16em', backgroundColor: 'rgba(255, 255, 255, 0.95)'}, header: {backgroundColor: 'rgba(255, 255, 255, 0.95)'}}}
                            selectedPost={post}
                            postSelected={post}
                            comments={comments} />
                    </div>
                </div>
            </div>

        )
    }
    return content
}

const mapStateToProps = state => {
    return {

    }
}

const mapDispatchToProps = dispatch => {
    return {

    }
}


export default connect(mapStateToProps, mapDispatchToProps)(PostEditor)
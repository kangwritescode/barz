import React, { useState, useEffect } from 'react'
import './PostEditor.css'
import { connect } from 'react-redux'
import FireApi from '../../../Api/FireApi/FireApi'
import ManyPost from '../../Judge/ManyView/ManyPost/ManyPost'
import Commenter from '../../Judge/ManyView/Commenter/Commenter'
import DeleteComment from '../MyBars/ViewedBar/DeleteComment/DeleteComment'
import DeletePost from '../MyBars/ViewedBar/DeletePost/DeletePost'
import CircularSpinner from '../../../shared/CircularSpinner/CircularSpinner'

const PostEditor = (props) => {

    const [comments, setComments] = useState([])
    const [votes, setVotes] = useState([])
    const [post, setPost] = useState(null)
    const [cid, setCid] = useState(null)
    const [pidForDelete, setPidForDelete] = useState(null)

    useEffect(() => {

        FireApi.fetchSinglePost(setPost, props.pid)
        const commentsListener = FireApi.allSubmissionCommentsListener(setComments)
        const votesListener = FireApi.allVotesListener(setVotes, props.pid)

        return () => {
            commentsListener()
            votesListener()
        };
    }, [props.pid])

    var content = <CircularSpinner customStyle={{ zIndex: '110' }} />
    if (post) {
        content = (
            <div className={`editor-layout__content-container`}>
                <ManyPost
                    comments={comments.filter(post => post.pid === props.pid)}
                    selectPost={() => null}
                    votes={votes.filter(vote => vote.pid === props.pid)}
                    customStyle={{ paragraph: { width: '17em' } }}
                    {...post} />
                <div className={`content-container__edit-comment-container`}>
                    <div
                        className={`edit-comment-container__edit`}
                        onClick={props.pid ? () => setPidForDelete(props.pid) : null}>
                        <div className={`edit__header`}>
                            <div>Options</div>
                        </div>
                    </div>
                    <Commenter
                        toggleDeleteCommentModal={(bool, cid) => setCid(cid)}
                        customStyle={{
                            body: {
                                height: '17.5em',
                                backgroundColor: 'rgba(255, 255, 255, 0.95)'
                            },
                            header: {
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            }
                        }}
                        selectedPost={post}
                        postSelected={post}
                        comments={comments} />
                </div>
            </div>

        )
    }
    return (
        <div className={`editor-layout`}>
            {cid ?
                <DeleteComment
                    cid={cid}
                    toggleDeleteCommentModal={() => setCid(false)}
                />
                : null}
            {pidForDelete ?
                <DeletePost
                    pid={pidForDelete}
                    toggle={setPidForDelete}
                    toggleEditor={props.toggleEditor}
                />
                : null}

            <div className='editor-backdrop' onClick={() => props.toggleEditor(null)} />
            {content}
        </div>
    )
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

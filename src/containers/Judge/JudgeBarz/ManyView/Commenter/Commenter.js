import React from 'react'
import david from '../../../../../assets/davidFace.png'
import './Commenter.css'
import TextareaAutosize from 'react-autosize-textarea/lib'

const Commenter = (props) => {
    return (
        <div className='Commenter'>
            <div className='header'></div>
            <h2 className='select-a-post'>Select a Post!</h2>
            <form className='post-comment'>
                <div className='img-wrapper'><img alt='alt' src={david} className='comment-user-img'></img></div>
                <TextareaAutosize
                    placeholder='Thoughts...'
                    disabled
                    maxLength='200'
                    className='comment-input'
                    spellCheck="false">
                </TextareaAutosize>
                <button disabled onClick={event => event.preventDefault()}>Post</button>
            </form>
        </div>
    )
}

export default Commenter
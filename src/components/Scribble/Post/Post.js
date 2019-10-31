import React, { Component } from 'react'
import { connect } from 'react-redux'
import firebase from '../../../Firebase'
import './Post.css'
import GenID from '../../../shared/GenID'

class Post extends Component {

    state = {
        submission: {
            lineOne: '',
            lineTwo: '',
            lineThree: '',
            lineFour: '',
        },
        inputData: {
            one: { id: 'lineOne' },
            two: { id: 'lineTwo' },
            three: { id: 'lineThree' },
            four: { id: 'lineFour' }
        },
        inputUniversalProps: {
            maxLength: '70',
            spellCheck: 'false',
            autoCorrect: 'false',
        },
        spinner: false,
        notificationMessage: 'default notification message',
        showNotification: false,
        notificationStatus: true
    }

    resetBars = () => {
        this.setState({
            ...this.state,
            inputData: {
                ...this.state.inputData
            },
            inputUniversalProps: {
                ...this.state.inputUniversalProps
            },
            submission: {
                lineOne: '',
                lineTwo: '',
                lineThree: '',
                lineFour: ''
            }
        })
    }

    toggleSpinner = bool => {
        this.setState({
            ...this.state,
            spinner: bool
        });
    };

    onChangeHandler = (line, event) => {
        console.log('[Post.js] onChangeHandler')
        this.setState({
            ...this.state,
            submission: {
                ...this.state.submission,
                [line]: event.target.value.toLowerCase()
            }
        })
    }

    arrowKeyHandler = (event) => {
        if (event.key === "Enter") {
            event.preventDefault()
        }
        if (event.key === "Enter" && event.target.id !== 'lineFour' || event.key === "ArrowDown" && event.target.id !== 'lineFour') {
            return event.target.nextElementSibling.focus();
        }
        if (event.key == "ArrowUp" && event.target.id !== 'lineOne') {
            return event.target.previousElementSibling.focus();
        }
    };

    createErr = (msg, code) => {
        return Object.assign(new Error(msg), { code: code })
    }

    toggleNotification = (msg, show, status) => {
        this.setState({
            ...this.state,
            notificationMessage: msg,
            showNotification: show,
            notificationStatus: status

        })
    }

    checkPostsLeft = async () => {

        //firestore stuff
        var db = firebase.firestore()
        return db.collection("submissions").where('uid', '==', this.props.uid).get()
            .then((querySnapshot) => {
                var postsToday = 0
                querySnapshot.forEach((doc) => {
                    var post = doc.data()
                    var submissionDate = post.createdOn.toDate().toDateString()
                    if (submissionDate === new Date().toDateString()) {
                        postsToday += 1
                    }
                });
                if (postsToday >= 3) {
                    throw this.createErr("Daily Posting Limit Reached! (3)", 402)
                } else {
                    return postsToday
                }
            }).catch(err => {

                throw err
            })
    }
    postSubmission = async (submission) => {
        var db = firebase.firestore()
        return db.collection("submissions").add({ ...submission })
            .then(() => {
                console.log(`submission for ${this.props.uid} successful!`);
            })
            .catch(function (error) {
                console.error("Error writing document: ", error);
            });
    }

    generateSubmission = () => {

        var content = {
            ...this.state.submission
        }
        // trim initial whitespaces
        for (let key in content) {
            content[key] = this.trimInitialSpaces(content[key])
        }

        return {
            username: this.props.username,
            uid: this.props.uid,
            createdOn: new Date(),
            gender: this.props.gender,
            content: content,
            address: this.props.address,
            photoRef: this.props.photoRef,
            comments: {
            },
            votes: {
                [this.props.uid]: 0
            }
        };
    }

    // helper function that trims empty spaces (e.g. ' ') in the beginning of string
    trimInitialSpaces = (str) => {
        var i = 0;
        while (i < str.length) {
            if (str.charAt(i) === ' ') {
                i += 1
            } else {
                return str.slice(i, str.length)
            }
        }
        return ''
    }


    submit = async (event) => {
        event.preventDefault()
        var submission = this.generateSubmission()
        try {
            this.toggleSpinner(true)
            //        ***CHECKS START***

            // auth check 
            if (!this.props.uid) { throw this.createErr('Log in to post!', 405) }
            // set info check
            if (this.props.needsInfo) { throw this.createErr('Set Info to Post!', 405) }
            // limit check
            const postsToday = await this.checkPostsLeft()
            // filled out check
            if (!this.state.submission.lineOne || !this.state.submission.lineTwo || !this.state.submission.lineThree || !this.state.submission.lineFour) {
                throw this.createErr('A submission requires four bars!', 408)
            }
            // posts the post
            await this.postSubmission(submission)
            //off with the spinner
            this.toggleSpinner(false)
            this.toggleNotification(`Post Successful! ${2 - postsToday} ${2 - postsToday === 1 ? 'post' : 'posts'} left today.`, true, true);
            this.resetBars()
        }
        catch (err) {
            this.toggleSpinner(false)
            this.toggleNotification(err.message, true, false)
        }
    }






    render() {

        // transition classes
        let focused = this.props.focused === 'Post'
        let theNotepadId = focused ? 'notepad-expanded' : 'notepad-compressed'
        let submitPostButtonId = focused ? 'visible' : 'invisible'
        let postWidgetHeader = focused ? 'header-compressed' : 'header-expanded'

        let fourLinesId = focused ? 'four-lines-expanded' : 'four-lines-compressed'

        // input elements
        var inputArr = []
        for (let key in this.state.inputData) {
            inputArr.push(this.state.inputData[key])
        }

        return (

            <div className={`the-notepad`} id={theNotepadId}>

                <div className={`post-widget-header`} id={postWidgetHeader} onClick={!focused ? this.props.toggle : null}>Post</div>

                <form className={'four-lines'}  autoComplete='false' id={fourLinesId}>
                    {this.state.showNotification ? <div className="post-notification" id={!this.state.notificationStatus ? 'negative-msg' : null} onAnimationEnd={() => this.toggleNotification('', false, false)}>{this.state.notificationMessage}</div> : null}

                    {inputArr.map((obj, index) => {
                        return (
                                <input
                                    {...this.state.inputUniversalProps}
                                    autoComplete="false"
                                    className={'input-line lines-expanded'}
                                    id={obj.id}
                                    value={this.state.submission[obj.id]}
                                    onChange={(event) => this.onChangeHandler(obj.id, event)}
                                    key={index}
                                    onKeyDown={this.arrowKeyHandler}
                                    disabled={this.props.loggedIn ? false : true} />

                        )
                    })}
                    <button
                        className={`submit-post-button`}
                        disabled={this.state.spinner ? true : false}
                        id={submitPostButtonId}
                        onClick={(event) => this.submit(event)}>
                        Submit
                        {this.state.spinner ? <div id="my-post-spinner"></div> : null}

                    </button>
                </form>

            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        uid: state.uid,
        email: state.email,
        username: state.username,
        gender: state.gender,
        address: state.address,
        loggedIn: state.loggedIn,
        needsInfo: state.needsInfo,
        photoRef: state.photoRef
    };
};

export default connect(mapStateToProps, null)(Post)

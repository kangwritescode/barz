import React, { Component } from 'react'
import './ManyPost.css'
import firebase from 'firebase'
import 'firebase/firestore'



class ManyPost extends Component {
    state = {
        photoURL: 'https://firebasestorage.googleapis.com/v0/b/barz-86ae0.appspot.com/o/mysteryman%2Fmysteryman.png?alt=media&token=7b1e5a7c-ede3-46ff-a036-70636e528cd2',
        score: 0,
        commentsCount: 0,

    }
    componentDidMount() {
        this.fetchScore()
        this.fetchCommentsCount()
    }


    fetchScore = () => {
        var db = firebase.firestore()
        db.collection('postVotes').where('pid', '==', this.props.pid).onSnapshot(snap => {
            var score = 0
            snap.docs.forEach(doc => {
                score += doc.data().value
            })
            score = Math.max(score, 0)
            this.setState({
                ...this.state,
                score: score
            })
        })

    }

    fetchCommentsCount = () => {
        var db = firebase.firestore()
        db.collection('postComments').where('pid', '==', this.props.pid).onSnapshot(snap => {
            const count = snap.size
            this.setState({
                ...this.state,
                commentsCount: count
            })
        })
    }




    render() {

        // date
        var verboseDate = this.props.createdOn.toDate().toDateString()
        const date = verboseDate.slice(4, verboseDate.length)

        // content
        var content = this.props.content.lineOne + ' / ' + this.props.content.lineTwo + ' / ' + this.props.content.lineThree + ' / ' + this.props.content.lineFour

        // votes 
        var score = this.state.score

        // comments count
        const commentsCount = this.state.commentsCount

        // dict {coast: color}
        const colorDict = {
            'West': 'yellow',
            'East': 'greeen',
            'South': 'blue',
            'Midwest': 'purple',
        }

        const coastColor = colorDict[this.props.address.region]


        return (

            <div
                className={`many-post scrollTo${this.props.pid}`}
                id={`scrollTo${this.props.pid}`}
                onClick={() => this.props.selectPost(this.props.pid)}>
                <header>
                    <div className='many-post-details' id={this.props.pid}>
                        <img className='many-post-pic' src={this.props.photoURL} alt='pic'></img>
                        <div className='many-post-name-date-container'>
                            <h6>{this.props.username}</h6>
                            <p>{date}</p>
                        </div>
                    </div>
                    <div className='many-post-region' id={coastColor}>
                        {this.props.address.region.toLowerCase()}
                    </div>
                    <div className='many-post-misc'>
                        <i class="fas fa-comment" id='manyComment'></i>
                        {commentsCount}
                        <i className="fas fa-fire" id='manyFlame' aria-hidden="true"></i>
                        {score}
                    </div>
                </header>
                <div className='many-post-body'>
                    <p>{`"${content}"`}</p>
                </div>

                <div className='vote-box'>
                    <button className='vote-button dislike-button'>
                        <i className="fa fa-trash" aria-hidden="true"></i>
                    </button>
                    <button className='vote-button like-button'>
                        <i className="fas fa-fire"></i>
                    </button>

                </div>
            </div>

        )
    }
}

export default ManyPost

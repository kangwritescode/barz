import React, { Component } from 'react'
import './FourBars.css'

class FourBars extends Component {
    render() {
        return (
            <div className="toJudge">
                    {this.props.showErrMsg ? <div id={'judgeErrMsg'} onAnimationEnd={this.props.resetErrState}>{this.props.errMsg}</div> : null}

                    <div className='judge-lines'>

                        <div className={`judge-line`} id={this.props.popInLeft}>
                            {this.props.submission.content.lineOne}
                        </div>
                        <div className="judge-line" id={this.props.popInRight}>
                            {this.props.submission.content.lineTwo}
                        </div>
                        <div className="judge-line" id={this.props.popInLeft}>
                            {this.props.submission.content.lineThree}
                        </div>
                        <div className="judge-line" id={this.props.popInRight}>

                            {this.props.submission.content.lineFour}
                        </div>
                    </div>
                    <div className="judge-buttons">
                        <button className={`judge-button`} id="prev-button">
                            <div onClick={() => this.props.incDec(-1)} id="prev-icon">&#8249;</div>
                        </button>
                        <button onClick={() => this.props.vote(-1)} className={`judge-button ${this.props.downvoteStyle}`} id="trash-button">
                            <i className="fa fa-trash" id="trash-icon"></i>
                        </button>
                        <button onClick={() => this.props.vote(1)} className={`judge-button ${this.props.upvoteStyle}`} id="fire-button">
                            <i className="fas fa-fire" id="flame"></i>
                        </button>
                        <button className="judge-button" id="the-next-button">
                            <div onClick={() => this.props.incDec(1)} id="next-icon">&#8250;</div>
                        </button>


                    </div>
                </div>
        )
    }
}

export default FourBars
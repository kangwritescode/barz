import React, { Component } from 'react'
import './JudgeNavItem.css'

class JudgeNavItem extends Component {

    render() {

        return (
            <div className="JudgeNavItemContainer">
                <div className={`JudgeNavItem ${this.props.type}`}>
                    {this.props.display}<div className="arrow down">
                    </div>
                </div>
                <div className={`dropdown`} id={`${this.props.type}`}>
                        {this.props.dropItems.map(display => {
                            return (
                                <div 
                                    key={display} 
                                    className={`item`} 
                                    onClick={() => this.props.updateJudgeState(this.props.type, display)}
                                    >
                                    {display}
                                </div>
                            )
                        })}
                    </div>
            </div>



        )

    }

}

export default JudgeNavItem;

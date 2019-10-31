import React, { Component } from 'react'
import './WordNavItem.css'

class WordNavItem extends Component {

    render() {

        return (
            <div className="WordNavItemContainer">
                <div className={`WordNavItem ${this.props.type}`}>
                    {this.props.display}<div className="arrow down">
                    </div>
                </div>
                <div className={`dropdown`} id={`${this.props.type}`}>
                        {this.props.dropItems.map(display => {
                            return (
                                <div key={display} className={`item`} onClick={() => this.props.sortAndFilter(this.props.type, display)}>
                                    {display}
                                </div>
                            )
                        })}
                    </div>
            </div>



        )

    }

}

export default WordNavItem;

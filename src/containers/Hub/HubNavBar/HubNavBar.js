import React, { Component } from 'react'
import './HubNavBar.css'
import WordNavItem from '../../Wordsmiths/WordNavBar/WordNavItem/WordNavItem'

class HubNavBar extends Component {

    componentDidMount() {
        document.addEventListener('click', this.toggleDropdown)

    }
    componentWillUnmount() {
        document.removeEventListener('click', this.toggleDropdown)
    }

    toggleDropdown(event) {
        const feedDrop = document.getElementById("feed");
        event.target.classList.contains('feed') ? feedDrop.classList.toggle('show') : feedDrop.classList.remove('show');
    }



    render() {

        return (
            <div className="HubNavBar">
                <div className="HubNavBarSectionContainer">
                    <div className="SortContainer">
                        <p id="sort">Feed:</p>
                        <WordNavItem
                            dropItems={['Personal', 'Following']}
                            type="feed"
                            display={this.props.feed}
                            sortAndFilter={this.props.sortAndFilter} />
                    </div>
                </div>
            </div>
        )
    }

}

export default HubNavBar;
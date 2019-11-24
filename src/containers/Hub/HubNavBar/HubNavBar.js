import React, { Component } from 'react'
import './HubNavBar.css'
import { connect } from 'react-redux'
import WordNavItem from '../../Wordsmiths/WordNavBar/WordNavItem/WordNavItem'


class HubNavBar extends Component {

    componentDidMount() {
        document.addEventListener('click', this.toggleDropdown)
    }
    componentWillUnmount() {
        document.removeEventListener('click', this.toggleDropdown)
    }
    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.needsInfo) {
            document.removeEventListener('click', this.toggleDropdown)
        } else if (!this.props.needsInfo) {
            document.addEventListener('click', this.toggleDropdown)
        }
    }

    toggleDropdown(event) {
        const feedDrop = document.getElementById("feed");
        if (feedDrop) {
            event.target.classList.contains('feed') ? feedDrop.classList.toggle('show') : feedDrop.classList.remove('show');
        }
    }


    render() {

        var contents = (
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
        )
        console.log(this.props.isLoading)
        if (this.props.needsInfo || this.props.paramsUser || this.props.isLoading) {
            contents = null
        }
        return (
            <div className="HubNavBar">
                {contents}
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        needsInfo: state.user.needsInfo
    }
}


export default connect(mapStateToProps, null)(HubNavBar);
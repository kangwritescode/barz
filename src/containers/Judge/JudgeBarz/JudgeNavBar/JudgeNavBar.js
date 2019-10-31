import React, { Component } from 'react'
import './JudgeNavBar.css'
import JudgeNavItem from './JudgeNavItem/JudgeNavItem'

class JudgeNavBar extends Component {

    componentDidMount() {
        document.addEventListener('click', this.toggleDropdown)

    }
    componentWillUnmount() {
        document.removeEventListener('click', this.toggleDropdown)
    }




    toggleDropdown = (event) => {
        const rankDrop = document.getElementById("sort");
        const votedDrop = document.getElementById("filter");
        const viewDrop = document.getElementById("view");
        const coastDrop = document.getElementById("coast");

        event.target.classList.contains('sort') ? rankDrop.classList.toggle('show') : rankDrop.classList.remove('show');
        event.target.classList.contains('filter') ? votedDrop.classList.toggle('show') : votedDrop.classList.remove('show');
        event.target.classList.contains('view') ? viewDrop.classList.toggle('show') : viewDrop.classList.remove('show');
        event.target.classList.contains('coast') ? coastDrop.classList.toggle('show') : coastDrop.classList.remove('show');

        if (this.props.view === 'Explore') {
            const timeDrop = document.getElementById("time");
            event.target.classList.contains('time') ? timeDrop.classList.toggle('show') : timeDrop.classList.remove('show');
        }
    }



    render() {
        var sortDropItems = ['Newest', 'Oldest']
        if (this.props.view === 'Explore') {
            var timeItem = (
                <JudgeNavItem
                    dropItems={['Last 24 Hours', 'Last 7 Days', 'Last 30 Days', 'Last 6 Months', 'Last 12 Months', 'All Time']}
                    type="time"
                    display={this.props.time}
                    updateJudgeState={this.props.updateJudgeState}
                />
            )
            sortDropItems = ['Newest', 'Oldest', 'Likes', 'Comments']
        }

        return (
            <div className="JudgeNavBar">
                <div className="JudgeNavSectionContainer">
                    <div className='nav-bar-section' id="view-container">
                        <p>View:</p>
                        <JudgeNavItem
                            dropItems={['Simple', 'Explore']}
                            type="view"
                            display={this.props.view}
                            updateJudgeState={this.props.updateJudgeState}
                        />
                    </div>

                    <div className='nav-bar-section' id="sort-container">
                        <p>Sort:</p>
                        <JudgeNavItem
                            dropItems={sortDropItems}
                            type="sort"
                            display={this.props.sort}
                            updateJudgeState={this.props.updateJudgeState}
                        />
                    </div>
                    <div className='nav-bar-section' id="judge-container">
                        <p>Filter:</p>
                        {timeItem}
                        <JudgeNavItem
                            dropItems={['All Coasts', 'West', 'East', 'South', 'Midwest']}
                            type="coast"
                            display={this.props.coast}
                            updateJudgeState={this.props.updateJudgeState}
                        />
                        <JudgeNavItem
                            dropItems={['All Posts', 'Unvoted', 'Voted']}
                            type="filter"
                            display={this.props.filter}
                            updateJudgeState={this.props.updateJudgeState}
                        />

                    </div>



                </div>
            </div>
        )
    }

}

export default JudgeNavBar;
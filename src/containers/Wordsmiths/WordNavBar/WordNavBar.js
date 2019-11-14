import React, { Component } from 'react'
import './WordNavBar.css'
import './WordNavItem/WordNavItem'
import WordNavItem from './WordNavItem/WordNavItem'

class WordNavBar extends Component {

    componentDidMount() {
        document.addEventListener('click', this.toggleDropdown)

    }
    componentWillUnmount() {
        document.removeEventListener('click', this.toggleDropdown)
    }




    toggleDropdown(event) {
        const rankDrop = document.getElementById("rank");
        const timeDrop = document.getElementById("time");
        const stateDrop = document.getElementById("state");
        const coastDrop = document.getElementById("coast");
        const genderDrop = document.getElementById("gender");
        event.target.classList.contains('rank') ? rankDrop.classList.toggle('show') : rankDrop.classList.remove('show');
        event.target.classList.contains('time') ? timeDrop.classList.toggle('show') : timeDrop.classList.remove('show');
        event.target.classList.contains('state') ? stateDrop.classList.toggle('show') : stateDrop.classList.remove('show');
        event.target.classList.contains('coast') ? coastDrop.classList.toggle('show') : coastDrop.classList.remove('show');
        event.target.classList.contains('gender') ? genderDrop.classList.toggle('show') : genderDrop.classList.remove('show');
    }



    render() {

        return (
            <div className="WordNavBar">
                <div className="WordNavSectionContainer">
                    <div className="SortContainer">
                        <p id="sort">Sort:</p>
                        <WordNavItem
                            dropItems={['Best', 'Random']}
                            type="rank"
                            display={this.props.rank}
                            sortAndFilter={this.props.sortAndFilter.bind(this)} />
                    </div>
                    <div className="FilterContainer">
                        <p id="filter">Filter:</p>
                        <WordNavItem
                            dropItems={['Last 24 Hours', 'Last 7 Days', 'Last 30 Days', 'Last 6 Months', 'Last 12 Months', 'All Time']}
                            type="time"
                            display={this.props.time}
                            sortAndFilter={this.props.sortAndFilter.bind(this)} />
                        <WordNavItem
                            dropItems={['All States', 'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']}
                            type="state"
                            display={this.props.state}
                            sortAndFilter={this.props.sortAndFilter.bind(this)} />
                        <WordNavItem
                            dropItems={['All Coasts', 'West', 'East', 'South', 'Midwest']}
                            type="coast"
                            display={this.props.coast}
                            sortAndFilter={this.props.sortAndFilter.bind(this)} />
                        <WordNavItem
                            dropItems={['All Genders', 'Male', 'Female']}
                            type="gender"
                            display={this.props.gender}
                            sortAndFilter={this.props.sortAndFilter.bind(this)} />
                    </div>

                </div>
            </div>
        )
    }

}

export default WordNavBar;
import React from 'react'
import './BestCity.css'

export default function BestCity(props) {

    let timeDict = {
        'Last 24 Hours': '24h',
        'Last 7 Days': '7d',
        'Last 30 Days': '30d',
        'Last 6 Months': '6mo',
        'Last 12 Months': '12mo',
        'All Time': 'All'
    }
    let sexDict = {
        'All Genders': 'All',
        'Male': 'M',
        'Female': 'F'
    }

    let location = 'All'

    if (props.state === 'All States' && props.coast !== 'All Coasts') {
        location = props.coast
    } else if (props.state !== 'All States') {
        location = props.state
    }


    return (
        <div className="BestCity">
            <div id="best-city"> 
                <p> Best City <span className="filter-details">({timeDict[props.time]}/{location}/{sexDict[props.gender]})</span></p>
            </div> 
            <div id="best-city-value-container">
                <div id="best-city-value">
                    {props.bestCity.toLowerCase()}
                </div>
            </div> 
        </div>
    )
}



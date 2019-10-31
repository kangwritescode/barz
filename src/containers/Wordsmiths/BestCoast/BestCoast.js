import React from 'react'
import './BestCoast.css'

export default function BestCoast(props) {

    var timeDict = {
        'Last 24 Hours': '24h',
        'Last 30 Days': '30d',
        'Last 6 Months': '6mo',
        'Last 12 Months': '12mo',
        'All Posts': 'All'
    }
    var sexDict = {
        'All Genders': 'All',
        'Male': 'M',
        'Female': 'F'
    }

    var location = 'All'

    if (props.state === 'All States' && props.coast !== 'All Coasts') {
        location = props.coast
    } else if (props.state !== 'All States') {
        location = props.state
    }

    return (
        <div className="BestCoast">
            <div id="best-region">
                <p> Best Region <span className="filter-details">({timeDict[props.time]}/{location}/{sexDict[props.gender]})</span> </p>
            </div>
            <div id="best-region-value-container">
                <div id="best-region-value">
                    {props.bestCoast}
                </div>
            </div>
        </div>
    )
}

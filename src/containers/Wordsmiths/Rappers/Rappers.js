import React, { Component } from 'react'
import './Rappers.css'
import Rapper from './Rapper/Rapper'
import firebase from '../../../Firebase'
import Pedestal from '../Pedestal/Pedestal'
import BestCity from '../BestCity/BestCity'
import BestCoast from '../BestCoast/BestCoast'
import ProfileBox from '../../Hub/ProfileBox/ProfileBox'

class Rappers extends Component {

    static pageLen = 11

    state = {
        spotlightRapper: null,
        spotlightRapperURL: null,
        fetchingSpotlightRapper: false,
        rappers: [],
        dequedNo: 0,
        toDeque: 0
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (prevProps.rappers !== this.props.rappers) {
            var totalNo = this.props.rappers.length

            // how much will you deque initially ?
            var dequedNo = Math.min(totalNo, Rappers.pageLen)
            // how much do you have left to toDeque
            var toDeque = totalNo <= Rappers.pageLen ? 0 : totalNo - Rappers.pageLen

            this.setState({
                ...this.state,
                rappers: this.props.rappers,
                dequedNo: dequedNo,
                toDeque: toDeque
            })
        }
    }

    deque = () => {

        if (this.state.toDeque <= Rappers.pageLen) {
            this.setState({
                ...this.state,
                dequedNo: this.state.dequedNo + this.state.toDeque,
                toDeque: 0
            })
        }
        else {
            this.setState({
                ...this.state,
                dequedNo: this.state.dequedNo + Rappers.pageLen,
                toDeque: this.state.toDeque - Rappers.pageLen
            })
        }
    }



    setSpotlightRapper = async (rapper) => {

        this.setState({
            ...this.state,
            fetchingSpotlightRapper: true,
            spotlightRapper: rapper
        })
    }


    render() {

        var placeholder = (
            <div className="Rappers">
                <div id="table-header">
                    <div className="headerDetail" id="votes">Score</div>
                    <div className="headerDetail" id="right-border">Username</div>
                    <div className="headerDetail" id="right-border">Location</div>
                    <div className="headerDetail" id="right-border">Region</div>
                    <div className="headerDetail">Gender</div>
                </div>
                {this.props.rappers.length === 0 && !this.props.fetching ? <div id='no-rappers'><div id="no-rappers-text">No rappers for that search!</div></div> : <div className="loader" id="rappers-loader">Loading...</div>}

            </div>
        )

        var tableHeader = (
            <div id="table-header">
                <div className="headerDetail" id="votes">Score</div>
                <div className="headerDetail" id="right-border">Username</div>
                <div className="headerDetail" id="right-border">Location</div>
                <div className="headerDetail" id="right-border">Region</div>
                <div className="headerDetail">Gender</div>
            </div>
        )



        var rappers = this.state.rappers.length === 0 ? placeholder : (
            <div className="Rappers">
                {tableHeader}
                {this.state.rappers.slice(0, this.state.dequedNo).map((rapper, index) => {

                    var style = (index % 2) === 0 ? 'lighter' : 'darker'

                    return <Rapper
                        rank={index + 1}
                        style={style}
                        key={rapper.username}
                        state={rapper.address.state}
                        username={rapper.username}
                        votes={rapper.tally}
                        city={rapper.address.city}
                        coast={rapper.address.region}
                        gender={rapper.gender}
                        submissionCount={rapper.submissionCount}
                        uid={rapper.uid}
                        photoRef={rapper.photoRef}
                        shineSpotlight={this.setSpotlightRapper} />
                })}
                {this.state.toDeque ? <div id='load-more' onClick={this.deque}>View More</div> : null}

            </div>
        )

        console.log(this.state.fetchingSpotlightRapper)

        return (
            <div className='Rappers-Container'>
                {rappers}
                <div className="Winners-container">
                    <div className='Winners-container__spotlight'>
                        <div className='spotlight__header'></div>
                        <div className='spotlight__profile-box-container'>
                            <ProfileBox
                                setShowPhotoModal={this.props.setShowPhotoModal}
                                imgURL={this.props.imgURL}
                                toggleUploadHandles={this.props.toggleUploadHandles}
                                wrappedBy='Rappers' />
                        </div>
                    </div>
                    <BestCoast
                        rank={this.props.rank}
                        time={this.props.time}
                        state={this.props.state}
                        coast={this.props.coast}
                        gender={this.props.gender}
                        bestCoast={this.props.bestCoast} />
                    <BestCity
                        rank={this.props.rank}
                        time={this.props.time}
                        state={this.props.state}
                        coast={this.props.coast}
                        gender={this.props.gender}
                        bestCity={this.props.bestCity} />
                </div>
            </div>
        )


    }
}
export default Rappers


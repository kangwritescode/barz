import React, { Component } from 'react'
import { connect } from 'react-redux'
import BestCity from '../BestCity/BestCity'
import BestCoast from '../BestCoast/BestCoast'
import Spotlight from '../Rappers/Spotlight/Spotlight'
import Rapper from './Rapper/Rapper'
import './Rappers.css'

class Rappers extends Component {

    static pageLen = 20

    state = {
        spotlightFocus: 'me',
        spotlightRapper: null,
        fetchingSpotlightRapper: false,
        rappers: [],
        dequedNo: 0,
        toDeque: 0
    }



    componentDidUpdate = (prevProps, prevState) => {
        if (prevProps.rappers !== this.props.rappers) {
            let totalNo = this.props.rappers.length

            // how much will you deque initially ?
            let dequedNo = Math.min(totalNo, Rappers.pageLen)
            // how much do you have left to toDeque
            let toDeque = totalNo <= Rappers.pageLen ? 0 : totalNo - Rappers.pageLen

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

    findRapper = () => {
        let rapper = this.state.rappers.filter(rapper => rapper.uid === this.props.uid)[0]
        return rapper
    }

    setSpotlightRapper = async (rapper) => {
        console.log(rapper, 'new spot light rapper')

        if (rapper.uid === this.props.uid) {
            this.setState({
                ...this.state,
                myCachedRapperData: rapper,
                spotlightRapper: rapper,
                spotlightFocus: 'me'
            })
        }
        else {
            this.setState({
                ...this.state,
                spotlightRapper: rapper,
                spotlightFocus: 'them'
            })
        }

    }

    setSpotlightFocus = (value) => {
        if (value === 'me') {
            this.setState({
                ...this.state,
                spotlightFocus: value,
                spotlightRapper: this.state.myCachedRapperData
            })
        } else {
            this.setState({
                ...this.state,
                spotlightFocus: value,
            })
        }

    }

    render() {

        const tableHeader = (
            <div id="table-header">
                <div className="headerDetail" id="votes">Score</div>
                <div className="headerDetail" id="right-border">Username</div>
                <div className="headerDetail" id="right-border">Location</div>
                <div className="headerDetail" id="right-border">Region</div>
                <div className="headerDetail">Gender</div>
            </div>
        )
        let placeholder = (
            <div className="Rappers">
                {tableHeader}
                {console.log(this.props.rappers)}
                {this.props.rappers.length === 0 && !this.props.fetching ? <div id='no-rappers'><div id="no-rappers-text">No rappers for that search!</div></div> : <div className="loader" id="rappers-loader">Loading...</div>}
            </div>
        )

        const rappers = this.state.rappers.length === 0 ? placeholder : (
            <div className="Rappers">
                {tableHeader}
                {this.state.rappers.slice(0, this.state.dequedNo).map((rapper, index) => {

                    let style = (index % 2) === 0 ? 'lighter' : 'darker'

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
                        address={rapper.address}
                        submissionCount={rapper.submissionCount}
                        uid={rapper.uid}
                        handles={rapper.handles}
                        photoURL={rapper.photoURL}
                        blurb={rapper.blurb}
                        shineSpotlight={this.setSpotlightRapper} />
                })}
                {this.state.toDeque ? <div id='load-more' onClick={this.deque}>View More</div> : null}

            </div>
        )



        return (
            <div className='Rappers-Container'>
                {rappers}
                <div className="Winners-container">
                    <div className='Winners-container__spotlight'>
                        <div className='spotlight__header'>
                            <div className={`header__section`} onClick={this.state.spotlightRapper && this.state.spotlightRapper.username === this.props.username ? () => alert('Select a rapper!') : () => this.setSpotlightFocus('them')}>
                                <span className='section__word'>Wordsmith</span>
                            </div>
                        </div>
                        <div className='spotlight__profile-box-container'>
                            <Spotlight
                                rapper={this.state.spotlightRapper}
                                focus={this.state.spotlightFocus}
                                wrappedBy='Rappers'
                                setShowPhotoModal={this.props.setShowPhotoModal}
                                toggleUploadHandles={this.props.toggleUploadHandles} />
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

const mapStateToProps = state => {
    return {
        uid: state.user.uid,
        photoURL: state.user.photoURL,
        username: state.user.username
    }
}
export default connect(mapStateToProps, null)(Rappers)


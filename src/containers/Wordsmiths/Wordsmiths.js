import 'firebase/firestore'
import React, { Component } from 'react'
import shuffle from 'shuffle-array'
import joey from '../../assets/videos/joey.m4v'
import joeyIMG from '../../assets/images/joeyIMG.png'
import firebase from '../../Firebase'
import Rappers from './Rappers/Rappers'
import WordNavBar from './WordNavBar/WordNavBar'
import './Wordsmiths.css'
import timeDict from './WordSmithsTools/timeDict'



class Wordsmiths extends Component {


    state = {
        rank: "Best",
        time: "All Time",
        state: "All States",
        coast: "All Coasts",
        gender: "All Genders",

        rappers: {},
        submissions: [],
        fetching: true,
        follows: [],
        followsRef: null

    }
    componentDidMount = async () => {

        try {

            this.toggleFetching(true)
            let rappers = {}
            let submissions = await this.fetchSubmissions()
            let votes = await this.fetchVotes()
            let users = await this.fetchUsers()

            // for every single submission
            submissions.forEach(submission => {
                console.log(users[submission.uid])

                // find the votes for that submission
                let filteredVotes = votes.filter(vote => vote.pid === submission.pid)
                if (!rappers[submission.uid]) {
                    rappers[submission.uid] = {
                        uid: submission.uid,
                        gender: submission.gender,
                        username: submission.username,
                        address: submission.address,
                        votes: filteredVotes,
                        photoURL: users[submission.uid].photoURL,
                        blurb: users[submission.uid].blurb,
                        handles: users[submission.uid].handles
                    }
                } else {
                    rappers[submission.uid].votes[submission.createdOn] = filteredVotes
                }
            })

            this.setState({
                ...this.state,
                rappers: rappers,
                submissions: submissions,
                fetching: false,
                votes: votes
            })
        }
        catch (err) {
            this.toggleFetching(false)
            console.log(err)
        }

    }

    // fetch ALL submissions
    fetchSubmissions = async () => {
        let db = firebase.firestore()
        return db.collection("submissions").get()
            .then((querySnapshot) => {
                let submissions = []
                querySnapshot.forEach((doc) => {
                    submissions.push({
                        ...doc.data(),
                        pid: doc.id
                    })
                });
                return submissions
            })
            .catch(err => { throw err })
    }
    // fetch ALl votes
    fetchVotes = async () => {
        let db = firebase.firestore()
        return db.collection("postVotes").get()
            .then((querySnapshot) => {
                let votes = []
                querySnapshot.forEach((doc) => {
                    votes.push(doc.data())
                });
                return votes

            })
            .catch(err => { throw err })
    }

    // fetch ALl votes
    fetchUsers = async () => {
        let db = firebase.firestore()
        return db.collection("users").get()
            .then((querySnapshot) => {
                let users = {}
                querySnapshot.forEach((doc) => {
                    users[doc.id] = { ...doc.data(), uid: doc.id }
                });
                return users

            })
            .catch(err => { throw err })
    }


    sortAndFilter(type, parameter) {
        // set appropriate UI
        if (type === 'state' && parameter !== 'All States') {
            this.setState({
                ...this.state,
                coast: 'All Coasts',
                [type]: parameter
            })
        } else if (type === 'coast' && parameter !== 'All Coasts') {
            this.setState({
                ...this.state,
                state: 'All States',
                [type]: parameter
            })
        }
        else {
            this.setState({
                ...this.state,
                [type]: parameter
            })
        }

    }

    toggleFetching = (bool) => {
        this.setState({
            ...this.state,
            fetching: bool
        })
    }



    render() {

        let rappers = { ...this.state.rappers }
        console.log(rappers)
        let allVotes = this.state.votes ? Object.values(this.state.votes) : []

        // states, coast, and gender filter
        if (this.state.state !== "All States") { rappers = Object.fromEntries(Object.entries(rappers).filter(([k, rapper]) => rapper.address.state === this.state.state)) }
        if (this.state.coast !== "All Coasts") { rappers = Object.fromEntries(Object.entries(rappers).filter(([k, rapper]) => rapper.address.region === this.state.coast)) }
        if (this.state.gender !== "All Genders") { rappers = Object.fromEntries(Object.entries(rappers).filter(([k, rapper]) => rapper.gender === this.state.gender)) }

        // tally user points
        for (let uid in rappers) {
            let rapper = rappers[uid]
            let tally = 0
            allVotes.forEach((vote) => {
                let now = new Date()
                let passedMilliseconds = now - vote.postDate.toDate().getTime()
                let passedDays = (passedMilliseconds / 1000 / 60 / 60 / 24)
                // tally if within given time 
                if (!(passedDays > timeDict[this.state.time]) && uid === vote.receiverID) {
                    tally += vote.value
                }
            })
            // if amount of votes is negative make zero
            rapper['tally'] = tally < 0 ? 0 : tally

            // submissionCount
            let filteredSubmissions = this.state.submissions.filter(submission => {
                let now = new Date()
                let passedMilliseconds = now - submission.createdOn.toDate().getTime()
                let passedDays = (passedMilliseconds / 1000 / 60 / 60 / 24)
                return !(passedDays > timeDict[this.state.time]) && submission.uid === uid
            })
            let noOfSubmissions = filteredSubmissions.length
            rapper['submissionCount'] = noOfSubmissions


        }
        rappers = rappers ? Object.values(rappers) : []

        // Sort:
        rappers = (this.state.rank === "Random") ?
            // random sort
            shuffle(rappers) :
            // best sort
            rappers.sort((rapper_A, rapper_B) => {
                return (rapper_A.tally < rapper_B.tally) ? 1 : -1
            })

        // tally city and coast votes
        let cityVotes = {}
        let coastVotes = {}
        rappers.forEach(rapper => {
            const cityState = `${rapper.address.city}, ${rapper.address.state}`
            if (rapper.tally > 0) {
                cityVotes[cityState] = (cityState in cityVotes) ?
                    cityVotes[cityState] + rapper.tally
                    : rapper.tally
                coastVotes[rapper.address.region] = (rapper.address.region in coastVotes) ?
                    coastVotes[rapper.address.region] + rapper.tally
                    : rapper.tally
            }
        })

        //  Best City and Best Coast reducers
        let bestCity = Object.keys(cityVotes).length ? Object.keys(cityVotes).reduce((a, b) => cityVotes[a] > cityVotes[b] ? a : b) : 'N/A'
        let bestCoast = Object.keys(coastVotes).length ? Object.keys(coastVotes).reduce((a, b) => coastVotes[a] > coastVotes[b] ? a : b) : 'N/A'


        return (
            <div className="WordsmithsContainer">
                <img id="backup-img" src={joeyIMG} alt="" />

                <video id="badass" src={joey} autoPlay={true} loop={true} playsInline={true} muted />
                <div id="WordSmithsOverlay" />
                <WordNavBar
                    rank={this.state.rank}
                    time={this.state.time}
                    state={this.state.state}
                    coast={this.state.coast}
                    gender={this.state.gender}
                    sortAndFilter={this.sortAndFilter.bind(this)} />
                <Rappers
                    rappers={rappers}
                    rank={this.state.rank}
                    time={this.state.time}
                    state={this.state.state}
                    coast={this.state.coast}
                    gender={this.state.gender}
                    bestCity={bestCity}
                    bestCoast={bestCoast}
                    sort={this.state.rank}
                    fetching={this.state.fetching}
                    follows={this.state.follows} />
            </div>
        )
    }
}

export default Wordsmiths

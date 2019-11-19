import 'firebase/firestore'
import React, { Component, useState, useEffect } from 'react'
import {Redirect} from 'react-router'
import shuffle from 'shuffle-array'
import joey from '../../assets/videos/joey.m4v'
import joeyIMG from '../../assets/images/joeyIMG.png'
import firebase from '../../Firebase'
import Rappers from './Rappers/Rappers'
import WordNavBar from './WordNavBar/WordNavBar'
import './Wordsmiths.css'
import timeDict from './WordSmithsTools/timeDict'
import FireApi from '../../Api/FireApi/FireApi'



const Wordsmiths = (props) => {

    const [sortFilterState, setSortFilterState] = useState({
        rank: "Best",
        time: "All Time",
        state: "All States",
        coast: "All Coasts",
        gender: "All Genders",
    })
    const [rappers, setRappers] = useState({})
    const [submissions, setSubmissions] = useState([])
    const [fetching, setFetching] = useState(true)
    const [votes, setVotes] = useState([])

    const [keyPressed, setKeyPressed] = useState(null)

    useEffect(() => {
        try {

            const asyncFunction = async () => {
                setFetching(true)
                let rappers = {}
                let submissions = await FireApi.fetchPostsOnce()
                let votes = await FireApi.fetchVotesOnce()
                let users = await fetchUsers()

                // for every single submission
                submissions.forEach(submission => {

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
                setRappers(rappers)
                setSubmissions(submissions)
                setFetching(false)
                setVotes(votes)
            }
            asyncFunction()

        }
        catch (err) {
            setFetching(false)
        }
        return () => {
        };
    }, [])

    useEffect(() => {
        const assignRedirect = (event) => {
            switch (event.key) {
                case '1': return setKeyPressed(1)
                case '2': return setKeyPressed(2)
                case '3': return setKeyPressed(3)
                default: break;
            }
        }
        document.addEventListener('keydown', assignRedirect)
        return () => {
            document.removeEventListener('keydown', assignRedirect)
        };
    }, [])


    // fetch ALl votes
    const fetchUsers = async () => {
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


    const sortAndFilter = (type, parameter) => {
        // set appropriate UI
        if (type === 'state' && parameter !== 'All States') {
            setSortFilterState({
                ...sortFilterState,
                coast: 'All Coasts',
                [type]: parameter
            })
        } else if (type === 'coast' && parameter !== 'All Coasts') {
            setSortFilterState({
                ...sortFilterState,
                state: 'All States',
                [type]: parameter
            })
        }
        else {
            setSortFilterState({
                ...sortFilterState,
                [type]: parameter
            })
        }

    }


    let displayedRappers = { ...rappers }
    let allVotes = votes ? Object.values(votes) : []

    // Filters start
    if (sortFilterState.state !== "All States") { displayedRappers = Object.fromEntries(Object.entries(displayedRappers).filter(([k, rapper]) => rapper.address.state === sortFilterState.state)) }
    if (sortFilterState.coast !== "All Coasts") { displayedRappers = Object.fromEntries(Object.entries(displayedRappers).filter(([k, rapper]) => rapper.address.region === sortFilterState.coast)) }
    if (sortFilterState.gender !== "All Genders") { displayedRappers = Object.fromEntries(Object.entries(displayedRappers).filter(([k, rapper]) => rapper.gender === sortFilterState.gender)) }
    // Filters end


    // Tally points start
    for (let uid in displayedRappers) {
        let rapper = displayedRappers[uid]
        let tally = 0
        allVotes.forEach((vote) => {
            let now = new Date()
            let passedMilliseconds = now - vote.postDate.toDate().getTime()
            let passedDays = (passedMilliseconds / 1000 / 60 / 60 / 24)
            // tally if within given time 
            if (!(passedDays > timeDict[sortFilterState.time]) && uid === vote.receiverID) {
                tally += vote.value
            }
        })
        // if amount of votes is negative make zero
        rapper['tally'] = tally < 0 ? 0 : tally

        // submissionCount
        let filteredSubmissions = submissions.filter(submission => {
            let now = new Date()
            let passedMilliseconds = now - submission.createdOn.toDate().getTime()
            let passedDays = (passedMilliseconds / 1000 / 60 / 60 / 24)
            return !(passedDays > timeDict[sortFilterState.time]) && submission.uid === uid
        })
        let noOfSubmissions = filteredSubmissions.length
        rapper['submissionCount'] = noOfSubmissions
    }
    // Tally points end


    displayedRappers = displayedRappers ? Object.values(displayedRappers) : []

    // Sort start
    displayedRappers = (sortFilterState.rank === "Random") ?
        // random sort
        shuffle(displayedRappers) :
        // best sort
        displayedRappers.sort((rapper_A, rapper_B) => {
            return (rapper_A.tally < rapper_B.tally) ? 1 : -1
        })
    // Sort end

    // tally city and coast votes
    let cityVotes = {}
    let coastVotes = {}
    displayedRappers.forEach(rapper => {
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





    var content = (
        <div className="WordsmithsContainer">
            <img id="backup-img" src={joeyIMG} alt="" />

            <video id="badass" src={joey} autoPlay={true} loop={true} playsInline={true} muted />
            <div id="WordSmithsOverlay" />
            <WordNavBar
                rank={sortFilterState.rank}
                time={sortFilterState.time}
                state={sortFilterState.state}
                coast={sortFilterState.coast}
                gender={sortFilterState.gender}
                sortAndFilter={sortAndFilter} />
            <Rappers
                rappers={displayedRappers}
                rank={sortFilterState.rank}
                time={sortFilterState.time}
                state={sortFilterState.state}
                coast={sortFilterState.coast}
                gender={sortFilterState.gender}
                bestCity={bestCity}
                bestCoast={bestCoast}
                sort={sortFilterState.rank}
                fetching={fetching}/>
        </div>
    )
    // switch (keyPressed) {
    //     case 1: return content = <Redirect to='/hub'></Redirect>
    //     case 2: return content = <Redirect to='/scribble'></Redirect>
    //     case 3: return content = <Redirect to='/judge'></Redirect>
    //     default: break;

    // }
    return content
}

export default Wordsmiths

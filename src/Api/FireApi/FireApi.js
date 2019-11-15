import firebase from 'firebase'

const fetchPosts = (setter, setDoneFetching) => {
    let db = firebase.firestore()
    const listener = db.collection('submissions').onSnapshot(snapshot => {
        const fetchedPosts = []
        snapshot.forEach(doc => {
            fetchedPosts.push({
                ...doc.data(),
                pid: doc.id
            })
        })
        setter(fetchedPosts)
        if (setDoneFetching) {setDoneFetching(true)}
    }, err => {
        console.log(err.message)
        if (setDoneFetching) {setDoneFetching(true)}
    })
    return listener
}
const fetchPostsOnce = async () => {
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
const fetchPost = (setter, pid) => {
    let db = firebase.firestore()
    db.collection('submissions').doc(pid).get()
        .then(doc => {
            setter({ ...doc.data(), pid: doc.id })
        })
}

const fetchUserSortedPosts = (setter, uid) => {
    let db = firebase.firestore()
    const listener = db.collection('submissions').where("uid", "==", uid).orderBy('createdOn', 'desc')
        .onSnapshot(querySnapshot => {
            let posts = []
            querySnapshot.forEach(doc => { posts.push({ pid: doc.id, ...doc.data() }) })
            setter(posts)
        }, err => console.log(err))
    return listener
}

const fetchVotes = (setter) => {
    let db = firebase.firestore()
    const listener = db.collection('postVotes').onSnapshot(snapshot => {
        console.log('votes listener detected a change')
        let fetchedVote;
        let fetchedVotes = []
        snapshot.forEach(vote => {
            fetchedVote = {
                ...vote.data(),
                vid: vote.id
            }
            fetchedVotes.push(fetchedVote)
        })
        setter(fetchedVotes)
    })
    return listener
}
const fetchVotesOnce = async () => {
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

const fetchVotesForPost = (setter, pid) => {
    let db = firebase.firestore()
    const listener = db.collection('postVotes').where('pid', '==', pid).onSnapshot(snapshot => {
        console.log('votes listener detected a change')
        let fetchedVote;
        let fetchedVotes = []
        snapshot.forEach(vote => {
            fetchedVote = {
                ...vote.data(),
                vid: vote.id
            }
            fetchedVotes.push(fetchedVote)
        })
        setter(fetchedVotes)
    })
    return listener
}

const fetchVotesForUID = (setter, uid) => {
    let db = firebase.firestore()
    const listener = db.collection('postVotes').where('receiverID', '==', uid).onSnapshot(querySnapshot => {
        let votes = {}
        querySnapshot.forEach(doc => {
            let vote = doc.data()
            if (vote.value === 1) {
                votes[vote.pid] = votes[vote.pid] ? votes[vote.pid] + 1 : 1
            }

        })
        setter(votes)

    })
    return listener
}

const fetchFollows = (setter) => {
    const db = firebase.firestore()
    const listener = db.collection('follows').onSnapshot(snapshot => {
        let fetchedFollows = []
        snapshot.forEach(doc => {
            fetchedFollows.push(doc.data())
        })
        setter(fetchedFollows)
    }, err => console.log(err))
    return listener
}

const fetchSubmissionComments = (setter) => {
    const db = firebase.firestore()
    const listener = db.collection('postComments').onSnapshot((snapshot) => {
        let comments = []
        for (let comment of snapshot.docs) {
            comment = {
                ...comment.data(),
                cid: comment.id
            }
            comments.push(comment)
        }
        setter(comments)
    }, err => {
        console.log(err)
    })
    return listener
}
const fetchSubmissionCommentsForPost = (setter, pid) => {
    const db = firebase.firestore()
    const listener = db.collection('postComments').where('pid', '==', pid).onSnapshot((snapshot) => {
        let comments = []
        for (let comment of snapshot.docs) {
            comment = {
                ...comment.data(),
                cid: comment.id
            }
            comments.push(comment)
        }
        setter(comments)
    })
    return listener
}

export default {
    allPostsListener: fetchPosts,
    allVotesListener: fetchVotes,
    allFollowsListener: fetchFollows,
    allSubmissionCommentsListener: fetchSubmissionComments,
    voteForUIDListener: fetchVotesForUID,
    userSortedPostsListener: fetchUserSortedPosts,
    votesForPostListener: fetchVotesForPost,
    submissionCommentsForPostListener: fetchSubmissionCommentsForPost,
    fetchSinglePost: fetchPost,
    fetchPostsOnce: fetchPostsOnce,
    fetchVotesOnce: fetchVotesOnce
}
import firebase from 'firebase'

const fetchPosts = (setter) => {
    var db = firebase.firestore()
    const listener = db.collection('submissions').onSnapshot(snapshot => {
        const fetchedPosts = []
        snapshot.forEach(doc => {
            fetchedPosts.push({
                ...doc.data(),
                pid: doc.id
            })
        })
        setter(fetchedPosts)
    })
    return listener
}

    
const fetchVotes = (setter) => {
    var db = firebase.firestore()
    const listener = db.collection('postVotes').onSnapshot(snapshot => {
        console.log('votes listener detected a change')
        var fetchedVote;
        var fetchedVotes = []
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
const fetchFollows = (setter) => {
    const db = firebase.firestore()
    const listener = db.collection('follows').onSnapshot(snapshot => {
        var fetchedFollows = []
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
        var comments = []
        for (var comment of snapshot.docs) {
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
    allSubmissionCommentsListener: fetchSubmissionComments
}
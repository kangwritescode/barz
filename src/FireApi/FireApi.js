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
const fetchUserSortedPosts = (setter, uid) => {
    var db = firebase.firestore()
    const listener = db.collection('submissions').where("uid", "==", uid).orderBy('createdOn', 'desc')
        .onSnapshot(querySnapshot => {
            var posts = []
            querySnapshot.forEach(doc => { posts.push({ pid: doc.id, ...doc.data() }) })
            setter(posts)
        }, err => console.log(err))
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

const fetchVotesForUID = (setter, uid) => {
    var db = firebase.firestore()
    const listener = db.collection('postVotes').where('receiverID', '==', uid).onSnapshot(querySnapshot => {
        var votes = {}
        querySnapshot.forEach(doc => {
            var vote = doc.data()
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
    allSubmissionCommentsListener: fetchSubmissionComments,
    voteForUIDListener: fetchVotesForUID,
    userSortedPostsListener: fetchUserSortedPosts
}
const myPlaceFinder = (votes, myUID) => {
    const dict = {}
    votes.forEach(vote => {
        if (vote.receiverID in dict) {
            dict[vote.receiverID] = dict[vote.receiverID] + vote.value
        } else {
            dict[vote.receiverID] = vote.value
        }
    })
    var arr = []
    for (let key in dict) {
        var obj = { uid: key, score: dict[key] }
        arr.push(obj)
    }
    arr = arr.sort((a, b) => {
        if (a.score > b.score) {
            return -1
        } return 1
    })
    var myPosition
    arr.forEach((item, index) => {
        if (item.uid === myUID) {
            myPosition = index + 1
        }
    })
    // if you've received no votes
    if (!myPosition) {
        return arr.length + 1
    }
    return myPosition
}

export default {
    myPlaceFinder: myPlaceFinder
}


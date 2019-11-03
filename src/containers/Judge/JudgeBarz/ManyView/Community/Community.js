import React, { useEffect, useState } from 'react'
import firebase from 'firebase'
import './Community.css'

function Community(props) {

    const [totalMembers, setTotalMembers] = useState(0)

    useEffect(() => {
        firebase.firestore().collection('users').get().then(snapshot => {
            setTotalMembers(snapshot.size)
        })
        return () => {
            
        };
    }, [])

    
    return (
        <div className='Community'>
            <div className='community-header'>Community</div>
            <div className='community-body'>
                <div>{totalMembers} members</div> 
                <div className='a-line'></div>
                <div>{props.submissions.length * 4} barz</div>
            </div>
        </div>

    )
}

export default Community;

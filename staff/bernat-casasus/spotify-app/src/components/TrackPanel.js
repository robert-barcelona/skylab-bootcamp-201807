import React from 'react'

function TrackPanel({result:{preview_url}}){
    return <iframe src={preview_url} width="100%" height="100%" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
}

export default TrackPanel
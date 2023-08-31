import React from 'react'
import CreateReviewModel from '../reviewModel';


function CreateReviewForm({spotId}) {

console.log ('@@@@@', spotId)

    // if (!spotId) return (<></>);

    return (
        <>


            <  CreateReviewModel

                spotId={spotId}
                formType='Create review'
            />



        </>
    )
}

export default CreateReviewForm

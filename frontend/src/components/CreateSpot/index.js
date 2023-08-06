import SpotForm from "../spotForm"
import "../updateform/updateForm.css"

export default function CreateSpotForm() {

    const spot = {
        country: '',
        address: '',
        city: '',
        city: '',
        state: '',
        lat: '',
        lng: '',
        description: '',
        name: '',
        price: ''

    }

    return (
        <>
            <h1 className='header'>Create a new Spot</h1>

            <SpotForm
                spot={spot}
                formType='Create Spot'

            />
        </>
    )


}
// <h>this is the create spot form</h>

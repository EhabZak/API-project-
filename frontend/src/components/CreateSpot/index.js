import SpotForm from "../spotForm"


export default function CreateSpotForm() {

    const spot = {
        country: '',
        address: '',
        city: '',
        city: '',
        state: '',
        latitude: '',
        longitude: '',
        description: '',
        name: '',
        price: ''

    }

    return (
        <>


            <SpotForm
                spot={spot}
                formType='Create Spot'

            />
        </>
    )


}
// <h>this is the create spot form</h>

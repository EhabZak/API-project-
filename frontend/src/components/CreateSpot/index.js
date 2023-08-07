import SpotForm2 from "./spotForm2"
import "../updateform/updateForm.css"

export default function CreateSpotForm() {

    // const spot = {
    //     country: '',
    //     address: '',
    //     city: '',
    //     city: '',
    //     state: '',
    //     lat: '',
    //     lng: '',
    //     description: '',
    //     name: '',
    //     price: ''

    // }

    // return (
    //     <>
    //         <h1 className='header'>Create a new Spot</h1>

    //         <SpotForm2
    //             spot={spot}
    //             formType='Create Spot'

    //         />
    //     </>
    // )

      return (
        <SpotForm2
          formType="Create"
        />
      )


}
// <h>this is the create spot form</h>

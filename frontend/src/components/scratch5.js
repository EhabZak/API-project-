// my first solution -1 //////////////////////////////////////////////////////////////

export const createSpot = (spot) => async (dispatch) => {
    console.log('44444444', spot)
    try {
        const res = await csrfFetch('/api/spots', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(spot),
        })

        if (!res.ok) {

            const errors = await res.json();
            throw new Error(JSON.stringify(errors));
        }

        const spotDetails = await res.json();
        return spotDetails;
    } catch (error) {

        console.log("createspot&&&&&&", error)
        return error; // Re-throw the error to be caught in the component
    }

}

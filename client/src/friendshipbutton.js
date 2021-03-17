import { useState, useEffect } from "react";
import axios from "./axios";


export default function FriendshipButton(props) {
    // needs to get passed the id of the user that we are currently viewing
    // we will either want to befriend that user, cancel a request we made in the past,
    // accept a pending friend request, or end our friendship
    // the id of the other user lives in the OtherProfile component

    // in useEffect we will want to make a request to the server to find out our 
    // relationship status with the user we are looking at, and send over some button text

    // on submit/ btn click we want to send the button text to the server, 
    //to update our db, and change the btn text asgain, once the DB has 
    // been successfully updated

    const [buttonText, setButtonText] = useState("Send friend request");

    console.log("recipient user id", props.recipientId);
    
    let recipientId = props.recipientId;

    useEffect(()=> {

        axios.get(`/friendCheck/${recipientId}`)
            .then((results) => {
                console.log("results after page loads:", results);
                console.log("friend req button", results.data);
                setButtonText(results.data);
            });


    },[]);

    // async test for handle submit

    const handleSubmit = async () => {
        let recipientId = props.recipientId;
        console.log(recipientId);
        console.log(" request button clicked");
        const { data } = await axios.post(`/buttonCheck/${recipientId}`, {
            text: buttonText,
        });
        console.log("Data received after pressing the submit button:", data);
        setButtonText(data);
    };

    return (
        <>
            <button
                onClick={() => handleSubmit()}
                className="btn btn-primary btn-sm btn-block"
            >
                {buttonText}
            </button>
        </>
    );
}
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {getAllFriends, acceptFriendRequest,endFriendship} from "./actions";
import Button from "react-bootstrap/Button";

export default function Friends() {

    
    const dispatch = useDispatch();

    // this takes the data we passed to the state using the reducer and the actions 

    const requestedFriends = useSelector(
        (state) => state.Friends && state.Friends.filter((Friends) => Friends.accepted == false));

    // this takes the data we passed to the state using the reducer and the actions 

    const acceptedFriends = useSelector(
        (state) => state.Friends && state.Friends.filter((Friends) => Friends.accepted == true));

    useEffect(() => {
        console.log("use effect mounted");
        dispatch(getAllFriends());
    }, []);
 


    // insert below the selectors either directly as below, or make use of the literals

    return (
        <>
            <h1>Friends</h1>

            {acceptedFriends && acceptedFriends.map((input) => {
                return (
                    <div key={input.id}>
                        <img
                            style={{ height: 150 }}
                            src={input.profile_pic_url || "/default.jpg"}
                        />
                        <p>
                            {input.first} {input.last}
                        </p>

                        <Button
                            variant="danger"
                            onClick={() => dispatch(endFriendship(input.id))}
                        >
                            End Friendship
                        </Button>
                    </div>
                );
            })}

            <h1>Friend requests</h1>

            {requestedFriends && requestedFriends.map((input) => {
                return (
                    <div
                        key={input.id}
                        // className="d-flex flex-row bd-highlight mb-3"
                    >
                        <img
                            style={{ height: 150 }}
                            className="border border-primary shadow-lg"
                            src={input.profile_pic_url || "/default.jpg"}
                        />
                        <p>
                            {input.first} {input.last}
                        </p>

                        <Button
                            variant="success"
                            onClick={() =>
                                dispatch(acceptFriendRequest(input.id))
                            }
                        >
                            Accept friend request
                        </Button>
                    </div>
                );
            })}
        </>
    );
}
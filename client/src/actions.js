// this will creat all of our actions
// an action function creator is a function that returns and object
// this will be passed on to the reducer

import axios from "./axios";

export async function getAllFriends() {
    const { data } = await axios.get("/friends.json");
    console.log("data from db on friends and wannabes", data);
    return {
        type: "friends/getAllFriends",
        payload: data,
    };
}

export async function acceptFriendRequest(recipientId) {
    const { data } = await axios.post(`/acceptFriendrequest/${recipientId}`);
    console.log("results data inside axept friend request button click", data);
    if (data) {
        return {
            type: "friends/acceptRequest",
            recipientId: recipientId,
        };
    }
}

// export async function endFriendship(recipientId) {
//     const { data } = await axios.post(`/buttonCheck/${recipientId}`, {
//         text: "End friendship",
//     });

//     console.log("results data inside end friendship button click", data);
//     return {
//         type: "friends/endFriendship",
//         payload: data,
//     };

// }

export async function endFriendship(recipientId) {
    const { data } = await axios.post(`/endFriendship/${recipientId}`);
    console.log("results data inside end friendship button click", data);
    if (data) {
        return {
            type: "friends/endFriendship",
            recipientId: recipientId,
        };


    }

}

// need to add an action for the 10 most recent messages for part 10


export async function chatMessage(chattext) {
    // const { data } = await axios.post("/chatMessageInsert", );
    // console.log("results data inside message post", data);

    return {
        type: "chatMessage",
        payload: chattext,
    };

}

export async function chatMessages() {
    const { data } = await axios.get("/chat.json");
    console.log("results data inside get messages", data);

    return {
        type: "chatMessages",
        payload: data,
    };

}



// need to create an action for when individual messages are recieved


export function reducer(state = {}, action) {

    // this checks the actions  and updates the state based on data passed. Which is then passed on to the global state

    if (action.type === "friends/getAllFriends") {
        state = {
            ...state,
            Friends: action.payload,
        };
        console.log("new state in get all friends:", state);
    }

    if (action.type === "friends/acceptRequest") {
        console.log("made it inside friends request", action.payload);
        state = {
            ...state,
            Friends: state.Friends.map((user) => {
                if (user.id === action.recipientId) {
                    user.accepted = true;
                }
                return user;
               
            }),
        };

        console.log("new state in accept friend:", state);
    }

    if (action.type === "friends/endFriendship") {
        state = {
            ...state,
            Friends: state.Friends.filter((user) => {
                return user.id != action.recipientId;
            })
        };
        console.log("new state in end friendships:", state);
    }

    if (action.type === "chatMessage") {
        state = {
            ...state,
            messages: [...state.messages, action.payload]
        };
        console.log("new state in message:", state);
    }

    if (action.type === "chatMessages") {
        state = {
            ...state,
            messages: action.payload,
        };
        console.log("new state in messages:", state);
    }

    return state;
}
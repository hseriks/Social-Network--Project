import { useState, useEffect } from "react";
import axios from "./axios";
import Toast from "react-bootstrap/Toast";
import {chatMessage, chatMessages} from "./actions";
import { useDispatch, useSelector } from "react-redux";

export default function chat() {

    const dispatch = useDispatch();
   

    const [chat, updateMessage] = useState("");

    console.log("value of chat", chat);

    const [chats, setChatMessages] = useState([]);

    console.log("chat message:", chatMessages);

    // const message = useSelector(state => state.message);
    // console.log("message after state has been updated", message);

    const messages = useSelector((state) => state.messages);
    console.log("messages after state has been updated", messages);

    function sendMessage() {

        axios.post("/chatMessageInsert", {chat}).then((results)=> {
            console.log("message was passed from chat.js", results);
        }).catch((error)=> {
            console.log("error in passing message from chat.js", error);
        });
    }
    

    // emit something here?? that the server catchets?


    useEffect(() => {
        console.log("use effect mounted");
        dispatch(chatMessages());
        // the issue now is that im now update use state
        
    }, []);

    // async test for handle submit

    return (
        <div
            className="container"
            style={{ border: "solid grey", overflow: "scroll" }}
        >
            {/* {message.msg &&
                message.msg.map((input) => {
                    return (
                        <Toast key={input.id}>
                            <Toast.Header>
                                <img
                                    src="holder.js/20x20?text=%20"
                                    className="rounded mr-2"
                                    alt=""
                                />
                                <strong className="mr-auto">Bootstrap</strong>
                                <small>just now</small>
                            </Toast.Header>
                            <Toast.Body>{input}</Toast.Body>
                        </Toast>
                    );
                })} */}

            {messages &&
                messages.map((input) => {
                    return (
                        <Toast style={{ border: "solid black" }} key={input.id}>
                            <Toast.Header>
                                <img
                                    src="holder.js/20x20?text=%20"
                                    className="rounded mr-2"
                                    alt=""
                                />
                                <img
                                    className="border border-primary rounded-circle shadow-lg"
                                    src={
                                        input.profile_pic_url || "/default.jpg"
                                    }
                                    style={{ height: 40 }}
                                ></img>
                                <strong className="mr-auto">
                                    {input.first} {input.last}
                                </strong>
                                <small>
                                    {new Intl.DateTimeFormat("en-GB", {
                                        dateStyle: "short",
                                        timeStyle: "short",
                                    }).format(new Date(input.created_at))}
                                </small>
                            </Toast.Header>
                            <Toast.Body>{input.chattext}</Toast.Body>
                        </Toast>
                    );
                })}

            {
                <div>
                    <div className="form-group">
                        <input
                            onChange={(e) => updateMessage(e.target.value)}
                            name="chat"
                            className="form-control"
                            placeholder="Type your message here"
                        />
                        <button
                            onClick={() => sendMessage({ chat })}
                            type="submit"
                            include
                            className="btn btn-primary btn-sm btn-block"
                        >
                            Send message
                        </button>
                    </div>
                </div>
            }
        </div>
    );
}

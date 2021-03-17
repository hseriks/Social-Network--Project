import React from "react";
import axios from "./axios";

export default class ResetPassword extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
            email: "",
            password: "",
        };
        // strategy #1 for binding
        // this.handleChange = this.handleChange.bind(this);
    }

    // 1. we need to store the user's input in state
    // 2. when user clicks "submit," we need to take the input we got from the user
    // and send it off to the server in a `POST` request

    handleClick() {
        // remaining tasks: make the red underlines go away!
        console.log("button clicked");
        console.log("testing");

        const dataToSendToServer = {
            email: this.state.email,
            //password: this.state.password,
        };

        axios
            .post("/resetpassword", dataToSendToServer)
            .then((resp) => {
                console.log("resp from server: ", resp);

                location.replace("/verify");

                // I also need to catch errors
            })
            .catch((err) => {
                console.log("err in reset: ", err);
                this.setState({
                    error: true,
                });
            });
    }

    // this is how we handle user input in React!
    handleChange(e) {
        // console.log("e target value: ", e.target.value);
        // which input field is the user typing in?
        console.log("e target name: ", e.target.name);
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log("this.state after setState: ", this.state)
        );
        // this.setState is used to put/update state!
        // if (e.target.name === "first") {
        //     this.setState({
        //         first: e.target.value,
        //     });
        // } else if (e.target.name === "last") {
        //     this.setState({
        //         last: e.target.value,
        //     });
        // }
    }

    render() {
        return (
            <div>
                {this.state.error && <p>Something broke :(</p>}
                <h1>Reset password page</h1>
                {/* strategy #2 for binding: arrow functions! */}

                
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="email"
                    type="text"
                    placeholder="email"
                />
                <button onClick={() => this.handleClick()}>submit</button>







            </div>
        );
    }
}

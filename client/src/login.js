// src/registration.js
// class component have state!
// (class components also have lifecycle methods (like componentDidMount))
import React from "react";
//import axios from "axios";
import axios from "./axios";
import Link from "react-router-dom/Link";
import Badge from "react-bootstrap/Badge";
import { Button } from "react-bootstrap";



export default class login extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
            email: "",
            password: "",
            validUser: false,
            errorFalsePW: false,
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
            password: this.state.password,
        };

        axios
            .post("/login", dataToSendToServer)
            .then((resp) => {
                console.log("resp from server: ", resp);

                if (resp.data.errorFalsePW) 
                    return this.setState({
                        errorFalsePW: true,
                    }); 
                
                else if (resp.data.validUser) { 
                    return location.replace("/");
                };
                
               
            })
            .catch((err) => {
                console.log("err in login: ", err);
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
                {this.state.errorFalsePW && <p>You typed in something wrong</p>}

                {/* strategy #2 for binding: arrow functions! */}

                {/* alternative login setup */}

                <div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            onChange={(e) => this.handleChange(e)}
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="Enter email"
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            onChange={(e) => this.handleChange(e)}
                            name="password"
                            type="password"
                            className="form-control"
                            placeholder="Enter password"
                        />
                    </div>

                    <button
                        onClick={() => this.handleClick()}
                        type="submit"
                        className="btn btn-primary btn-sm btn-block"
                    >
                        Login
                    </button>
                    <Link to="/resetpassword">
                        <h1>
                            {" "}
                            <Button variant="outline-primary">
                                Click here to reset password!
                            </Button>
                        </h1>
                    </Link>
                </div>
            </div>
        );
    }
}
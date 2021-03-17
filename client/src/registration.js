// src/registration.js
// class component have state!
// (class components also have lifecycle methods (like componentDidMount))
import React, {Component} from "react";
//import axios from "axios";
import axios from "./axios";
import Link from "react-router-dom/Link";
import Badge from "react-bootstrap/Badge";



export default class Registration extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
            first: "",
            last: "",
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
            first: this.state.first,
            last: this.state.last,
            email: this.state.email,
            password: this.state.password,
            duplicateError: false,
            error: false
        };
0
        if (this.state.first == "") {
            this.setState ({
                error :true
            });
        }

        axios
            .post("/registration", dataToSendToServer)
            .then((resp) => {

                if (resp)

                return location.replace("/");
                console.log("resp from server: ", resp.data);
                
            

           
               
            })
            .catch((err) => {
                console.log("err in registration: ", err);
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
                {this.state.duplicateError && (
                    <p>
                        Something went wrong with your registration. Please try
                        again with a different email! :(
                    </p>
                )}

                {/* strategy #2 for binding: arrow functions! */}

                <div className="form-group">
                    <label>First name</label>
                    <input
                        onChange={(e) => this.handleChange(e)}
                        type="text"
                        name="first"
                        className="form-control"
                        placeholder="First name"
                    />
                </div>

                <div className="form-group">
                    <label>Last name</label>
                    <input
                        onChange={(e) => this.handleChange(e)}
                        type="text"
                        name="last"
                        className="form-control"
                        placeholder="Last name"
                    />
                </div>

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
                    className="btn btn-dark btn-sm btn-block"
                >
                    Register
                </button>
                
                {/* <Badge variant="primary">Login</Badge> */}
                <Link to="/login">
                    <button
                        // onClick={() => location.replace("/login")}
                        type="submit"
                        className="btn btn-primary btn-sm "
                    >
                        Click here to login
                    </button>
                </Link>
            </div>
        );
    }
}



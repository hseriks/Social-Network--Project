
import React from "react";
import axios from "./axios";
import Badge from "react-bootstrap/Badge";
import Link from "react-router-dom/Link";

export default class ResetPassword extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
            email: "",
            password: "",
            renderView: 1,
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
            codeMatch: true
            //password: this.state.password,
        };

        axios
            .post("/resetpassword", dataToSendToServer)
            .then((resp) => {
                
                if (resp.data.sentEmail) {
                
                this.setState({
                    renderView: 2,
                    email: "",
                });

            }

                console.log(this.state.reset);
                // location.replace("/verify");

                // I also need to catch error

                console.log("resp from server: ", resp);
            })
            .catch((err) => {
                console.log("err in reset: ", err);
                this.setState({
                    error: true,
                });
            });
        }
            
    NewPassword() {

        //1. Check that code is correct. If true, move on 
       // 2. Check time if the code has expired 
        //3. 

        console.log("this state after password reset try:", this.state);

         const dataToSendToServer = {
            code: this.state.code,
            password: this.state.password
            //password: this.state.password,
        };

        console.log(dataToSendToServer);

        axios.post("/password/reset/verify", dataToSendToServer ).then((results) => {
            console.log (results);
              if (results.data.codeMatch) {
                
                this.setState({
                    renderView: 3
                });

            } else if (results.data.codeFalse) {
                this.setState({
                    codeFalse: true
                });

            }
        }).catch((error)=> {
        console.log("error getting back after code check", error);
    })};

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

    determineWhichViewToRender() {
        // this method determines what the render!
        if (this.state.renderView === 1) {
            return (
                <div>
                    {/* <h2>Please enter your email address</h2> */}
                    <div className="form-group">
                    {/* <label>Email</label> */}
                    <input onChange={(e) => this.handleChange(e)} type="email" name="email"className="form-control" placeholder="Enter email" />
                    <button onClick={() => this.handleClick()} type="submit" className="btn btn-primary btn-sm btn-block">Request validation code</button>
                    </div>
                </div>
            );
        } else if (this.state.renderView === 2) {
            return (
                <div>
                    {this.state.codeFalse && <p>Please provide a valid code</p>}
                    {/* <h2>Please enter your new password and the provided code</h2> */}
                
                    <input onChange={(e) => this.handleChange(e)} type="password" name="password"className="form-control" placeholder="New password" />
                    <input onChange={(e) => this.handleChange(e)} type="password" name="code"className="form-control" placeholder="Validation code" />     
                    <button onClick={() => this.NewPassword()} type="submit" className="btn btn-primary btn- btn-block">Reset Password</button>




                </div>
            );
        } else if (this.state.renderView === 3) {
            return (
                <div>
                    <h1>success</h1>
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

    render() {
        return (
            <div>
                {/* call the method */}
                {this.determineWhichViewToRender()}
            </div>
        );
    }
}

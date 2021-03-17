// src/resetpassword.js
import React from "react";
import Link from "react-router-dom/Link";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            renderView: 1,
        };
    }

    determineWhichViewToRender() {
        if (this.state.renderView === 1) {
            return (
                <div>
                    <input name="email" />
                    <button></button>
                </div>
            );
        } else if (this.state.renderView === 2) {
            return (
                <div>
                    <input name="password" />
                    <input name="code" />
                    <button></button>
                </div>
            );
        } else if (this.state.renderView === 3) {
            return (
                <div>
                    <h1>Password succesfully changed</h1>
                    <h2>Click here to log in</h2>
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
                <h1>reset password</h1>
                {this.state.error && <p>error</p>}
                {this.determineWhichViewToRender()}
            </div>
        );
    }
}
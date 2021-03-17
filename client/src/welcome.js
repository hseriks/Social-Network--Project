
import { HashRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";
import ResetPassword from "./resetpassword";
import React from "react";
import {Badge} from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Navbar from "react-bootstrap/Navbar";
import Link from "react-router-dom/Link";

export default function Welcome() {
    return (
        <main className="container">
            <Navbar bg="light" expand="lg">
                <img src="./coinCounter.jpg" style={{ height: "7vh" }} />
                <Navbar.Brand href="#home">Coin Counter</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="#home">About us</Nav.Link>
                        <Nav.Link href="#home">News</Nav.Link>
                        <Nav.Link href="#home">Podcasts</Nav.Link>
                        <Nav.Link href="#link">
                            {" "}
                            <Badge variant="primary">Events</Badge>
                            
                        </Nav.Link>
                        {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/users">
                                Other users
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#act/3.2">
                                My friends
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">
                                Somethingc
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">
                                Separated link
                            </NavDropdown.Item>
                        </NavDropdown> */}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            <HashRouter>
                <React.Fragment>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/resetpassword" component={ResetPassword} />
                </React.Fragment>
            </HashRouter>
        </main>
    );
}


// //src/welcome.js
// import Registration from "./registration";

// //"dumb"/presentational"
// export default function Welcome() {
//     return (
//         <div>
//             <h1>Welcome</h1>
//             <Registration />
//         </div>
//     );
// }
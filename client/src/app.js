import  {Logo}  from "./logo.js";
import  {Component}  from "react";
import  {ProfilePic}  from "./profile-pic.js";
import  {Uploader}  from "./uploader.js";
import  Profile  from "./profile";
import Friends from "./friends";
import Chat from "./chat";
import axios from "./axios";
import Bio from "./Bio";
import Login from "./login";
import {BrowserRouter, Route, Link} from "react-router-dom";
import FindPeople from "./findpeople";
import OtherProfile from "./otherprofile";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Badge from "react-bootstrap/Badge";


export class App extends Component {
    constructor(props) {
        super(props);

        // Initialize App's state
        this.state = {
            // state is for things that will change
            uploaderVisible: false,
            firstName: "",
            lastName: "",
            profilePicUrl: "",
            bioVisible: false,
        };

        // TODO: Bind methods if needed

        this.setProfilePicUrl = this.setProfilePicUrl.bind(this);
        this.setBio = this.setBio.bind(this);
        this.toggleUploader = this.toggleUploader.bind(this);
        this.toggleBio = this.toggleBio.bind(this);
    }

    componentDidMount() {
        // Special React Lifecycle Method
        // TODO: Make an axios request to fetch the user's data when the component mounts
        // TODO: update the state when the data is retrieved

        axios
            .post("/user")
            .then((results) => {
                console.log("results after profile request", results.data);
                // this set state (results)!!!
                this.setState({
                    id: results.data.id,
                    firstName: results.data.first,
                    lastName: results.data.last,
                    profilePicUrl: results.data.profile_pic_url,
                    bio: results.data.bio,
                });
            })
            .catch((err) => {
                console.log("error getting user data", err);
            });
    }

    toggleUploader() {
        this.setState({
            uploaderVisible: !this.state.uploaderVisible,
        });
    }

    toggleBio() {
        this.setState({
            bioVisible: !this.state.bioVisible,
        });
    }

    setBio(passedBio) {
        this.setState({
            bio: passedBio,
        });
    }

    setProfilePicUrl(profilePic) {
        this.setState({
            profilePicUrl: profilePic,
            uploaderVisible: !this.state.uploaderVisible,
        });
    }

    handleCookie() {
        console.log("logout was pressed");
        axios.post("resetCookie").then((results) => {
            console.log("after cookie has been deleted", results);
            location.replace("/welcome");
        });
    }

    render() {
        return (
            <BrowserRouter>
                <main className="container">
                    <Navbar bg="light" expand="lg">
                        {/* <Logo /> */}
                        <img
                            src="./coinCounter.jpg"
                            style={{ height: "7vh" }}
                        />

                        <Navbar.Brand href="#home">Coin Counter</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="mr-auto">
                                <Nav.Link href="#home">About us</Nav.Link>
                                <Nav.Link href="#home">News</Nav.Link>
                                <Nav.Link href="#home">Podcasts</Nav.Link>
                                <Nav.Link href="#link">
                                    {" "}
                                    <Badge
                                        variant="primary"
                                        onClick={() => this.handleCookie()}
                                    >
                                        Logout
                                    </Badge>
                                </Nav.Link>

                                <NavDropdown
                                    title="Dropdown"
                                    id="basic-nav-dropdown"
                                >
                                    <NavDropdown.Item href="/users">
                                        Other users
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="/chat">
                                        Chat
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="/friends">
                                        Friends
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item
                                        onClick={() => this.handleCookie()}
                                    >
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>

                                <ProfilePic
                                    // Passing down props:
                                    // firstName={this.state.firstName}
                                    // lastName={this.state.lastName}
                                    profilePicUrl={this.state.profilePicUrl}
                                    // Passing down methods as standard functions (binding needed):
                                    clickHandler={this.toggleUploader}
                                    style={{ height: "5vh", width: "10vw" }}
                                />
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>

                    {/* <button onClick={() => this.handleCookie()}>Logout</button> */}

                    {/* <Profile
                firstName={this.state.firstName}
                lastName={this.state.lastName}
                /> */}

                    {/*Conditionally render the Uploader: */}
                    {this.state.uploaderVisible && (
                        <Uploader
                            // Passing down methods with arrow function (no binding needed):
                            setProfilePicUrl={this.setProfilePicUrl}
                        />
                    )}

                    <Route exact path="/users" render={() => <FindPeople />} />
                    <Route exact path="/friends" render={() => <Friends />} />
                    <Route exact path="/chat" render={() => <Chat />} />

                    <div>
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Profile
                                    id={this.state.id}
                                    firstName={this.state.firstName}
                                    lastName={this.state.lastName}
                                    profilePicUrl={this.state.profilePicUrl}
                                    onClick={this.showUploader}
                                    onBio={this.toggleBio}
                                    bio={this.state.bio}
                                    setBio={this.setBio}
                                    // clickBio={this.}
                                />
                            )}
                        />
                        <Route path="/user/:id" component={OtherProfile} />
                    </div>
                </main>
            </BrowserRouter>
        );
    }
}

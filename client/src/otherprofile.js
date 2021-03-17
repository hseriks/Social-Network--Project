import { Component } from "react";
import axios from "./axios";
import Card from 'react-bootstrap/Card';
import Bio from "./Bio";
import FriendshipButton from "./friendshipbutton";

export default class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        console.log("recipient Id: ", this.props.match.params.id);

        // we should  make a request to our server to get the other user's data using the id
        // If we are trying to view our own profile,
        // we should make sure to send the user back to the '/' route

        let recipientId = this.props.match.params.id;

        axios.post(`/user/${recipientId}`).then((results)=>{
            console.log("this is the other profile page", results);

            this.setState({

                id: results.data.id,
                firstName: results.data.first,
                lastName: results.data.last,
                profilePicUrl: results.data.profile_pic_url,
                bio: results.data.bio

            });
        });

        
        // if (this.props.match.params.id == 34) {
        //     this.props.history.push("/");
        // }
    }


    

    render() {
        return (
            <div>
                <img
                    className="border border-primary rounded-circle shadow-lg"
                    src={this.state.profilePicUrl || "/default.jpg"}
                />
                <Card>
                    <Card.Header>User Information</Card.Header>
                    <Card.Body>
                        <Card.Title>
                            {this.state.firstName} {this.state.lastName}
                        </Card.Title>
                        <Card.Text>{this.state.bio}</Card.Text>
                    </Card.Body>
                </Card>

                <FriendshipButton
                    recipientId={this.props.match.params.id}

                />
            </div>
        );
    }
}
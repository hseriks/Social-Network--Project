import { Component } from "react";
import axios from "./axios";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from "react-bootstrap/Modal";



export default class Bio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bio : ""
        };

        this.submit = this.submit.bind(this);
    }

    componentDidMount() {
        console.log('bio mounted');
    }


    submit() {
     
        axios
            .post("/uploadbio", {bio: this.state.bio})
            .then((response) => {
                console.log("bio feedback", response.data);
                this.props.setBio(response.data);
            })
            .catch((error) => {
                console.log("error in upload", error);
            });
    }

    handleChange(e) {
        this.setState({ bio: e.target.name });
        console.log("e target name: ", e.target.name);
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log("this.state after setState: ", this.state)
        );


    }

    
    render() {
        return (
            <div className="bio">
                <Card>
                    <Card.Header>Profile information</Card.Header>
                    <Card.Body>
                        <Card.Title></Card.Title>
                        <Card.Text>{this.props.bio}</Card.Text>
                        <Button variant="primary" size="sm">
                            Update my profile information
                        </Button>
                    </Card.Body>
                </Card>

                <div className="form-group">
                    <textarea
                        name="bio"
                        onChange={(e) => this.handleChange(e)}
                        className="form-control"
                        id="exampleFormControlTextarea3"
                        rows="4"
                    ></textarea>
                    <Button size="sm" variant="primary" onClick={this.submit}>
                        Upload Bio
                    </Button>
                </div>
            </div>
        );
    }
}

import axios from "./axios";
import { Component } from "react";


export class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: "",
        };
        this.submit = this.submit.bind(this);
    }

     componentDidMount() {
        console.log('Uploader  mounted');
    }


    submit() {
        // send the data of the file we selected to the server

        const fd = new FormData();
        console.log("this.state: ", this.state.file);
        fd.append("file", this.state.file);
        console.log("fd: ", fd);
        axios
            .post("/upload", fd)
            .then((response) => {
                console.log("response", response);
                console.log("response", response.data);
                this.props.setProfilePicUrl(response.data);
            })
            .catch((error) => {
                console.log("error in upload", error);
            });
    }

    handleChange(e) {
        this.setState({ file: e.target.files[0] });
    }

    render() {
        return (
            <div className="uploader">
                <input onChange={(e) => this.handleChange(e)} type="file" />
                <button onClick={this.submit}>Upload</button>
                <p>Uploader</p>
            </div>
        );
    }
}

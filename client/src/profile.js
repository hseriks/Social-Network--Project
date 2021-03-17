

import React, {Component} from "react";
import Bio from "./Bio";
import ProfilePic from "./profile-pic";


// class Profile extends Component {

//     render(props) { 
//         return (
//             <table className="table">
//                 <thead>
//                     <tr>
//                         <th scope="col">#</th>
//                         <th scope="col">First</th>
//                         <th scope="col">Last</th>
//                         <th scope="col">Handle</th>
//                     </tr>
//                 </thead>

//                 <tbody>
//                     <tr>
//                         <th scope="row">1</th>
//                         <td>{props.firstName}</td>
//                         <td>Doe</td>
//                         <td>@smarty</td>
//                     </tr>
//                 </tbody>
//             </table>
//         );

// }
// }
 
// export default Profile ;

export default function Profile(props) {
    console.log('props in profile ', props);

    

    return (
        <>
            {/* <ProfilePic
                // Passing down props:
                // firstName={this.state.firstName}
                // lastName={this.state.lastName}
                profilePicUrl={props.profilePicUrl}
                // Passing down methods as standard functions (binding needed):
                // clickHandler={this.toggleUploader}
                style={{ height: "5vh", width: "10vw" }}
            /> */}

            <img
                style={{ height: "10", width: "10" }}
                src={props.profilePicUrl}
            ></img>

            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Username</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td>{props.firstName}</td>
                        <td>{props.lastName}</td>
                        <td>Spicy2020</td>
                    </tr>
                </tbody>
            </table>

            <Bio
                onClick={props.onBio}
                setBio={props.setBio}
                bio={props.bio}
            />
        </>
    );

}
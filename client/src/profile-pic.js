

export function ProfilePic(props) {
    console.log(props);

    return (<div>

        <img 
            className="border border-primary  shadow-lg"
            onClick={props.clickHandler}
            src={props.profilePicUrl || "/default.jpg"}
            alt ={`${props.firstName}`}
            style={{height: 80}}
        />
    </div>);
}
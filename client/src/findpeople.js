import {useState} from "react";
import {useEffect} from "react";
import axios from "./axios";

// use state is a hook

function findPeople() {

    // const [input, setUsers] = useState([]);

    const [search, updateSearch] = useState("");

    // const [load, onLoad] = useState([]);

    const [userResults, setUsersResults] = useState([]);

    console.log(search);


    useEffect(()=> {

        axios.post("/users", {search} ).then((results) => {
            console.log(results.data);
            setUsersResults(results.data);
        });


    },[search]);

    /*

useEffect(() => {
    axios.post("/users", {search} ).then((results) => {
        // console.log("testing useEffect", results.data);
        // console.log("testing useEffect first name", results.data[0].first); 
        // console.log("clean input", input); // 
        // console.log("results after axios runs", results);
        
        // creturns initial users


        setUsersResults(results.data);

        // if (results.data.length === 3) {
        //     // console.log("results after axos runs inside if", results.data);

        //     var threeUsers = []; 
        //     var userLoaded = results.data;
        //     for (var i = 0; i < userLoaded.length; i++) {
        //     console.log("my looped array", [i], userLoaded[i].first);
        //     threeUsers.unshift(userLoaded[i]);
        // }

        // console.log("three users to show", threeUsers);

        // onLoad([...load, ...threeUsers]);

        // console.log("useState 3 users after loop", load);


        // }

        // returns searched users 

    // else {
    //     var userArray = []; 
    //     var myUsers = results.data;
    //     // console.log("length array", myUsers.length); //3
    //     // console.log("myUsers Array", myUsers);
       
    //     for (var i = 0; i < myUsers.length; i++) {
    //         // console.log("my looped array", [i], myUsers[i].first);
    //         userArray.unshift(myUsers[i]);
    //     }

    //     console.log("userArray", userArray);

    //     setUsers([...input, ...userArray]);

        // console.log("updated input", input); 
        // console.log("updated input details", input[0][0].first);     
    // }

    // }).catch((err)=>{
    //     console.log("something went wrong", err);
    // })
    // return () => {

    // }
}, [search])}

*/

    // console.log("this is load", load);
    // console.log("this is input", input);

    return (
        <div>
        
            {/* <h1>Search for other people:</h1> */}
            <input className="form-control" onChange={(e) => updateSearch(e.target.value)} name="country" type="text" placeholder="Search for other profiles to connect with"></input>


            <h1>{userResults.map((input) => {
                return (
                    <div key={input.id} className="d-flex flex-row bd-highlight mb-3">
                        <img  style={{height: 150, width: 150}} className="border border-primary shadow-lg" src={input.profile_pic_url || "/default.jpg"} />
                        <p> {input.first} {input.last} </p>
                    </div>);  
            })}</h1>

            {/* <h1>
           {input.map((input, index) => {
                           
                        return (
                        <div key={index}>
                         <img src={input.profile_pic_url} />  
                         <p>{input.first} {input.last} </p>
                        </div> )
                })}
        </h1> */}
            

        </div>

    );
}

export default findPeople;
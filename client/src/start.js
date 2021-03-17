import ReactDOM from "react-dom";
import Welcome from './welcome';
import {App} from "./app";
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'font-awesome/css/font-awesomeme.css';
import {Provider} from "react-redux";
import { createStore, applyMiddleware } from 'redux';
import reduxPromise from 'redux-promise';
import { reducer } from './reducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import {init} from "./socket";



const store = createStore(
    reducer, composeWithDevTools(applyMiddleware(reduxPromise))
);


let elem;       
if (location.pathname === '/welcome') {
    elem = <Welcome />; 
} else {
    elem = <Provider store={store}><App /></Provider>;
    init(store);
}

ReactDOM.render(elem, document.querySelector("main"));


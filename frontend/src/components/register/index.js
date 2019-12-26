import React , { useState ,useContext } from "react";
import { UserContext } from "../../store/context";
import axios from "axios";
import Page1 from "./page1";
import Page2 from "./page2";

export default () => {
    const [data , setData] = useState({
        username : "",
        password1 : "",
        password2 : "",
        email : "",
        first_name : "",
        born_date : ""

    });
    const user = useContext(UserContext);

    const onFormSubmit = () => {
        const values = {
            username : data.username,
            password : data.password1,
            email : data.email,
            first_name : data.first_name,
            profile : {
                born_date : data.born_date,
            }
        }
        axios.post("/accounts/", values)
            .then(
                res => user.dispatch({ type: "LOGIN_SUCCESS" , payload : res.data}),
                err => user.dispatch({ type: "LOGIN_FAILED", payload: err.response.data }),
            )
    }

    const [page, setPage] = useState(1);

    if (page===1){
        return <Page1 data={data} setData={setData} setPage={setPage}/>
    } else if (page===2){
        return <Page2 data={data} setData={setData} setPage={setPage} onFormSubmit={onFormSubmit}/>
    }
}
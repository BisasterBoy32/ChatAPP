import React , { useState ,useContext } from "react";
import { UserContext } from "../../store/context";
import axios from "axios";
import Page1 from "./page1";
import Page2 from "./page2";
import { useStateWithCallBack } from "../../helpers";

export default ({formRef ,preBtn ,setPrevious ,setProgress}) => {
    const onFormSubmit = (data) => {
        // submit the data on after filling the second page
        if (data.submit){
            const values = {
                username: data.username,
                password: data.password1,
                email: data.email,
                first_name: data.first_name,
                profile: {
                    born_date: data.born_date,
                    icon : data.icon
                }
            }
            setProgress(true);
            axios.post("/accounts/", values)
                .then(
                    res => {
                        user.dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
                        setProgress(false);
                    },
                    err => {
                        user.dispatch({ type: "LOGIN_FAILED", payload: err.response.data });
                        setProgress(false);
                    },
                )
        }
    }

    const [data, setData] = useStateWithCallBack({
        username : "",
        password1 : "",
        password2 : "",
        email : "",
        first_name : "",
        born_date: new Date("December 17, 2000"),
        // when click on the second page submit this will be true 
        // to send the data to the backend 
        submit : false,

    }, onFormSubmit);

    const user = useContext(UserContext);

    const [page, setPage] = useState(1);

    if (page===1){
        return <Page1 data={data} setData={setData} setPage={setPage} formRef={formRef} setPrevious={setPrevious}/>
    } else if (page===2){
        return <Page2 data={data} setData={setData} setPage={setPage} formRef={formRef} preBtn={preBtn} setPrevious={setPrevious}/>
    }
}
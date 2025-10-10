"use client";

import {useEffect} from "react";
import axios from "axios";

const page = () => {
    const fetchData = async() => {
        const res = await axios.get("/api/polls");
        const data = await res.data;
        console.log("res:", res)
        return data;
    }

    useEffect(() => {
        //fetchData();
    }, [])

  return (
    <div>Polls ux page</div>
  )
}

export default page
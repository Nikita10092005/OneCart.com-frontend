import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

function Verify(){

const { token } = useParams();
const [message,setMessage] = useState("Verifying...");

useEffect(()=>{
  const verify = async()=>{
    try{
      await API.get(`/auth/verify/${token}`);
      setMessage("Email verified successfully ✅");
    }catch{
      setMessage("Verification failed ❌");
    }
  };
  verify();
},[token]);

return(
<div style={{
  display:"flex",
  justifyContent:"center",
  alignItems:"center",
  height:"100vh"
}}>
  <h2>{message}</h2>
</div>
);
}

export default Verify;

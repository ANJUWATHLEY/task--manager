import { span } from "framer-motion/client";
import React ,{useState} from "react";

function Button() {

    const [temp , SetTemp ] = useState(false)

    return(   
    <>
    <button  onClick={()=> SetTemp(!temp)} className=" p-2 bg-red-300 px-4"> click </button>
 {  temp && ( temp ? <span> heelo</span> : <span>hahs</span>)
 }
    </>
)
}

export default Button;

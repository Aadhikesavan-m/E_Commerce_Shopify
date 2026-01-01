import React from "react";
import unknownImage from "./assets/404-error-template-3.png";  
import "./unknown.css";

function UnknownFile() {

  return (
<div className="container">
   <img src={unknownImage} alt="404 Not Found" className="errorMsg"/>
</div>

  )
}

export default UnknownFile;

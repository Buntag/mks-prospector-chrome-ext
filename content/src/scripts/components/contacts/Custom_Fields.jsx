import React from 'react';
import {encodeHTML,decodeHTML} from '../common/Encode_Method';


const CustomFields = (props) => {
  if(!props.custom_fields){
    return (<div><p className="not-found">No custom fields available.</p></div>)
  }
  const Fields = props.custom_fields;
  let   customFieldsArray = [];
  jQuery.each(Fields[0],(key,value)=>{
                      customFieldsArray.push(value[0])
                      })
    const CustomField = customFieldsArray.map((field,key)=>

                  <li key={Object.keys(field)[0]} ><span className="mksph_contact_title">{Object.keys(field)[0]} :</span>  <span className="mksph_contact_value">{decodeHTML(field[Object.keys(field)[0]])}</span></li>
                )

               return (
                 <div className="csfields-contents"><ul>{CustomField}</ul></div>
               );
}


export default CustomFields;

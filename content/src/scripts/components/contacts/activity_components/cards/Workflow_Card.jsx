import React from 'react';
import Moment from 'moment';
import {encodeHTML,decodeHTML} from '../../../common/Encode_Method';


const WorkflowCard = (props) => {
      console.log('mapping : ',props.mapping);
      let displayicon = (props.mapping.icon) ? props.mapping.icon : 'mksicon-Mail';
      let _date = Moment(decodeHTML(props.activity.logTime), 'M/D/YYYY h:m a');
      let _formatedDate = {date: _date.format("DD MMM YYYY"), time: _date.format("hh:mm A")};
      return (
        <div className={`act_row ${props.mapping.color}`}>
          <span className={`icon ${displayicon}`}></span>
           <h5><a>{decodeHTML(props.activity.workflowName)}</a></h5>
           <div className="info-p">
                <div className="infotxt">
                    <strong>Subject</strong>
                    <a>{decodeHTML(props.activity.subject)}</a>
                </div>
            </div>
            <div className="btm-bar ">
                <div className="datetime">
                      <span className="this-event-type showtooltip" style={{cursor: "pointer"}} data-original-title="Click to view this event type only">
                        {props.mapping.name}
                      </span> at {_formatedDate.time}, {_formatedDate.date}
                </div>
                <div className="camp_type">
                        <span className="showtooltip all-timelineFilter" style={{cursor: "pointer"}} data-original-title="Click to view all Campaigns activities">
                        <i className="icon camp"></i>
                        Workflow</span>
                </div>
            </div>
          </div>
      )
}

export default WorkflowCard;

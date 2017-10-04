import React, {Component}
       from 'react';
import {GetTimeline}
       from './activity_components/Filter_Api'
import ActivityCard
       from './activity_components/Activity_Cards'

class ActivityTimeline extends Component{
  constructor(props){
    super(props);
    this.users_details = this.props.users_details;
    this.baseUrl = this.props.baseUrl;
    this.contact = this.props.contact;
    this.state   = {
                      activitytimeline : ''
                   }
  };

  componentWillReceiveProps(nextProps){
    if(this.contact==nextProps.contact){
      return;
    }
    console.log('Component will Recieve Props',nextProps);
    this.contact = nextProps.contact;
    this.getTimelineRequest();




  }

  getTimelineRequest(){
    GetTimeline({
                 users_details:this.users_details,
                 baseUrl      :this.baseUrl,
                 contact      :this.contact,
                 callback     :this.setActivityObj.bind(this)
               });
  }
  setActivityObj(activity){
    console.log('activity object : ',activity)
    this.setState({activitytimeline : activity});
  }

  render(){
    if(!this.props.contact && !this.props.contactnotFound){
      return (<div className="contacts-wrap">
      <div id="NoContact" className="tabcontent mksph_cardbox">
            <h3>Total Activities</h3>
              <p className="not-found">Loading...</p>
          </div>
              </div>);
    }
    if(this.props.contactnotFound){
      return (<div className="contacts-wrap">
      <div id="NoContact" className="tabcontent mksph_cardbox">
            <h3>Total Activities</h3>
              <p className="not-found">No Activity Found</p>
          </div>
              </div>);
    }
    if(!this.state.activitytimeline){
        return (
          <div className="contacts-wrap">
          <div id="NoContact" className="tabcontent mksph_cardbox">
                <h3>Total Activities</h3>
                  <p className="not-found">Loading Activity...</p>
              </div>
                  </div>
        )
    }
    return (
      <div id="Activity" className="tabcontent active">
          <div className="act_head">
              <div className="total_act">
                  <div className="act_total_count">
                      <p>{this.state.activitytimeline.totalCount}</p>
                  </div>
                  <div className="atc_headline">
                      <p>Total Activities</p>
                  </div>
                  <div className="clr"></div>
              </div>
              <div className="act_filter">
                  <p><a href="#">show all</a>  |  <a href="#">advance filter</a></p>
              </div>
              <div className="clr"></div>
          </div>
          <div className="activity_content">
                <div className="new_activities current">
                      <ActivityCard
                        contact={this.contact}
                        users_details={this.users_details}
                        baseUrl={this.baseUrl}
                        activityBatch = {this.state.activitytimeline}
                      />

                </div>
          </div>
</div>
    );

  }


}

export default ActivityTimeline;

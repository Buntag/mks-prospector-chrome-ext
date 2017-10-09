import React, {Component}
       from 'react';
import request
       from 'superagent';
import ToggleDisplay
       from 'react-toggle-display';
import ContactBasicInfo
       from './Contact_Basic_Info';
import ContactDetailInfo
       from './Contact_Details_Info';
import ActivityTimeline
       from './Activity_Timeline';


class ContactInfo extends Component{

  constructor(props){
      super(props);
      this.contact_info  = this.props.contact_email;
      this.users_details = this.props.users_details;
      this.baseUrl       = this.props.baseUrl;
      this.state = {
                    subNum        : '',
                    checkSum      : '',
                    email         : '',
                    firstName     : '',
                    lastName      : '',
                    score         : 0,
                    subscriber    : null,
                    diffEmail     : false,
                    showContacts  : true,
                    showActivity  : false,
                    contactActive : 'active',
                    activityActive: '',
                    changeInTagsView    : false,
                    changeInContactBasic: false,
                    contactnotFound  : false
                   }
  }

  componentDidUpdate(){
    console.log(this.props.contact_email);
    if(this.users_details.length == 0 || !this.props.contact_email){
      this.state['subscriber']=null;
      this.state['firstName']=null;
      this.state['lastName']=null;
      this.state['contactnotFound']=false;
      this.state['email'] ='';
      return;
    }


    if(this.state.diffEmail){
      this.searchEmailInMks(this.props.contact_email);

    }else if(this.state.changeInTagsView || this.state.changeInContactBasic){
      this.getSubscriberDetails();
    }

  }

  componentWillReceiveProps(nextProps){
    //this.loadSubscriptionData(nextProps.subscriptionId);
    if(nextProps.contact_email && this.state.email != nextProps.contact_email){
        this.setState({diffEmail : true,email : nextProps.contact_email})
    }else{
        this.setState({diffEmail : false})
    }
  }
  searchEmailInMks(email){
    var searchUrl = this.baseUrl
                    +'/io/subscriber/getData/?BMS_REQ_TK='
                    + this.users_details[0].bmsToken +'&type=getSAMSubscriberList&offset=0&searchValue='
                    +email+'&orderBy=lastActivityDate&ukey='+this.users_details[0].userKey
                    +'&isMobileLogin=Y&userId='+this.users_details[0].userId

    request
          .get(searchUrl)
           .set('Content-Type', 'application/x-www-form-urlencoded')
           .then((res) => {
              if(res.status==200){
                let jsonResponse =  JSON.parse(res.text);

                if (jsonResponse[0] == "err"){
                    if(jsonResponse[1] == "SESSION_EXPIRED"){
                      alert(jsonResponse[1]);
                      jQuery('.mksph_logout').trigger('click');
                    }
                  return false;
                }

                if(parseInt(jsonResponse.totalCount) > 0){

                    this.setState({
                                  subNum   : jsonResponse.subscriberList[0].subscriber1[0].subNum,
                                  checkSum : jsonResponse.subscriberList[0].subscriber1[0].checkSum,
                                  email    : jsonResponse.subscriberList[0].subscriber1[0].email,
                                  score    : jsonResponse.subscriberList[0].subscriber1[0].score,
                                  diffEmail: false,
                                });
                    this.getSubscriberDetails();
                    //this.forceUpdate()

                }else{
                  this.setState({
                    contactnotFound : true,
                    diffEmail: false
                  });
                }
              }
            });
  }


  getSubscriberDetails(){
    var searchUrl = this.baseUrl
                    +'/io/subscriber/getData/?BMS_REQ_TK='
                    + this.users_details[0].bmsToken +'&type=getSubscriber&subNum='
                    +this.state.subNum+'&ukey='+this.users_details[0].userKey
                    +'&isMobileLogin=Y&userId='+this.users_details[0].userId
    var _this = this;
                    request
                          .get(searchUrl)
                           .set('Content-Type', 'application/x-www-form-urlencoded')
                           .then((res) => {
                              if(res.status==200){
                                let jsonResponse =  JSON.parse(res.text);
                                _this.setState({
                                  subscriber : jsonResponse,
                                  changeInTagsView : false,
                                  changeInContactBasic : false,
                                  firstName     : jsonResponse.firstName,
                                  lastName      : jsonResponse.lastName,
                                  contactnotFound : false
                                })
                                console.log(jsonResponse);

                              }else{
                                alert(jsonResponse[1])
                              }
                            });
  }

  updateBasicContactInfo(){
        console.log('Time to get parameter and send for update');
        this.setState({changeInContactBasic:true});
  }
  /*=re-render on change state of tags=*/
  changeTagView(){
    this.setState({
      changeInTagsView : true
    })
  }

  render(){
        if(!this.props.contact_email){
          return <div>Loading...</div>
        }
        return (
                   <div className="s_contact_found_wraper">
                             <ContactBasicInfo
                               contactInfo={this.state}
                               contact={this.state.subscriber}
                               updateContactHappened={this.updateBasicContactInfo.bind(this)}
                               baseUrl={this.baseUrl}
                               users_details={this.users_details}
                              />
                          <div className="scf_tab_wrap">
                              <div className="scf_tab">
                                  <div className="tab">
                                    <button className={`tablinks ripple ${this.state.contactActive}`} onClick={switchTab => { this.setState({showContacts:true,showActivity:false,activityActive:'',contactActive:'active'})} }>Contact</button>
                                    <button className={`tablinks ripple ${this.state.activityActive}`} onClick={switchTab => { this.setState({showContacts:false,showActivity:true,activityActive:'active',contactActive:''}) } } id="defaultOpen">Activity</button>
                                    <div className="score">
                                      <i className="icon score"></i>
                                      +
                                      <span className="score-value">{this.state.score}</span>
                                    </div>
                                  </div>

                                  <div className="tab_content_wrap">
                                      <ToggleDisplay show={this.state.showContacts}>
                                        <ContactDetailInfo
                                          contact={this.state.subscriber}
                                          users_details={this.users_details}
                                          baseUrl={this.baseUrl}
                                          changeInTagsView={this.changeTagView.bind(this)}
                                          contactnotFound={this.state.contactnotFound}
                                          />
                                      </ToggleDisplay>
                                    <ToggleDisplay show={this.state.showActivity}>
                                      <ActivityTimeline
                                        contact={this.state.subscriber}
                                        users_details={this.users_details}
                                        baseUrl={this.baseUrl}
                                      />
                                    </ToggleDisplay>
                                  </div>
                              </div>
                            </div>
                        </div>
              );


  }
}

export default ContactInfo;

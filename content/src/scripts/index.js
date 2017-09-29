import React, {Component}
       from 'react';
import {render}
       from 'react-dom';
import {Provider}
       from 'react-redux';
import {Store}
       from 'react-chrome-redux';
import ToggleDisplay
       from 'react-toggle-display';

const gmail = new Gmail();
//import App       from './components/app/App';
import LoginForm   from './components/loginform/LoginForm';
import GmailEmail  from './components/gmaillist/Email_List';
import ContactInfo from './components/contacts/Contact_Info';
import SearchContacts from './components/contacts/Search_Contacts';
import Menu from './components/menu/menu';

const anchor = document.createElement('div');
anchor.id = 'rcr-anchor';


document.body.insertBefore(anchor, document.body.childNodes[0]);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users_details    : [],
      gmail_email_list : [],
      showLogin        : true,
      gmailEmails      : false,
      showContacts     : false,
      appPanel         : false,
      selectedEmail    : null,
      chromeExObj      : null,
      baseUrl          : 'https://test.bridgemailsystem.com/pms'
    };
    this.onEmailSelect = this.onEmailSelect.bind(this);
    this.toggleTopMenu = this.toggleTopMenu.bind(this);
    this.hideTopMenu = this.hideTopMenu.bind(this);
  }

  componentWillMount() {
    let _this = this;
    gmail.observe.on("load", function() {
      console.log('check position : ', gmail.check.is_inside_email());
      // if email is open
      console.log('Hello,', gmail.get.user_email());
      if (gmail.check.is_inside_email()) {
        var id = gmail.get.email_id();
        var emailDetails = gmail.get.email_data(id);
        _this.setState({gmail_email_list : emailDetails.people_involved});
        //console.log('current emails in email : ',emailDetails.people_involved);
      }

      //on open of email
      gmail.observe.on("open_email", (id, url, body, xhr) => {
        console.log("id:", id, "url:", url, 'body', body, 'xhr', xhr);
        var emailDetails = gmail.get.email_data(id);
        console.log(emailDetails);
        _this.setState({gmail_email_list : emailDetails.people_involved});
        console.log(emailDetails.people_involved);
      });
    });

  }


  onEmailSelect(selectedEmailC){
    console.log('Selected email from child : '+selectedEmailC);
    //this.setState({selectedEmail : selectedEmailC});
     this.setState(() => {
                return { selectedEmail : selectedEmailC,showContacts: true,gmailEmails: false };
                });
  }


  toggleTopMenu (event){
    jQuery("#lists_option").animate({width: 'toggle'})
    event.stopPropagation()
  }

 hideTopMenu (event){
   jQuery("#lists_option").hide();
   event.stopPropagation()
 }

  render() {
    return (
      <div className="appWrapper">
        <div className="mksiconplugin" onClick={showLogin => this.setState({appPanel:true})}>
          <a href="#" className="closepanel">
            <span className="mksicon-MakesbridgeBot">
            </span>
            </a>
        </div>
    <ToggleDisplay show={this.state.appPanel}>
      <div className="makesbridge_plugin full_s" onClick={this.hideTopMenu}>
          <div className="mkspanel">
            <div className="mkspanelhead">
                    <div className="mksph_row">
                        <div className={this.state.showLogin ? "hidden" : "mksph_menu ripple" } onClick={this.toggleTopMenu} >
                            <a><span className="mksph_icon_menu" aria-hidden="true" data-icon="&#xe90a;"></span></a>
                        </div>

                        <div className="mksph_logo">
                            <div className="logo">
                                <center>
                                    <a href="http://www.makesbridge.com/">
                                    <div className="mks_logo_img"></div>
                                </a>
                                </center>

                            </div>
                        </div>
                        <div
                          className="mksph_close ripple"
                          onClick={showLogin => this.setState({appPanel:false})}
                          >
                        <a href="#"><span className="mksph_icon_close" aria-hidden="true" data-icon="&#xe915;"></span></a>
                        </div>
                        <div className="clr"></div>
                    </div>
                </div>
        <Menu />
        <ToggleDisplay show={this.state.showLogin}>

        <LoginForm
                users_details={this.state.users_details}
                baseUrl = {this.state.baseUrl}
                toggleShowLogin={showLogin => this.setState({
                                    showLogin:!this.state.showLogin,
                                    gmailEmails:!this.state.gmailEmails
                                  })}
        />
        </ToggleDisplay>
        <ToggleDisplay show={this.state.gmailEmails}>
        <GmailEmail
          onEmailSelect = {this.onEmailSelect}
          gmail_email_list={this.state.gmail_email_list}
          users_details={this.state.users_details}
          chromeExObj = {this.state.chromeExObj}
          />

        </ToggleDisplay>
        <ToggleDisplay show={this.state.showContacts}>
        <ContactInfo
          baseUrl = {this.state.baseUrl}
          users_details={this.state.users_details}
          contact_email = {this.state.selectedEmail}
        />
        </ToggleDisplay>
        </div>
      </div>
      </ToggleDisplay>
      </div>
    );
  }
}

render(
  <App/>, document.getElementById('rcr-anchor'));

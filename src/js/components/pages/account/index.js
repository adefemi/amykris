import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import $ from 'jquery'
import jwt_decode from 'jwt-decode';

import {actionWithoutData, actionWithData, authorizeWithData, authorizeWithoutData, setContent} from '../../redux/actions';


import NoImage from '../../../../assets/images/No_Image_Available.jpg'

import Footer from '../common/footer';
import Pagination from '../common/pagination';
import HeaderContact from '../common/header-contact';
import Header from '../common/header'
import ImageLoader from '../common/imageLoader'
import Subloader from '../common/subLoader'
import Verification from '../common/verification'

const bgImage = "http://localhost/testimages/planet-2120004_1280.jpg";
import AccountSlider from './components/slider';

const initialState = {
  activeUser: null, userProfile: null, userAddress: null, userNotification: null, errorState: false, activeAddress: null,
};

class Account extends React.Component{

    constructor(props) {
        super(props);

        this.state = initialState;
    }

    componentWillMount(){
        if(!this.props.userStatus){
            this.props.history.push('/sign-in');
        }
        this.verifyContent(this.props);
        this.componentWillReceiveProps(this.props);
    }

    verifyContent(props){
        let url = "";
        if(!props.users.hasOwnProperty('userProfile')){
            url = this.props.backEndLinks.userProfile;
            this.props.actionWithoutData("get", url).then(
                res => {
                    props.users.userProfile = res.data;
                    this.props.setContent("SET_USER_CONTENT",this.props.users);
                },
                err => {
                    this.setState({errorState:true})
                }
            )
        }
        if(!props.users.hasOwnProperty('userAddress')){
            url = this.props.backEndLinks.userAddress;
            this.props.actionWithoutData("get", url).then(
                res => {
                    props.users.userAddress = res.data;
                    this.props.setContent("SET_USER_CONTENT",this.props.users);
                },
                err => {
                    this.setState({errorState:true})
                }
            )
        }
        if(!props.users.hasOwnProperty('userNotification')){
            url = this.props.backEndLinks.userNotification;
            this.props.actionWithoutData("get", url).then(
                res => {
                    props.users.userNotification = res.data;
                    this.props.setContent("SET_USER_CONTENT",this.props.users);
                },
                err => {
                    this.setState({errorState:true})
                }
            )
        }
    }

    componentWillReceiveProps(props){
        if(props.userStatus !== this.state.activeUser){
            this.setState({activeUser: props.userStatus})
        }
        if(!props.userStatus){
            this.props.history.push('/')
        }

        if(props.users.hasOwnProperty('userProfile')){
            if(props.users.userProfile !== this.state.userProfile){
                this.setState({userProfile: props.users.userProfile});
                this.state.userProfile = props.users.userProfile
            }
        }
        if(props.users.hasOwnProperty('userAddress')){
            if(props.users.userAddress !== this.state.userAddress){
                this.setState({userAddress: props.users.userAddress});
                this.state.userAddress = props.users.userAddress;
                this.getAddress();
            }
            else{
                this.getAddress();
            }
        }
        if(props.users.hasOwnProperty('userNotification')){
            if(props.users.userNotification !== this.state.userNotification){
                this.setState({userNotification: props.users.userNotification});
                this.state.userNotification = props.users.userNotification
            }
        }
    }

    getPurchase(){
        let _notification = [...this.state.userNotification];
        let _activeNotification = _notification.filter(o => o.user_id === this.state.activeUser.id && parseInt(o.type) === 1);
        let _arrayContent = [];
        let count = _activeNotification.length;
        count > 5 ? count = 5 : null;
        for(let i = 0; i < count; i++){
            _arrayContent.push(
                <li key={i}><div dangerouslySetInnerHTML={{__html: _activeNotification[i].content}} /> <span>{_activeNotification[i].created_on}</span></li>
            )
        }
        return _arrayContent;
    }

    getNotification(){
        let _notification = [...this.state.userNotification];
        let _activeNotification = _notification.filter(o => o.user_id === this.state.activeUser.id && parseInt(o.type) === 0);
        let _arrayContent = [];
        let count = _activeNotification.length;
        count > 5 ? count = 5 : null;
        for(let i = 0; i < count; i++){
            _arrayContent.push(
                <li key={i}><div dangerouslySetInnerHTML={{__html: _activeNotification[i].content}} /> <span>{_activeNotification[i].created_on}</span></li>
            )
        }
        return _arrayContent;
    }

    getAddress(){
        let _address = [...this.state.userAddress];
        let _activeAddress = _address.filter(o => o.user_id === this.props.userStatus.id);
        this.setState({activeAddress: _activeAddress});
    }

    getActiveName(){
        let _profile = [...this.state.userProfile];
        let _activeProfile = _profile.filter(o => o.user_id === this.state.activeUser.id);

        if(_activeProfile[0].first_name === "null" || _activeProfile[0].last_name === "null"){
            return this.state.activeUser.username
        }
        else{
            return _activeProfile[0].first_name+" "+_activeProfile[0].last_name
        }
    }

    render(){
        const {history} = this.props;
        return(
            <div className={'wrapper'}>
                <Verification/>
                <HeaderContact/>
                {
                    this.state.activeUser === null? <Subloader/> :
                        <div>
                            <AccountSlider
                                history={history}
                                context={'How are you doing today?'}
                                userProfile={this.state.userProfile === null ?null: this.getActiveName()}
                            />


                            <div className={'account-container'}>
                                <h3>Account Panel</h3>
                                <div className={'account-contents'}>
                                    <div className={'content-card-purchase'}>
                                        <div className={'content-head'}>Recent Purchase</div>
                                        <div className={'list'}>
                                            {
                                                this.state.userNotification === null ? <Subloader/> :
                                                    this.getPurchase().length < 1 ? <h4>No purchase as been made!</h4>:
                                                        this.getPurchase()
                                            }
                                        </div>
                                    </div>
                                    <div className={'content-card'}>
                                        <div className={'content-head'}>User Information</div>
                                        <div className={'info-content'}>
                                            <p>{this.state.activeUser.username}</p>
                                            <p>{this.state.activeUser.email}</p>
                                            <div className={'controls'}>
                                                <Link to={'/account/password'}>Change Password</Link>
                                                <Link to={'/account/profile'}>Update Profile</Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={'content-card'}>
                                        <div className={'content-head'}>Contact Information</div>
                                        <div className={'info-content'}>
                                            {
                                                this.state.activeAddress === null ? <Subloader/> :
                                                    this.state.activeAddress[0].phone_no === null || this.state.activeAddress[0].address === null ?
                                                        <div className={'controls'}>
                                                            <Link to={'/account/address'}>Address Contact</Link>
                                                        </div> :
                                                    <div>
                                                        {this.state.activeAddress[0].phone_no !== null ? <p>{this.state.activeAddress[0].phone_no}</p> : null}
                                                        {this.state.activeAddress[0].address !== null ? <p>{this.state.activeAddress[0].address.replace(/<\/?[^>]+(>|$)/g, "")}</p> : null}
                                                        <div className={'controls'}>
                                                            <Link to={'/account/address'}>Update Contact</Link>
                                                        </div>
                                                    </div>
                                            }
                                        </div>
                                    </div>
                                    <div className={'content-card'}>
                                        <div className={'content-head'}>Notifications</div>
                                        <div className={'list'}>
                                            {
                                                this.state.userNotification === null ? <Subloader/> :
                                                    this.getNotification().length < 1 ? <h4>No notification available</h4>:
                                                        this.getNotification()
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                }

                <Footer/>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return({
        userStatus: state.userStatus, users: state.userContent, backEndLinks: state.backEndLinks,
    })
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        actionWithData: actionWithData, authorizeWithData: authorizeWithData, authorizeWithoutData: authorizeWithoutData,
        actionWithoutData: actionWithoutData, setContent: setContent,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);
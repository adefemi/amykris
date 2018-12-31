import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import $ from 'jquery'
import jwt_decode from 'jwt-decode';
import {spinner6} from 'react-icons-kit/icomoon/spinner6'

import {actionWithoutData, actionWithData, authorizeWithData, authorizeWithoutData, setContent} from '../../redux/actions';


import AccountSlider from './components/slider';

import Footer from '../common/footer';
import HeaderContact from '../common/header-contact';
import Header from '../common/header'
import Toast from '../common/toast'
import Subloader from '../common/subLoader'

const bgImage = "http://localhost/testimages/planet-2120004_1280.jpg";

const initialState = {
    userNotification: null, userProfile: null, active: 0, activeUser: null, activeNotification: null,
    max:5, current: 1, totalpages: 0, Loadmore: false,
};

class AccountNotification extends React.Component{
    constructor(props) {
        super(props);

        this.state = initialState
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
    }

    componentWillReceiveProps(props){
        if(props.userStatus !== this.state.activeUser){
            this.setState({activeUser: props.userStatus})
        }
        if(!props.userStatus){
            this.props.history.push('/')
        }

        if(props.users.hasOwnProperty('userNotification')){
            if(props.users.userNotification !== this.state.userNotification){
                this.setState({userNotification: props.users.userNotification});
                this.state.userNotification = props.users.userNotification
                this.getActiveNotification()
            }
            else{
                this.getActiveNotification()
            }
        }
        if(props.users.hasOwnProperty('userProfile')){
            if(props.users.userProfile !== this.state.userProfile){
                this.setState({userProfile: props.users.userProfile});
                this.state.userProfile = props.users.userProfile
            }
        }
    }

    getActiveNotification(){
        let _notification = [...this.state.userNotification];
        let _activeNotification = _notification.filter(o => o.user_id === this.props.userStatus.id && parseInt(o.type) === this.state.active);
        this.setState({activeNotification: _activeNotification});
    }

    getNotifications(){
        let _notification = [...this.state.activeNotification];
        this.state.totalpages= Math.ceil(_notification.length / this.state.max);
        let ListCount = this.state.current * this.state.max;
        _notification.length < ListCount ? ListCount = _notification.length : null;
        let notificationArray = [];
        for(let i = 0; i < ListCount; i++){
            notificationArray.push(
                <div key={i} className={_notification[i].status < 1 ?"notes-card error" : "notes-card success"}>
                    <p><div dangerouslySetInnerHTML={{__html: _notification[i].content}} /></p>
                    <div className={'time'}>{_notification[i].created_on}</div>
                </div>
            )
        }
        return notificationArray
    }

    changeContent(){
        this.setState({active: this.state.active < 1 ? 1 : 0});
        this.state.active = this.state.active < 1 ? 1 : 0;
        this.getActiveNotification();
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

    loadmore(){
        this.setState({Loadmore:true});
        setTimeout(() => {
            this.setState({current:this.state.current + this.state.max, Loadmore: false});
        }, 500);
    }

    render(){
        const {history} = this.props;
        return(
            <div className={'wrapper'}>
                <HeaderContact/>
                <AccountSlider
                    history={history}
                    context={'View both updates from admin and puchase information...'}
                    userProfile={this.state.userProfile === null ?null: this.getActiveName()}
                />

                <div className={'account-container'}>
                    <div className={'breadcrum'}>
                        <li><Link to={'/account'}>Home</Link></li>
                        <li className={'active'}>Notification</li>
                    </div>
                    <h3>Notifications <span onClick={() => this.changeContent()}>{this.state.active < 1 ? 'Purchase' : 'Notification'}</span></h3>
                    {
                        this.state.userNotification === null || this.state.activeNotification === null ? <Subloader/>:
                            this.state.activeNotification.length < 1 ? <h4>No notification available</h4>:
                                <div className={'account-notes'}>

                                    {this.getNotifications()}
                                </div>
                    }
                    {
                        this.state.current >= this.state.totalpages ? null :
                            this.state.Loadmore ? <button className={'notify'}><Icon className={'rotate'} icon={spinner6}/></button> :
                                <button onClick={() => this.loadmore()} className={'notify'}>Load More</button>
                    }
                </div>
                <Footer/>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return({
        userStatus: state.userStatus, users : state.userContent, backEndLinks: state.backEndLinks,
    })
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        actionWithData: actionWithData, authorizeWithData: authorizeWithData, authorizeWithoutData: authorizeWithoutData,
        actionWithoutData: actionWithoutData, setContent: setContent,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountNotification);
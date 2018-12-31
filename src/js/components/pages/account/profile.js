import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import $ from 'jquery'
import jwt_decode from 'jwt-decode';
import {spinner5} from 'react-icons-kit/icomoon/spinner5'

import {actionWithoutData, actionWithData, authorizeWithData, authorizeWithoutData, setContent} from '../../redux/actions';


import {processError} from '../common/miscellaneous'

import Footer from '../common/footer';
import HeaderContact from '../common/header-contact';
import Header from '../common/header'
import Toast from '../common/toast'
import Subloader from '../common/subLoader'

const bgImage = "http://localhost/testimages/planet-2120004_1280.jpg";
import AccountSlider from './components/slider';

const initialState = {
    activeUser: null, userProfile: null, errorState: false, activeProfile: null,
    first_name: "", last_name: "", gender: "", dob: "", loading: false,
    toastType: "error", toastContent: "", toastStatus: false,
};

class AccountProfile extends React.Component{

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

    closeToast(){
        this.setState({toastStatus: false})
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
                this.getProfile();
            }
            else{
                this.getProfile();
            }
        }
    }

    getProfile(){
        let _profile = [...this.state.userProfile];
        let _activeProfile = _profile.filter(o => o.user_id === this.props.userStatus.id);
        this.setState({activeProfile: _activeProfile, first_name:_activeProfile[0].first_name, last_name:_activeProfile[0].last_name
            , gender:_activeProfile[0].gender, dob:_activeProfile[0].dob});
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

    handleSubmit(access = null){
        let url = this.props.backEndLinks.userProfile+"/"+this.state.activeUser.id;
        let data = {"first_name": this.state.first_name, "last_name": this.state.last_name,
            "gender": this.state.gender, "dob": this.state.dob};
        let payload = new FormData();
        Object.entries(data).forEach(
            ([key, value]) => {
                payload.append(key, value)
            }
        );
        let accessToken = access;
        access === null ? accessToken = JSON.parse(localStorage.getItem('amykris-user')).access: null;
        this.props.authorizeWithData("put", url, payload, accessToken).then(
            (res) => {
                this.setState({toastContent: "Account profile was updated successfully",
                    toastType:"success", loading: false, toastStatus: true, password: ""});
                let usersProfiles = this.props.users.userProfile;
                usersProfiles = usersProfiles.filter(o => o.user_id !== this.state.activeUser.id);
                usersProfiles.push(res.data[0]);
                this.props.users.userProfile = usersProfiles;
                this.props.setContent("SET_USER_CONTENT",this.props.users);
            },
            (err) => {
                let errorObj = processError(err, this.props.backEndLinks.refresh);
                errorObj.type === 3 ? this.handleSubmit(errorObj.content) :
                    this.setState({toastContent: errorObj.content, toastType:"error", loading: false, toastStatus: true});
            }
        )
    }

    render(){
        const {history} = this.props;
        return(
            <div className={'wrapper'}>
                <HeaderContact/>
                <Toast closeToast={this.closeToast.bind(this)}
                       toastStatus={this.state.toastStatus}
                       type={this.state.toastType}
                       content={this.state.toastContent}/>
                <AccountSlider
                    history={history}
                    context={'How about you update your profile to the best reliable information you see fit'}
                    userProfile={this.state.userProfile === null ?null: this.getActiveName()}
                />

                <div className={'account-container'}>
                    <div className={'breadcrum'}>
                        <li><Link to={'/account'}>Home</Link></li>
                        <li className={'active'}>Profile</li>
                    </div>
                    <h3>Update Profile</h3>
                    <div className={'account-data'}>
                        {
                            this.state.activeUser === null || this.state.activeProfile === null ? <Subloader/> :
                                <form>
                                    <div className={'form-group'}>
                                        <label htmlFor="">Username</label>
                                        <input type="text" value={this.state.activeUser.username} disabled={true}/>
                                    </div>
                                    <div className={'form-group'}>
                                        <label htmlFor="">Email</label>
                                        <input type="email" value={this.state.activeUser.email} disabled={true}/>
                                    </div>
                                    <div className={'form-group'}>
                                        <label htmlFor="">First Name</label>
                                        <input value={this.state.first_name} onChange={(e) => this.setState({first_name: e.target.value})} type="text"/>
                                    </div>
                                    <div className={'form-group'}>
                                        <label htmlFor="">Last Name</label>
                                        <input value={this.state.last_name} onChange={(e) => this.setState({last_name: e.target.value})} type="text"/>
                                    </div>
                                    <div className={'input-inline'}>
                                        <div className={'form-group-inline'}>
                                            <label htmlFor="male">Male</label>
                                            <input name='gender' checked={this.state.gender === "male"} onChange={() => this.setState({gender: "male"})} type="radio"/>
                                        </div>
                                        <div className={'form-group-inline'}>
                                            <label htmlFor="female">Female</label>
                                            <input name='gender' checked={this.state.gender === "female"} onChange={() => this.setState({gender: "female"})} type="radio"/>
                                        </div>
                                    </div>
                                    <div className={'form-group'}>
                                        <label htmlFor="">Birthday</label>
                                        <input type="date" value={this.state.dob} onChange={(e) => this.setState({dob: e.target.value})} />
                                    </div>

                                    {
                                        this.state.loading ? <button className={'disabled'} disabled={true}><Icon className={'rotate'} icon={spinner5}/></button> :
                                            <button className={'update'} onClick={(e) => [e.preventDefault(), this.setState({loading:true}), this.handleSubmit()]}>Update</button>
                                    }
                                </form>
                        }
                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(AccountProfile);
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
    old_password: "", new_password: "", confirm_password: "", loading: false,
    toastType: "error", toastContent: "", toastStatus: false,
};

class AccountPassword extends React.Component{

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
                this.state.userProfile = props.users.userProfile;
            }
        }
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
        let url = this.props.backEndLinks.passwordReset+"/"+this.state.activeUser.id;
        let data = {"old_password": this.state.old_password, "new_password": this.state.new_password,
            "confirm_password": this.state.confirm_password};
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
                this.setState({toastType:"success", toastStatus: false});
                setTimeout(() => {
                    this.setState({toastContent: "Password has been updated successfully",
                         loading: false, toastStatus: true, new_password: "", old_password: "", confirm_password: ""});
                }, 500)

            },
            (err) => {
                let errorObj = processError(err, this.props.backEndLinks.refresh);
                this.setState({toastType:"error", toastStatus: false});
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
                    context={'Update your password...'}
                    userProfile={this.state.userProfile === null ?null: this.getActiveName()}
                />

                <div className={'account-container'}>
                    <div className={'breadcrum'}>
                        <li><Link to={'/account'}>Home</Link></li>
                        <li className={'active'}>Change Password</li>
                    </div>
                    <h3>Change Password</h3>
                    <div className={'account-data'}>
                        <form>
                            <div className={'form-group'}>
                                <label htmlFor="">Old Password</label>
                                <input value={this.state.old_password} onChange={(e) => this.setState({old_password: e.target.value})} type="password"/>
                            </div>
                            <div className={'form-group'}>
                                <label htmlFor="">New Password</label>
                                <input value={this.state.new_password} onChange={(e) => this.setState({new_password: e.target.value})} type="password"/>
                            </div>
                            <div className={'form-group'}>
                                <label htmlFor="">Confirm Password</label>
                                <input value={this.state.confirm_password} onChange={(e) => this.setState({confirm_password: e.target.value})} type="password"/>
                            </div>
                            {
                                this.state.loading ? <button className={'disabled'} disabled={true}><Icon className={'rotate'} icon={spinner5}/></button> :
                                    <button className={'update'} onClick={(e) => [e.preventDefault(), this.setState({loading:true}), this.handleSubmit()]}>Update</button>
                            }
                        </form>
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

export default connect(mapStateToProps, mapDispatchToProps)(AccountPassword);
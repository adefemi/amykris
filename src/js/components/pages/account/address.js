import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import $ from 'jquery'
import jwt_decode from 'jwt-decode';
import {spinner5} from 'react-icons-kit/icomoon/spinner5'

import {actionWithoutData, actionWithData, authorizeWithData, authorizeWithoutData, setContent} from '../../redux/actions';
import {states_lga} from '../data/states_lga'


import {processError} from '../common/miscellaneous'

import Footer from '../common/footer';
import HeaderContact from '../common/header-contact';
import Header from '../common/header'
import Toast from '../common/toast'
import Subloader from '../common/subLoader'

const bgImage = "http://localhost/testimages/planet-2120004_1280.jpg";
import AccountSlider from './components/slider';
const initialState = {
    activeUser: null, userAddress: null, errorState: false, activeAddress: null,
    phone_no: "", state: "", lga: "", address: "", loading: false, userProfile: null,
    toastType: "error", toastContent: "", toastStatus: false, activeState: 0, activeLocal: 0
};

class AccountAddress extends React.Component{

    constructor(props) {
        super(props);

        this.state = initialState;
        console.log(states_lga)
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
        if(props.users.hasOwnProperty('userProfile')){
            if(props.users.userProfile !== this.state.userProfile){
                this.setState({userProfile: props.users.userProfile});
                this.state.userProfile = props.users.userProfile
            }
        }
    }

    getAddress(){
        let _address = [...this.state.userAddress];
        let _activeAddress = _address.filter(o => o.user_id === this.props.userStatus.id);
        let _activeState = 1;
        let _activelga = 1;
        _activeAddress[0].state !== "null" ? _activeState = states_lga.map((o, i) => o.state === _activeAddress[0].state).indexOf(true):null;
        _activeAddress[0].lga !== "null" ? _activelga = states_lga[_activeState].lgas.map((o, i) => o === _activeAddress[0].lga).indexOf(true):null;
        this.setState({activeAddress: _activeAddress, phone_no:_activeAddress[0].phone_no, state:_activeAddress[0].state === "null" ? states_lga[_activeState].state : _activeAddress[0].state
            , lga:_activeAddress[0].lga === "null" ? states_lga[_activeState].lgas[_activelga] : _activeAddress[0].lga, address:_activeAddress[0].address, activeState: _activeState, activeLocal: _activelga});
    }

    handleSubmit(access = null){
        let url = this.props.backEndLinks.userAddress+"/"+this.state.activeUser.id;
        let data = {"phone_no": this.state.phone_no, "state": this.state.state,
            "lga": this.state.lga, "address": this.state.address};
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
                this.setState({toastContent: "Account address was updated successfully",
                    toastType:"success", loading: false, toastStatus: true, password: ""});
                let userAddress = this.props.users.userAddress;
                userAddress = userAddress.filter(o => o.user_id !== this.state.activeUser.id);
                userAddress.push(res.data[0]);
                this.props.users.userAddress = userAddress;
                this.props.setContent("SET_USER_CONTENT",this.props.users);
            },
            (err) => {
                let errorObj = processError(err, this.props.backEndLinks.refresh);
                errorObj.type === 3 ? this.handleSubmit(errorObj.content) :
                    this.setState({toastContent: errorObj.content, toastType:"error", loading: false, toastStatus: true});
            }
        )
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
                <HeaderContact/>
                <Toast closeToast={this.closeToast.bind(this)}
                       toastStatus={this.state.toastStatus}
                       type={this.state.toastType}
                       content={this.state.toastContent}/>
                <AccountSlider
                    history={history}
                    context={'You can update your address information to match up your current location'}
                    userProfile={this.state.userProfile === null ?null: this.getActiveName()}
                />

                <div className={'account-container'}>
                    <div className={'breadcrum'}>
                        <li><Link to={'/account'}>Home</Link></li>
                        <li className={'active'}>Address</li>
                    </div>
                    <h3>Update Address</h3>
                    <div className={'account-data'}>
                        {
                            this.state.activeUser === null || this.state.activeAddress === null ? <Subloader/> :
                                <form>
                                    <div className={'form-group'}>
                                        <label htmlFor="">Phone Number</label>
                                        <input value={this.state.phone_no} onChange={(e) => this.setState({phone_no: e.target.value})} type="number"/>
                                    </div>

                                    <div className={'form-group'}>
                                        <label htmlFor="">State</label>
                                        <select value={this.state.activeState}
                                                onChange={(e) => [this.setState({state: states_lga[e.target.value].state, activeState: e.target.value})]}>
                                            {
                                                states_lga.map((o, i) => (
                                                    <option key={i} value={i}>{o.state}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className={'form-group'}>
                                        <label htmlFor="">Local Government</label>
                                        <select value={this.state.activeLocal}
                                                onChange={(e) => this.setState({lga: states_lga[this.state.activeState].lgas[e.target.value], activeLocal: e.target.value})}>
                                            {
                                                states_lga[this.state.activeState].lgas.map((o, i) => (
                                                    <option key={i} value={i}>{o}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className={'form-group'}>
                                        <label htmlFor="">Location Address</label>
                                        <textarea value={this.state.address === null ? "" : this.state.address} onChange={(e) => this.setState({address: e.target.value})} rows={15} placeholder={'describe location'}>

                                </textarea>
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
        userStatus: state.userStatus, users: state.userContent, backEndLinks: state.backEndLinks,
    })
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        actionWithData: actionWithData, authorizeWithData: authorizeWithData, authorizeWithoutData: authorizeWithoutData,
        actionWithoutData: actionWithoutData, setContent: setContent,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountAddress);
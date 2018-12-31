import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import jwt_decode from 'jwt-decode'

import Index from './pages/homepage/index'
import Products from './pages/servicepage/index'
import ProductExplorer from './pages/servicepage/explorer'
import Blog from './pages/blogpage/index'
import BlogExplorer from './pages/blogpage/explorer'
import Contact from './pages/contactpage/contact'
import Signin from './pages/authentication/signin'
import Register from './pages/authentication/register'
import Account from './pages/account/index'
import AccountPassword from './pages/account/password'
import AccountProfile from './pages/account/profile'
import AccountAddress from './pages/account/address'
import AccountNotification from './pages/account/notification'
import PayStack from './pages/common/paystack'

import MainLoader from './pages/common/Mainloader';

import {actionWithoutData, actionWithData, authorizeWithData, authorizeWithoutData, setContent} from './redux/actions';

const initialState = {
    loading: true, about: null, sliders: null, service: null, pageSetting: null, productHightlight: null, users: null, errorStatus: false,
};

class Router extends React.Component{
    constructor(props) {
        super(props);

        this.state = initialState;

        setTimeout(() => {
            this.setState({loading: false})
        }, 1000)
    }

    componentWillMount(){
        this.verifyauth();
        this.getContents();
    }

    verifyauth() {
        let auth = localStorage.getItem('amykris-user');

        if(auth !== null){
            let data = JSON.parse(auth);
            let exp = jwt_decode(data.refresh).exp;
            let currentTime = Math.floor(Date.now() / 1000);
            if(currentTime > exp){
                localStorage.removeItem('amykris-user');
            }
            else{
                let parsedData = jwt_decode(data.access);
                let url = this.props.backEndLinks.user+parsedData.id+'/';
                this.props.actionWithoutData("get", url).then(
                    (rem) => {
                        if(parseInt(rem.data.is_staff) !== 1){
                            this.props.setContent("SET_USER_ACTIVE", rem.data);
                        }
                        else{
                            localStorage.removeItem('amykris-user');
                            this.props.setContent("SET_ADMIN_ACTIVE", false);
                        }
                    },
                    (err) => {
                        localStorage.removeItem('amykris-user');
                        this.props.setContent("SET_USER_ACTIVE", false);
                    }
                );
            }

        }
        else{
            localStorage.removeItem('amykris-user');
            this.props.setContent("SET_USER_ACTIVE", false);
        }
    }

    getContents(){
        this.setState({errorStatus: false});
        this.state.errorStatus = false;

        //Get about Content
        let url = this.props.backEndLinks.about;
        this.props.actionWithoutData('get', url).then(
            (res) => {
                this.props.setContent("SET_ABOUT_CONTENT", res.data);
                this.setState({about: res.data})
            },
            (err) => {
                this.setState({errorStatus:true})
            }
        );

        //Get Service Content
        url = this.props.backEndLinks.service;
        this.props.actionWithoutData('get', url).then(
            (res) => {
                this.props.setContent("SET_SERVICE_CONTENT", res.data);
                this.setState({service: res.data})
            },
            (err) => {
                this.setState({errorStatus:true})
            }
        );

        //Get Slider Content
        url = this.props.backEndLinks.slider;
        this.props.actionWithoutData('get', url).then(
            (res) => {
                this.props.setContent("SET_SLIDER_CONTENT", res.data);
                this.setState({sliders: res.data})
            },
            (err) => {
                this.setState({errorStatus:true})
            }
        );

        //Get PageSetting Images Content
        url = this.props.backEndLinks.pageSettingImage;
        this.props.actionWithoutData('get', url).then(
            (res) => {
                this.props.pageSetting.images = res.data;
                this.props.setContent("SET_PAGESETTING_CONTENT", this.props.pageSetting);
                this.setState({pageSetting: res.data})
            },
            (err) => {
                this.setState({errorStatus:true})
            }
        );

        //Get PageSetting Socials Content
        url = this.props.backEndLinks.pageSettingSocial;
        this.props.actionWithoutData('get', url).then(
            (res) => {
                this.props.pageSetting.socials = res.data;
                this.props.setContent("SET_PAGESETTING_CONTENT", this.props.pageSetting);
                this.setState({pageSetting: res.data})
            },
            (err) => {
                this.setState({errorStatus:true})
            }
        );
        //Get PageSetting Contact Content
        url = this.props.backEndLinks.pageSettingContact;
        this.props.actionWithoutData('get', url).then(
            (res) => {
                this.props.pageSetting.contact = res.data;
                this.props.setContent("SET_PAGESETTING_CONTENT", this.props.pageSetting);
                this.setState({pageSetting: res.data})
            },
            (err) => {
                this.setState({errorStatus:true})
            }
        );

        //Get Product Content
        url = this.props.backEndLinks.productHighlight;
        this.props.actionWithoutData('get', url).then(
            (res) => {
                this.props.product.highlight = res.data;
                this.props.setContent("SET_PRODUCT_CONTENT", this.props.product);
                this.setState({productHightlight: res.data})
            },
            (err) => {
                this.setState({errorStatus:true})
            }
        );
        //Get User Content
        url = this.props.backEndLinks.user;
        this.props.actionWithoutData('get', url).then(
            (res) => {
                this.props.users.users = res.data;
                this.props.setContent("SET_USER_CONTENT", this.props.users);
                this.setState({users: res.data})
            },
            (err) => {
                this.setState({errorStatus:true})
            }
        );
    }
    render(){
        return(
            this.state.loading || this.state.about === null || this.state.service === null || this.state.pageSetting === null
            || this.state.productHightlight === null || this.state.users === null || this.state.sliders === null
                ? <MainLoader/> :
                this.state.errorStatus? <h2>Network error</h2> :
            <BrowserRouter>
                <Switch>
                    <Route exact path={'/'} component={Index}/>
                    <Route exact path={'/products'} component={Products}/>
                    <Route exact path={'/products/:slug'} component={ProductExplorer}/>
                    <Route exact path={'/blog'} component={Blog}/>
                    <Route exact path={'/blog/:slug'} component={BlogExplorer}/>
                    <Route exact path={'/contact'} component={Contact}/>
                    <Route exact path={'/sign-in'} component={Signin}/>
                    <Route exact path={'/sign-up'} component={Register}/>
                    <Route exact path={'/account'} component={Account}/>
                    <Route exact path={'/account/password'} component={AccountPassword}/>
                    <Route exact path={'/account/profile'} component={AccountProfile}/>
                    <Route exact path={'/account/address'} component={AccountAddress}/>
                    <Route exact path={'/account/notification'} component={AccountNotification}/>
                    <Route exact path={'/payment-portal/:query?'} component={PayStack}/>
                </Switch>
            </BrowserRouter>
        )
    }
}

function mapStateToProps(state) {
    return({
        userStatus: state.userStatus, about: state.aboutContent, backEndLinks: state.backEndLinks, users: state.userContent,
        pageSetting: state.pageSettingContent, product: state.productContent
    })
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        actionWithData: actionWithData, authorizeWithData: authorizeWithData, authorizeWithoutData: authorizeWithoutData,
        actionWithoutData: actionWithoutData, setContent: setContent,
    }, dispatch)
}



export default connect(mapStateToProps, mapDispatchToProps)(Router);
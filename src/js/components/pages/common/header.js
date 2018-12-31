import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit';
import {more_2} from 'react-icons-kit/ikons/more_2'
import {user} from 'react-icons-kit/ikons/user'
import {iosSearch} from 'react-icons-kit/ionicons/iosSearch'
import {spinner5} from 'react-icons-kit/icomoon/spinner5'
import {androidClose} from 'react-icons-kit/ionicons/androidClose'
import proptypes from 'prop-types'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import $ from 'jquery'
import jwt_decode from 'jwt-decode';

import {actionWithoutData, actionWithData, authorizeWithData, authorizeWithoutData, setContent} from '../../redux/actions';

const initialState = {
  sideBarState: false, activeLink: "/", userActive: false, loggingOut: false,
};


class HomeHeader extends React.Component{
    constructor(props) {
        super(props);

        this.state = initialState;
        $('html').css('overflow-y','auto');

        this.state.activeLink = window.location.pathname;
    }

    componentWillMount(){
        this.componentWillReceiveProps(this.props)
    }

    componentWillReceiveProps(props){
        if(props.userStatus !== this.state.userActive){
            this.setState({userActive: props.userStatus});
        }
    }

    hideSearch(){
        $('.search-trigger').blur();
    }

    toggleSideBar(){
        this.setState({sideBarState: !this.state.sideBarState});
        let sideBarCon = $('.sidebar-content');
        let htmlHolder = $('html');
        sideBarCon.hasClass('closed') ? sideBarCon.removeClass('closed') : sideBarCon.addClass('closed');
        sideBarCon.hasClass('closed') ? htmlHolder.css('overflow-y','auto') : htmlHolder.css('overflow-y','hidden');
    }

    loadpage(link){
        this.props.history.push(link);
    }

    logOutFunc(){
        this.setState({loggingOut:true});
        setTimeout(() => {
            localStorage.removeItem('amykris-user');
            this.props.setContent("SET_USER_ACTIVE", false);
            // this.props.history.push('/sign-in');
        }, 1000)
    }


    render(){
        return(
            <div className={'adefemi-header'}>
                <div className={'links'}>
                    <div className={'nav-brand'}>amyKris</div>
                    <div className={'nav-links'}>
                        <Link to={'/'} className={this.state.activeLink === '/' ? 'active' : ''}>Home</Link>
                        <Link to={'/products'} className={this.state.activeLink === '/products' ? 'active' : ''}>Products</Link>
                        <Link to={'/blog'} className={this.state.activeLink === '/blog' ? 'active' : ''}>Blog</Link>
                        <Link to={'/contact'} className={this.state.activeLink === '/contact' ? 'active' : ''}>Contact</Link>
                        {
                            this.state.userActive ?
                                <button className={'drop-trigger active'}>
                                    <Icon icon={user}/>
                                    <div className={'dropdown'}>
                                        <li><Link to={'/account'}>Account</Link></li>
                                        <li><Link to={'/account/notification'}>Notifications</Link></li>
                                        {
                                            this.state.loggingOut ? <li>Signing out&nbsp;<Icon className={'rotate'} icon={spinner5}/></li>:
                                                <li onClick={() => this.logOutFunc()}>Sign out</li>
                                        }

                                    </div>
                                </button>:
                                <button className={'drop-trigger'} onClick={() => this.loadpage('/sign-in')}><Icon icon={user}/></button>
                        }



                    </div>
                    <div className={'header-sidebar'}>
                        <button className={'controller'} onClick={() => this.toggleSideBar()}>
                            <Icon icon={this.state.sideBarState ? androidClose : more_2}/>
                        </button>
                        <div className={'sidebar-content closed'}>
                            <div className={'close'} onClick={() => this.toggleSideBar()}><Icon icon={androidClose}/></div>
                            <div className={'title'}>Menu</div>
                            <Link to={'/'} className={this.state.activeLink === '/' ? 'active' : ''}>Home</Link>
                            <Link to={'/products'} className={this.state.activeLink === '/products' ? 'active' : ''}>Products</Link>
                            <Link to={'/blog'} className={this.state.activeLink === '/blog' ? 'active' : ''}>Blog</Link>
                            <Link to={'/contact'} className={this.state.activeLink === '/contact' ? 'active' : ''}>Contact</Link>

                            <div className={'title'}>Sub-menu</div>
                            <Link to={'/sign-in'}><Icon icon={user}/>&nbsp;&nbsp;&nbsp;&nbsp;Sign into Account</Link>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

HomeHeader.propTypes = {
    history: proptypes.object.isRequired
};

function mapStateToProps(state) {
    return({
        userStatus: state.userStatus, backEndLinks: state.backEndLinks,
    })
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        actionWithData: actionWithData, authorizeWithData: authorizeWithData, authorizeWithoutData: authorizeWithoutData,
        actionWithoutData: actionWithoutData, setContent: setContent,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader);
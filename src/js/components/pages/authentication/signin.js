import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit'
import {user} from 'react-icons-kit/icomoon/user'
import {lock} from 'react-icons-kit/icomoon/lock'
import {login} from 'react-icons-kit/iconic/login'
import {spinner6} from 'react-icons-kit/icomoon/spinner6'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import $ from 'jquery'
import jwt_decode from 'jwt-decode';

import {actionWithoutData, actionWithData, authorizeWithData, authorizeWithoutData, setContent} from '../../redux/actions';
import {processError} from '../common/miscellaneous'
import Toast from '../common/toast'

const initialState = {
    username: "", password:"",  loading: false,
    toastType: "error", toastContent: "", toastStatus: false,
};

class SignIn extends React.Component{
    constructor(props) {
        super(props);

        this.state = initialState

    }

    componentWillMount(){
        if(this.props.userStatus){
            this.props.history.push('/');
        }
    }

    closeToast(){
        this.setState({toastStatus: false})
    }

    handleSubmit(){
        let contents = {username:this.state.username, password:this.state.password};
        let payload = new FormData();
        Object.entries(contents).forEach(
            ([key, value]) => {
                payload.append(key, value)
            }
        );
        let url = this.props.backEndLinks.auth;
        this.props.actionWithData("post", url, payload).then(
            (res) =>{
                let parsedData = jwt_decode(res.data.access);
                url = this.props.backEndLinks.user+parsedData.id+'/';
                this.props.actionWithoutData("get", url).then(
                    (rem) => {
                        if(parseInt(rem.data.is_staff) !== 1){
                            localStorage.setItem('amykris-user', JSON.stringify(res.data));
                            this.props.setContent("SET_USER_ACTIVE", rem.data);
                            this.props.history.push('/');
                        }
                        else{
                            this.setState({toastContent: "Invalid username or password",
                                toastType:"error", loading: false, toastStatus: true});
                        }
                    },
                    (err) => {
                        let errorObj = processError(err, this.props.backEndLinks.refresh);
                        this.setState({toastContent: errorObj.content,
                            toastType:"error", loading: false, toastStatus: true});
                    }
                );


            },
            (err) =>{
                let errorObj = processError(err, this.props.backEndLinks.refresh);
                this.setState({toastContent: errorObj.content,
                    toastType:"error", loading: false, toastStatus: true});
            }
        )
    };
    render(){
        return(
            <div className={'auth-container'}>
                <Toast closeToast={this.closeToast.bind(this)}
                       toastStatus={this.state.toastStatus}
                       type={this.state.toastType}
                       content={this.state.toastContent}/>
                <Link to={'/'}><div className={'auth-logo'}>amyKris Logo</div></Link>
                <form className={'auth-form'}>
                    <div className={'form-group'}>
                        <label htmlFor="username">Username</label>
                        <div className={'input-group'}>
                            <Icon icon={user}/>
                            <input value={this.state.username} onChange={(e) => this.setState({username: e.target.value})} type="text"/>
                        </div>
                    </div>
                    <div className={'form-group'}>
                        <label htmlFor="password">Password</label>
                        <div className={'input-group'}>
                            <Icon icon={lock}/>
                            <input value={this.state.password} onChange={(e) => this.setState({password: e.target.value})} type="password"/>
                        </div>
                    </div>
                    {
                        this.state.loading ? <button disabled={true}><Icon className={'rotate'} icon={spinner6}/></button> :
                            <button onClick={(e) => [e.preventDefault(), this.setState({loading:true}), this.handleSubmit()]}>Sign in</button>
                    }
                </form>

                <div className={'auth-content'}>
                    <p>Don't have an account yet? <Link to={'/sign-up'}>Register Here!!!</Link></p>
                    <p><Link to={'/'}>Forgot Password?</Link></p>
                </div>
            </div>
        )
    }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
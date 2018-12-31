import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit'
import {user} from 'react-icons-kit/icomoon/user'
import {lock} from 'react-icons-kit/icomoon/lock'
import {mail3} from 'react-icons-kit/icomoon/mail3'
import {withLine} from 'react-icons-kit/entypo/withLine'
import {eye} from 'react-icons-kit/entypo/eye'
import {spinner6} from 'react-icons-kit/icomoon/spinner6'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import $ from 'jquery'

import {actionWithoutData, actionWithData, authorizeWithData, authorizeWithoutData, setContent} from '../../redux/actions';
import {processError} from '../common/miscellaneous'
import Toast from '../common/toast'

const initialState = {
    passwordView: false, email: "", username:"", password:"", is_active:0, loading: false,
    toastType: "error", toastContent: "", toastStatus: false,
};

class Register extends React.Component{
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
        let url = this.props.backEndLinks.user;
        let data = {"email": this.state.email, "username": this.state.username,
            "password": this.state.password, "is_active": this.state.is_active, };
        let payload = new FormData();
        Object.entries(data).forEach(
            ([key, value]) => {
                payload.append(key, value)
            }
        );
        this.props.actionWithData("post", url, payload).then(
            (res) => {
                this.setState({toastContent: "Account was created successfully. Also, a verification code as been sent to your email!",
                    toastType:"success", loading: false, toastStatus: true, password: ""});
                let users = this.props.users.users;
                users.push(res.data);
                this.props.setContent("SET_USER_CONTENT",this.props.users);
            },
            (err) => {
                let errorObj = processError(err, this.props.backEndLinks.refresh);
                this.setState({toastContent: errorObj.content,
                    toastType:"error", loading: false, toastStatus: true});
            }
        )
    }

    render(){
        return(
            <div className={'auth-container'}>
                <div className={'auth-logo'}>logo</div>
                <Toast closeToast={this.closeToast.bind(this)}
                       toastStatus={this.state.toastStatus}
                       type={this.state.toastType}
                       content={this.state.toastContent}/>
                <form className={'auth-form'}>
                    <div className={'form-group'}>
                        <label htmlFor="email">Email</label>
                        <div className={'input-group'}>
                            <Icon icon={mail3}/>
                            <input value={this.state.email} onChange={(e) => this.setState({email:e.target.value})} type="email"/>
                        </div>
                    </div>
                    <div className={'form-group'}>
                        <label htmlFor="username">Username</label>
                        <div className={'input-group'}>
                            <Icon icon={user}/>
                            <input value={this.state.username} onChange={(e) => this.setState({username:e.target.value})} type="text"/>
                        </div>
                    </div>
                    <div className={'form-group'}>
                        <label htmlFor="password">Password</label>
                        <div className={'input-group'}>
                            <Icon icon={lock}/>
                            <input value={this.state.password} onChange={(e) => this.setState({password:e.target.value})}
                                   type={this.state.passwordView ? "text" : "password"}/>
                            {
                                this.state.passwordView ?
                                    <Icon onClick={() => this.setState({passwordView:false})} icon={withLine}/> :
                                    <Icon onClick={() => this.setState({passwordView:true})} icon={eye}/>
                            }


                        </div>
                    </div>
                    {
                        this.state.loading ? <button disabled={true}><Icon className={'rotate'} icon={spinner6}/></button> :
                            <button onClick={(e) => [e.preventDefault(), this.setState({loading:true}), this.handleSubmit()]}>Create Account</button>
                    }

                </form>

                <div className={'auth-content'}>
                    <p>Already have an account? <Link to={'/sign-in'}>Sign In...</Link></p>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Register);
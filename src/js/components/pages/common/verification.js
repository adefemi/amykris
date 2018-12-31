import React from 'react';
import {Icon} from 'react-icons-kit';
import {arrows_question} from 'react-icons-kit/linea/arrows_question'
import {arrows_circle_check} from 'react-icons-kit/linea/arrows_circle_check'
import {arrows_circle_remove} from 'react-icons-kit/linea/arrows_circle_remove';
import proptypes from 'prop-types'
import {spinner5} from 'react-icons-kit/icomoon/spinner5'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import $ from 'jquery'

import {actionWithoutData, actionWithData, authorizeWithData, authorizeWithoutData, setContent} from '../../redux/actions';
import {processError} from '../common/miscellaneous'

const initialState = {
    verification: "", loading: false, activeVerification: null,
};


class Verification extends React.Component{
    constructor(props) {
        super(props);

        this.state = initialState;
    }

    componentWillMount(){
        this.verifyList();
    }

    verifyList(){
        let url = "";
        url = this.props.backEndLinks.userVerification+"/"+this.props.userStatus.id;
        this.props.actionWithoutData("get", url).then(
            res => {
                this.setState({activeVerification: res.data});
                res.data.length > 0 ? setTimeout(() => {this.openVerification()}, 2000) : null
            },
            err => {
                setTimeout(() => {this.verifyList()}, 10000)
            }
        )
    }

    handleSubmit(access = null){
        if(this.state.verification !== this.state.activeVerification[0].verification){
            setTimeout(() => {
                this.setState({loading: false, verification: ""});
                this.successVerification("error");
            }, 1000);
            return;
        }
        let accessToken = access;
        access === null ? accessToken = JSON.parse(localStorage.getItem('amykris-user')).access: null;
        let url = this.props.backEndLinks.userVerification+"/"+this.props.userStatus.id;
        this.props.authorizeWithoutData("delete", url, accessToken).then(
            res => {
                setTimeout(() => {
                    this.setState({loading: false, verification: ""});
                    this.successVerification("success");
                    setTimeout(() => {
                        this.closeVerification()
                    }, 5000)
                }, 1000);
            },
            err => {
                let errorObj = processError(err, this.props.backEndLinks.refresh);
                this.handleSubmit(errorObj.content)
            }
        )

    }

    openVerification(){
        let Verifier = $('.verification-wrapper');
        Verifier.removeClass('close')
    }

    successVerification(type){
        let Verifier = $('.verification-wrapper');
        type === "success" ? Verifier.addClass('success') : Verifier.addClass('error')
    }

    closeVerification(){
        let Verifier = $('.verification-wrapper');
        Verifier.addClass('close')
    }

    restartVerification(){
        let Verifier = $('.verification-wrapper');
        Verifier.removeClass('error');
    }

    render(){
        return(
            <div className={'verification-wrapper close'}>
                <div className={'container'}>
                    <div className={'bg'}><Icon size={200} icon={arrows_question}/></div>
                    <div className={'bg-success'}>
                        <Icon size={130} icon={arrows_circle_check}/>
                        <div className={'text'}>Verification Successful.</div>
                        <button onClick={() => this.closeVerification()}>Close</button>
                    </div>
                    <div className={'bg-error'}>
                        <Icon size={100} icon={arrows_circle_remove}/>
                        <div className={'text'}>Verification Failed. Invalid Verification Number. Note that verification number has been sent to your registration email.</div>
                        <button onClick={() => this.restartVerification()}>Try Again</button>
                    </div>
                    <div className={'verification-content'}>
                        <h3>Account Verification</h3>
                        <form onSubmit={(e) => [e.preventDefault(),this.setState({loading:true}), this.handleSubmit()]}>
                            <input value={this.state.verification} onChange={(e) => this.setState({verification: e.target.value})} type="text" placeholder={'Enter verification number!'} required/>
                            {
                                this.state.loading ? <button disabled={true}><Icon className={'rotate'} size={30} icon={spinner5}/></button> :
                                    <button  type={'submit'}>Verify</button>
                            }
                        </form>
                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Verification);
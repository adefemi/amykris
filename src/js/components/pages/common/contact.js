import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit';
import {mail} from 'react-icons-kit/icomoon/mail'
import {phone} from 'react-icons-kit/icomoon/phone'
import {user} from 'react-icons-kit/icomoon/user'
import {facebook} from 'react-icons-kit/icomoon/facebook'
import {instagram} from 'react-icons-kit/icomoon/instagram'
import {twitter} from 'react-icons-kit/icomoon/twitter'
import {youtube} from 'react-icons-kit/icomoon/youtube'
import {googlePlus} from 'react-icons-kit/icomoon/googlePlus'
import {spinner6} from 'react-icons-kit/icomoon/spinner6'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import $ from 'jquery'

import {actionWithoutData, actionWithData, authorizeWithData, authorizeWithoutData, setContent} from '../../redux/actions';
import Subloader from '../common/subLoader'
import {FormatMoney, processError} from '../common/miscellaneous'

import Toast from '../common/toast'
import Goup from '../common/go_up'

const initialState = {
    socials: null, contact: null, errorState: false, toastType: "error", toastContent: "", toastStatus: false,
    fulname: '', email: '', phone: '', content: '', loading: false
};

class Contact extends React.Component{
    constructor(props) {
        super(props);

        this.state = initialState;
    }

    componentWillMount(){
        this.componentWillReceiveProps(this.props);
    }

    closeToast(){
        this.setState({toastStatus: false})
    }

    componentWillReceiveProps(props){

        if(props.pageSetting.hasOwnProperty('socials')){
            if(props.pageSetting.socials !== this.state.socials){
                this.setState({socials: props.pageSetting.socials});
                this.state.socials = props.pageSetting.socials;
                console.log(props.pageSetting.socials);
            }
        }
        if(props.pageSetting.hasOwnProperty('contact')){
            if(props.pageSetting.contact !== this.state.contact){
                this.setState({contact: props.pageSetting.contact});
                this.state.contact = props.pageSetting.contact;
            }
        }
    }

    getSocial(){
        let socials = [...this.state.socials];
        let array = [];
        socials.map((o,i)=> {
            array.push(
                <ol key={i}><a href={o.link} target={'_blank'}><span><Icon icon={o.title === 'facebook' ? facebook :
                    o.title === 'instagram' ? instagram :o.title === 'twitter' ? twitter :
                        o.title === 'youtube' ? youtube : o.title === 'googlePlus' ? googlePlus : mail}/></span></a></ol>
            )
        });
        return array
    }

    submitMessage(){
        let highlight = {fulname: this.state.fulname, email: this.state.email, phone: this.state.phone, content: this.state.content};
        let payload = new FormData();
        Object.entries(highlight).forEach(
            ([key, value]) => {
                payload.append(key, value)
            }
        );
        let url = this.props.backEndLinks.sendMessage;
        this.props.actionWithData("post", url, payload).then(
            (res) => {
                this.setState({toastType:"success", toastStatus: false});
                setTimeout(() => {
                    this.setState({toastContent: res.data.success, loading: false, toastStatus: true, content: ""});
                }, 500)
            },
            (err) => {
                let errorObj = processError(err, this.props.backEndLinks.refresh);
                this.setState({toastType:"error", toastStatus: false});
                setTimeout(() => {
                    this.setState({toastContent: errorObj.content,
                        toastType:"error", loading: false, toastStatus: true});
                }, 200);
            }
        )
    }

    render(){
        return(
            <div className={'adefemi-contact'}>
                <Goup/>
                <Toast closeToast={this.closeToast.bind(this)}
                       toastStatus={this.state.toastStatus}
                       type={this.state.toastType}
                       content={this.state.toastContent}/>
                <div className={'contact-inner'}>
                    <div className={'top'}>
                        {
                            this.state.contact === null ? <Subloader/> :
                                <div>
                                    <div className={'title'}>Contact</div>
                                    <div className={'sub-title'} dangerouslySetInnerHTML={{__html: this.state.contact[0].description}} />
                                    <div className={'contact-item'}>
                                        <div className={'head'}>Emails</div>
                                        <li><span><Icon icon={mail}/></span> {this.state.contact[0].email}</li>
                                        <li><span><Icon icon={mail}/></span> {this.state.contact[0].email2}</li>
                                    </div>
                                    <div className={'contact-item'}>
                                        <div className={'head'}>Phones</div>
                                        <li><span><Icon icon={phone}/></span> {this.state.contact[0].telephone}</li>
                                        <li><span><Icon icon={phone}/></span> {this.state.contact[0].telephone2}</li>
                                    </div>
                                    <div className={'contact-item'}>
                                        <div className={'head'}>Address</div>
                                        <div className={'sub-title'} dangerouslySetInnerHTML={{__html: this.state.contact[0].location}} />
                                    </div>
                                    <div className={'contact-item'}>
                                        <div className={'head'}>Social Handles</div>
                                        {
                                            this.state.socials === null ? <h4>Loading</h4> :
                                                this.state.socials.length < 1 ? <h4>None found...</h4> :
                                                    <div className={'social-handles'}>
                                                        {
                                                            this.getSocial()
                                                        }
                                                    </div>
                                        }
                                    </div>
                                </div>
                        }
                    </div>
                    <div className={'bottom'}>
                        <div className={'title'}>Send a message</div>
                        <form id={'contact-form'}>
                            <div className={'form-group'}>
                                <span><Icon icon={user}/></span>
                                <input value={this.state.fulname} onChange={(e) => this.setState({fulname: e.target.value})}
                                       type="text" placeholder={'Full Name'}/>
                            </div>
                            <div className={'form-group'}>
                                <span><Icon icon={mail}/></span>
                                <input type="email" value={this.state.email} onChange={(e) => this.setState({email: e.target.value})}
                                       placeholder={'Email Address'}/>
                            </div>
                            <div className={'form-group'}>
                                <span><Icon icon={phone}/></span>
                                <input type="tel" value={this.state.phone} onChange={(e) => this.setState({phone: e.target.value})}
                                       placeholder={'Phone'}/>
                            </div>
                            <textarea rows="10" value={this.state.content} onChange={(e) => this.setState({content: e.target.value})}
                                      placeholder={"Write message"}>

                            </textarea>
                            {
                                this.state.loading ? <button className={'controlButt'}>Sending <Icon className={'rotate'} icon={spinner6}/></button> :
                                    <button className={'controlButt'} onClick={(e) => [this.setState({loading: true}),e.preventDefault(), this.submitMessage()]} >Send</button>
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
        userStatus: state.userStatus, pageSetting: state.pageSettingContent, backEndLinks: state.backEndLinks,
    })
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        actionWithData: actionWithData, authorizeWithData: authorizeWithData, authorizeWithoutData: authorizeWithoutData,
        actionWithoutData: actionWithoutData, setContent: setContent,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Contact);

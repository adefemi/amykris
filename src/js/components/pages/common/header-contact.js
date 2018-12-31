import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit';
import {facebook} from 'react-icons-kit/icomoon/facebook'
import {instagram} from 'react-icons-kit/icomoon/instagram'
import {twitter} from 'react-icons-kit/icomoon/twitter'
import {youtube} from 'react-icons-kit/icomoon/youtube'
import {googlePlus} from 'react-icons-kit/icomoon/googlePlus'
import {connect} from 'react-redux'

const initialState = {
    socials: null, contact: null, errorState: false
};
class HeaderContact extends React.Component{
    constructor(props) {
        super(props);

        this.state = initialState;
    }

    componentWillMount(){
        this.componentWillReceiveProps(this.props);
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
    render(){
        return(
            this.state.contact ===null ? <h4>Loading</h4> :
                <div className={'header-links'}>
                    <div className={'number'}>
                        <ol><Link to={'/'}>{this.state.contact[0].telephone}</Link></ol>
                        <ol><Link to={'/'}>{this.state.contact[0].telephone2}</Link></ol>
                    </div>
                    <div className={'socials'}>
                        {
                            this.state.socials === null ? null :
                                this.state.socials.length < 1 ? null :
                                    this.getSocial()
                        }
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

export default connect(mapStateToProps)(HeaderContact);
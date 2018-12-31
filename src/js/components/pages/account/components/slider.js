import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit';
import proptypes from 'prop-types';
import {connect} from 'react-redux'

import Header from '../../common/header'

const initialState = {
    images: null, errorStatus: false,
};


class AccountSlider extends React.Component{
    constructor(props) {
        super(props);

        this.state = initialState;
    }

    componentWillMount(){
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(props){
        if(props.pageSetting.hasOwnProperty('images')){
            if(props.pageSetting.images !== this.state.images){
                this.setState({images: props.pageSetting.images});
                this.state.images = props.pageSetting.images;
            }
        }
    }

    getBackground(){
        if(this.state.images === null) return;
        let _images = [...this.state.images];
        let _activeImages = _images.filter(o => o.title === "account");
        if(_activeImages.length < 1){
            return null
        }
        else {
            return {'backgroundImage':'url("'+_activeImages[0].coverpic+'")'};
        }
    }
    render(){
        const {history, userProfile, context} = this.props;
        return(
            <div className={'account-header'} style={this.state.images !== null ? this.getBackground() : null}>
                <div className={'bgcover'}> </div>
                <Header history={history}/>
                <div className={'account-info'}>
                    <h3>Hello <span>{this.props.userProfile === null ? 'Loading' : this.props.userProfile}</span></h3>
                    <p>{this.props.context}</p>
                </div>
            </div>
        )
    }
}

AccountSlider.propTypes = {
    history: proptypes.object.isRequired,
    userProfile: proptypes.string.isRequired,
    context: proptypes.string.isRequired,
};
function mapStateToProps(state) {
    return({
        pageSetting: state.pageSettingContent, backEndLinks: state.backEndLinks,
    })
}

export default connect(mapStateToProps)(AccountSlider);
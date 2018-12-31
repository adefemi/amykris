import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import $ from 'jquery'

import {actionWithoutData, actionWithData, authorizeWithData, authorizeWithoutData, setContent} from '../../../redux/actions';
import Subloader from '../../common/subLoader'

const initialState = {
    highlights : null, activeHighlight: null, users: null,
};


class HomeFeed extends React.Component{
    constructor(props) {
        super(props);

        this.state = initialState;
    }

    componentWillMount(){
        this.componentWillReceiveProps(this.props);
    }

    setActiveHighlight(){
        let highlight = [...this.state.highlights];
        let _activeHighlight = highlight.filter(o => parseInt(o.canview) === 1 );
        this.setState({activeHighlight: _activeHighlight})
    }

    componentWillReceiveProps(props){
        if(props.products.hasOwnProperty('highlight')){
            if(props.products.highlight !== this.state.highlights){
                this.setState({highlights: props.products.highlight});
                this.state.highlights = props.products.highlight;
                this.setActiveHighlight();
            }
            else{
                this.setActiveHighlight();
            }
        }
        if(props.users.hasOwnProperty('users')){
            if(props.users.users !== this.state.users){
                this.setState({users: props.users.users});
                this.state.users = props.users.users;
            }
        }
    }

    getHighlight(){
        let _highlights = [...this.state.activeHighlight];
        let _highlightsArray = [];
        let _userList = [...this.state.users];
        let count = _highlights.length;
        count > 3 ? count = 3 : null;

        for(let i = 0; i< count; i++){
            let activeUser = _userList.filter(p => p.id === _highlights[i].user_id);
            _highlightsArray.push(
                <div key={i} className={'feedback-item'}>
                    <div className={'username'}>{activeUser[0].username}</div>
                    <div className={'comment'}>{_highlights[i].comment.replace(/<\/?[^>]+(>|$)/g, "")}</div>
                    <div className={'time'}><span>Added: </span> {_highlights[i].created_on}</div>
                </div>
            )
        }

        return _highlightsArray
    }
    render(){
        return(
            <div className={'feedback-wrapper'}>
                <div className={'feedback-contain'}>
                    <div className={'heading'}>Costumer's Feedbacks</div>
                    {
                        this.state.activeHighlight === null || this.state.users === null ? <Subloader/> :
                            this.state.activeHighlight.length < 1 ? <h4 style={{'color':'white'}}>No Feedback found available</h4>:
                                <div className={'feedback-container'}>
                                    {this.getHighlight()}
                                </div>
                    }

                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return({
        products: state.productContent, users: state.userContent, backEndLinks: state.backEndLinks,
    })
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        actionWithData: actionWithData, authorizeWithData: authorizeWithData, authorizeWithoutData: authorizeWithoutData,
        actionWithoutData: actionWithoutData, setContent: setContent,
    }, dispatch)
}



export default connect(mapStateToProps, mapDispatchToProps)(HomeFeed);
import React from 'react';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import $ from 'jquery'

import {actionWithoutData, actionWithData, authorizeWithData, authorizeWithoutData, setContent} from '../../redux/actions';
import Subloader from './subLoader'

const initialState = {
    pagesetting: null,
};


class Footer extends React.Component{

    constructor(props) {
        super(props);

        this.state = initialState;
    }

    componentWillMount(){
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(props){
        if(props.pageSetting !== this.state.pagesetting){
            this.state.pagesetting = props.pageSetting;
            this.setState({pagesetting: props.pageSetting});
        }
    }

    render(){
        return(
            <div className={'footer'}>
                {
                    this.state.pagesetting === null ? <h5>Loading</h5> :
                        <div  dangerouslySetInnerHTML={{__html: this.state.pagesetting.contact[0].copyright}} />
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return({
        pageSetting: state.pageSettingContent, backEndLinks: state.backEndLinks,
    })
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        actionWithData: actionWithData, authorizeWithData: authorizeWithData, authorizeWithoutData: authorizeWithoutData,
        actionWithoutData: actionWithoutData, setContent: setContent,
    }, dispatch)
}



export default connect(mapStateToProps, mapDispatchToProps)(Footer);
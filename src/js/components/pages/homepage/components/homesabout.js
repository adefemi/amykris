import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {actionWithoutData, actionWithData, authorizeWithData, authorizeWithoutData, setContent} from '../../../redux/actions';
import Subloader from '../../common/subLoader'

const initialState = {
  aboutContent : null
};

class HomeAbout extends React.Component{
    constructor(props) {
        super(props);

        this.state = initialState
    }

    componentWillMount(){
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(props){
        if(props.about !== this.state.aboutContent){
            this.state.aboutContent = props.about;
            this.setState({aboutContent: props.about});
        }
    }

    render(){
        return(
            <div className={'about-wrapper'}>
                <div className={'about-contain'}>
                    {
                        this.state.aboutContent === null ? <Subloader/> :
                            <div>
                                <div className={'heading'}>About AmyKris</div>
                                <div dangerouslySetInnerHTML={{__html: this.state.aboutContent.statement}} />
                                <div className={'about-content-control'}>
                                    <ul>
                                        <div className={'header'}>Mission</div>
                                        <div dangerouslySetInnerHTML={{__html: this.state.aboutContent.mission}} />
                                    </ul>
                                    <ul>
                                        <div className={'header'}>Vision</div>
                                        <div dangerouslySetInnerHTML={{__html: this.state.aboutContent.vision}} />
                                    </ul>
                                </div>
                            </div>
                    }

                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return({
        about: state.aboutContent, backEndLinks: state.backEndLinks,
    })
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        actionWithData: actionWithData, authorizeWithData: authorizeWithData, authorizeWithoutData: authorizeWithoutData,
        actionWithoutData: actionWithoutData, setContent: setContent,
    }, dispatch)
}



export default connect(mapStateToProps, mapDispatchToProps)(HomeAbout);

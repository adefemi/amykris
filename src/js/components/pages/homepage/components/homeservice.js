import React from 'react';
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import $ from 'jquery'

import {actionWithoutData, actionWithData, authorizeWithData, authorizeWithoutData, setContent} from '../../../redux/actions';
import Subloader from '../../common/subLoader'

const initialState = {
    serviceContent : null
};
import ImageLoader from '../../common/imageLoader'

class HomeService extends React.Component{
    constructor(props) {
        super(props);

        this.state = initialState;
    }

    componentWillMount(){
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(props){
        if(props.services !== this.state.serviceContent){
            this.state.serviceContent = props.services;
            this.setState({serviceContent: props.services});
        }
    }

    getServices(){
        let _services = [...this.state.serviceContent];
        let _serviceArray = [];

        _services.map((o,i) => {
            _serviceArray.push(
                <div key={i} className={'service-item'}>
                    <div className={'cover'}><ImageLoader/><img src={o.coverpic} alt=""/></div>
                    <div className={'title'}>{o.title}</div>
                    <div className={'about'}>{o.detail.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 200)}</div>
                </div>
            )
        });

        return _serviceArray
    }

    render(){
        return(
            <div className={'service-wrapper'}>
                <div className={'service-contain'}>
                    <div className={'heading'}>Our Services</div>
                    {
                        this.state.serviceContent === null ? <Subloader/> :
                            this.state.serviceContent.length < 1 ? <h4>No service available</h4>:
                                <div className={'service-container'}>
                                    {this.getServices()}
                                </div>
                    }

                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return({
        services: state.serviceContent, backEndLinks: state.backEndLinks,
    })
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        actionWithData: actionWithData, authorizeWithData: authorizeWithData, authorizeWithoutData: authorizeWithoutData,
        actionWithoutData: actionWithoutData, setContent: setContent,
    }, dispatch)
}



export default connect(mapStateToProps, mapDispatchToProps)(HomeService);
import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit';
import {chevronDown} from 'react-icons-kit/ionicons/chevronDown'
import proptypes from 'prop-types';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import $ from 'jquery'

import {actionWithoutData, actionWithData, authorizeWithData, authorizeWithoutData, setContent} from '../../../redux/actions';
import Subloader from '../../common/subLoader'

import Header from '../../common/header'
import Slider1 from '../../common/slider1'

const initialState = {
    sliders: null,
};

class HomeSlider extends React.Component{
    constructor(props) {
        super(props);

        this.state = initialState;
    }

    componentWillMount(){
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(props){
        if(props.sliders !== this.state.sliders){
            this.state.sliders = props.sliders;
            this.setState({sliders: props.sliders});

        }
    }
    render(){
        const {history} = this.props;
        return(
            <div className={'adefemi-slider'}>
                <Header history={history}/>
                <div className={'slider-proceed'}>
                    <Icon icon={chevronDown}/>
                </div>
                <div className={'slider-content'}>
                    <div className={'slider-image'}>
                        {
                            this.state.sliders === null ? <Subloader/>:
                                <Slider1 images={this.state.sliders}/>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

HomeSlider.propTypes = {
    history: proptypes.object.isRequired
};

function mapStateToProps(state) {
    return({
        sliders: state.sliderContent, backEndLinks: state.backEndLinks,
    })
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        actionWithData: actionWithData, authorizeWithData: authorizeWithData, authorizeWithoutData: authorizeWithoutData,
        actionWithoutData: actionWithoutData, setContent: setContent,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeSlider);
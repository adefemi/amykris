import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit';
import proptypes from 'prop-types';
import {connect} from 'react-redux'

import Header from '../../common/header'

const initialState = {
    images: null, errorStatus: false,
};

class BlogSlider extends React.Component{
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
        let _activeImages = _images.filter(o => o.title === "blog");
        if(_activeImages.length < 1){
            return null
        }
        else {
            return {'backgroundImage':'url("'+_activeImages[0].coverpic+'")'};
        }
    }
    render(){
        const {history} = this.props;
        return(
            <div className={'sliders blog'} style={this.state.images !== null ? this.getBackground() : null}>
                <Header history={history}/>
                <div className={'slider-content'}>
                    <div className={'title'}>AMYKRIS BLOG</div>
                </div>

            </div>
        )
    }
}

BlogSlider.propTypes = {
    history: proptypes.object.isRequired
};
function mapStateToProps(state) {
    return({
        pageSetting: state.pageSettingContent, backEndLinks: state.backEndLinks,
    })
}

export default connect(mapStateToProps)(BlogSlider);
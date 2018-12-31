import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import $ from 'jquery'
import jwt_decode from 'jwt-decode';
import {spinner6} from 'react-icons-kit/icomoon/spinner6'

import {actionWithoutData, actionWithData, authorizeWithData, authorizeWithoutData, setContent} from '../../redux/actions';

import Footer from '../common/footer';
import Pagination from '../common/pagination';
import Slider from './components/slider';
import ServiceContent from './components/blogList';
import HeaderContact from '../common/header-contact';
import Subloader from '../common/subLoader'
import Goup from '../common/go_up'

const initialState = {
    activeUser: null, blogs: null, errorState: false, max: 5, current: 1, totalpages: 0,
    Loadmore: false,
};

class ServiceIndex extends React.Component{

    constructor(props) {
        super(props);

        this.state = initialState;
    }

    componentWillMount(){
        this.verifyContent(this.props);
        this.componentWillReceiveProps(this.props);
    }

    verifyContent(props){
        let url = "";
        if(!props.blogs.hasOwnProperty('blogs')){
            url = this.props.backEndLinks.blog;
            this.props.actionWithoutData("get", url).then(
                res => {
                    props.blogs.blogs = res.data;
                    this.props.setContent("SET_BLOG_CONTENT",this.props.blogs);
                },
                err => {
                    this.setState({errorState:true})
                }
            )
        }
    }

    componentWillReceiveProps(props){
        if(props.blogs.hasOwnProperty('blogs')){
            if(props.blogs.blogs !== this.state.blogs){
                this.setState({blogs: props.blogs.blogs});
                this.state.blogs = props.blogs.blogs;
            }
        }
    }

    getServices(){
        let _blogs = [...this.state.blogs];
        let _tempContent = [];
        this.state.totalpages= Math.ceil(_blogs.length / this.state.max);
        let ListCount = this.state.current * this.state.max;
        _blogs.length < ListCount ? ListCount = _blogs.length : null;
        for(let i = 0; i < ListCount; i++){
            _tempContent.push(
                <ServiceContent key={i} slug={_blogs[i].slug} imageFile={_blogs[i].coverpic} title={_blogs[i].title} details={_blogs[i].detail}/>
            )
        }
        return _tempContent
    }

    loadmore(){
        this.setState({Loadmore:true});
        setTimeout(() => {
            this.setState({current:this.state.current + this.state.max, Loadmore: false});
        }, 500);
    }

    render(){
        const {history} = this.props;
        return(
            <div className={'wrapper'}>
                <HeaderContact/>
                <Goup/>
                <Slider history={history}/>

                <div className={'blog-container'}>
                    <div className={'blog-header'}>Latest Blog</div>
                    <div className={'blog-content'}>
                        {
                            this.state.blogs === null ? <Subloader/> :
                                this.state.blogs.length < 1 ? <h4>No blog has been posted yet</h4> :
                                    this.getServices()
                        }
                        {
                            this.state.current >= this.state.totalpages ? null :
                                this.state.Loadmore ? <button className={'controlButt'}><Icon className={'rotate'} icon={spinner6}/></button> :
                                    <button onClick={() => this.loadmore()} className={'controlButt'}>Load More</button>
                        }
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return({
        userStatus: state.userStatus, blogs : state.blogContent, backEndLinks: state.backEndLinks,
    })
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        actionWithData: actionWithData, authorizeWithData: authorizeWithData, authorizeWithoutData: authorizeWithoutData,
        actionWithoutData: actionWithoutData, setContent: setContent,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceIndex);
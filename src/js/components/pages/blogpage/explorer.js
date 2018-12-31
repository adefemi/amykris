import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit';
import {spinner6} from 'react-icons-kit/icomoon/spinner6'
import {iosCalendar} from 'react-icons-kit/ionicons/iosCalendar'
import {thumbsUp} from 'react-icons-kit/fa/thumbsUp'
import {thumbsDown} from 'react-icons-kit/fa/thumbsDown'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import $ from 'jquery'

import {actionWithoutData, actionWithData, authorizeWithData, authorizeWithoutData, setContent} from '../../redux/actions';
import Subloader from '../common/subLoader'
import {FormatMoney, processError} from '../common/miscellaneous'


import Footer from '../common/footer';
import Slider from './components/slider';
import HeaderContact from '../common/header-contact';
import Toast from '../common/toast'
import Goup from '../common/go_up'

import ImageLoader from '../common/imageLoader'

const initialState = {
    blogs: null, blogComments: null, blogReaction: null, errorState: false,
    activeBlog: null, users: null, toastType: "error", toastContent: "", toastStatus: false,
    comment: "", username: "", email: "", highlightSubmit: false, activeStatus: null,
    activeIp: null,  max: 5, current: 1, totalpages: 0,
    Loadmore: false
};

class blogExplorer extends React.Component{

    constructor(props) {
        super(props);

        this.state = initialState;
    }

    getActiveBlog(){
        let _blogList = [...this.state.blogs];
        let slug = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
        let activeBlog = _blogList.filter(o => o.slug === slug);
        this.state.activeBlog = activeBlog;
        this.setState({activeBlog:activeBlog});
    }

    getActiveIp(){
        let url = "https://api.ipify.org/?format=json";
        this.props.actionWithoutData('get', url).then(
            res => {
                this.setState({activeIp: res.data.ip});
            }
        )
    }

    componentWillMount(){
        this.verifyList(this.props);
        this.getActiveIp();
        this.componentWillReceiveProps(this.props);
    }

    componentDidMount(){
        if(this.props.userStatus){
            this.setState({username: this.props.userStatus.username, email: this.props.userStatus.email})
        }
    }

    verifyList(props){
        let url = "";
        if(!props.blogs.hasOwnProperty('blogs')){
            url = this.props.backEndLinks.blog;
            this.props.actionWithoutData("get", url).then(
                res => {
                    this.props.blogs.blogs = res.data;
                    this.props.setContent("SET_BLOG_CONTENT",this.props.blogs);
                },
                err => {
                    this.setState({errorState:true})
                }
            )
        }

        if(!props.blogs.hasOwnProperty('blogComments')){
            url = this.props.backEndLinks.blogHighlight;
            this.props.actionWithoutData("get", url).then(
                res => {
                    this.props.blogs.blogComments = res.data;
                    this.props.setContent("SET_FORUM_CONTENT",this.props.blogs);
                },
                err => {
                    this.setState({errorState:true})
                }
            )
        }
        if(!props.blogs.hasOwnProperty('blogReaction')){
            url = this.props.backEndLinks.blogReaction;
            this.props.actionWithoutData("get", url).then(
                res => {
                    this.props.blogs.blogReaction = res.data;
                    this.props.setContent("SET_FORUM_CONTENT",this.props.blogs);
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
                this.getActiveBlog()
            }
            else {
                this.getActiveBlog()
            }
        }
        if(props.blogs.hasOwnProperty('blogComments')){
            if(props.blogs.blogComments !== this.state.blogComments){
                this.setState({blogComments: props.blogs.blogComments});
                this.state.blogComments = props.blogs.blogComments;
            }
        }
        if(props.blogs.hasOwnProperty('blogReaction')){
            if(props.blogs.blogReaction !== this.state.blogReaction){
                this.setState({blogReaction: props.blogs.blogReaction});
                this.state.blogReaction = props.blogs.blogReaction;
            }
        }
        if(props.users.hasOwnProperty('users')){
            if(props.users.users !== this.state.users){
                this.setState({users: props.users.users});
                this.state.users = props.users.users;
            }
        }
    }

    getReaction(type){
        let reactionList = [...this.state.blogReaction];
        reactionList = reactionList.filter(o => o.blog_id === this.state.activeBlog[0].id);
        reactionList = reactionList.filter(o => parseInt(o.value) === type);
        return reactionList.length;
    }


    changeContent(slug){
        this.props.history.push('/blog/'+slug);
        let goup = new Goup();
        goup.goup();
    }

    getHighlights(){
        let _blogComments = [...this.state.blogComments];
        let activeBlog = this.state.activeBlog[0];
        let ActiveComment = _blogComments.filter(o => o.blog_id === activeBlog.id);
        let arrayList = [];
        this.state.totalpages= Math.ceil(ActiveComment.length / this.state.max);
        let ListCount = this.state.current * this.state.max;
        ActiveComment.length < ListCount ? ListCount = ActiveComment.length : null;
        for(let i = 0; i < ListCount; i++){
            arrayList.push(
                <li key={i}>
                    <div className={'username'}>{ActiveComment[i].username}</div>
                    <div className={'time'}>{ActiveComment[i].created_on}</div>
                    <p dangerouslySetInnerHTML={{__html: ActiveComment[i].comment}} />
                </li>
            )
        }

        return arrayList
    }

    loadmore(){
        this.setState({Loadmore:true});
        setTimeout(() => {
            this.setState({current:this.state.current + this.state.max, Loadmore: false});
        }, 500);

    }

    closeToast(){
        this.setState({toastStatus: false})
    }

    submitHighlight(access = null){
        let highlight = {comment: this.state.comment,
            blog_id: this.state.activeBlog[0].id,
            username: this.state.username,
            email: this.state.email
        };
        let payload = new FormData();
        Object.entries(highlight).forEach(
            ([key, value]) => {
                payload.append(key, value)
            }
        );
        let accessToken = access;
        access === null ? accessToken = JSON.parse(localStorage.getItem('amykris-user')).access: null;
        let url = this.props.backEndLinks.blogHighlight;
        this.props.authorizeWithData("post", url, payload, accessToken).then(
            (res) => {
                this.props.blogs.blogComments.push(res.data);
                this.props.setContent("SET_BLOG_CONTENT",this.props.blogs);
                this.setState({toastType:"success", toastStatus: false});
                setTimeout(() => {
                    this.setState({toastContent: "Comment was posted successfully", highlightSubmit: false, toastStatus: true, comment: ""});
                }, 500)
            },
            (err) => {
                let errorObj = processError(err, this.props.backEndLinks.refresh);
                if(errorObj.type === 3){
                    this.submitHighlight(errorObj.content);
                }
                else{
                    this.setState({toastType:"error", toastStatus: false});
                    setTimeout(() => {
                        this.setState({toastContent: errorObj.content,
                            toastType:"error", highlightSubmit: false, toastStatus: true});
                    }, 200);

                }
            }
        )
    }

    getServices(){
        let _blogs = [...this.state.blogs];
        _blogs = _blogs.filter(o => o.id !== this.state.activeBlog[0].id);
        let _tempContent = [];
        let count = _blogs.length;
        count > 3 ? count = 3 : null;
        for(let i = 0; i < count; i++){
            _tempContent.push(
                <li key={i} onClick={() => this.changeContent(_blogs[i].slug)}>
                    <div className={'image-con'}>
                        <ImageLoader/>
                        <img src={_blogs[i].coverpic} alt=""/>
                    </div>
                    <div className={'content-show'}>
                        {_blogs[i].detail.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 120)}
                        {_blogs[i].detail.replace(/<\/?[^>]+(>|$)/g, "").length > 120 ? "..." : null}
                    </div>
                </li>
            )
        }
        return _tempContent;
    }

    handleReaction(type){
        if(this.state.activeIp === null) {
            this.setState({toastType:"error", toastStatus: false});
            setTimeout(() => {
                this.setState({toastContent: "Error performing operation", toastStatus: true});
            }, 500);
            this.getActiveIp();
            return
        }
        let reactionList = [...this.state.blogReaction];
        let activeReaction = reactionList.filter(o => o.blog_id === this.state.activeBlog[0].id);
        activeReaction.length >0 ? parseInt(activeReaction[0].value) === type ? type = 0: null : null;
        let formdata = new FormData;
        formdata.append('value', type);
        formdata.append('ip', this.state.activeIp);
        formdata.append('blog_id', this.state.activeBlog[0].id);
        let method = 'post';
        activeReaction.length > 0 ? method = 'put' : null;
        let url = this.props.backEndLinks.blogReaction;
        activeReaction.length > 0 ? url = url+activeReaction[0].id : null;
        this.props.actionWithData(method, url, formdata).then(
            res => {
                this.props.blogs.blogReaction = res.data;
                this.props.setContent('SET_BLOG_CONTENT', this.props.blogs);
            },
            err => {
                this.setState({toastType:"error", toastStatus: false});
                setTimeout(() => {
                    this.setState({toastContent: "Error performing operation", toastStatus: true});
                }, 500);
            }
        )

    }

    render(){
        const {history} = this.props;
        return(
            <div className={'wrapper'}>
                <HeaderContact/>
                <Goup/>
                <Toast closeToast={this.closeToast.bind(this)}
                       toastStatus={this.state.toastStatus}
                       type={this.state.toastType}
                       content={this.state.toastContent}/>
                <Slider history={history}/>
                <div className={'product-container'}>
                    {
                        this.state.activeBlog === null ? <Subloader/> :
                            this.state.activeBlog.length < 1 ? <h4>The blog you are looking for no longer exist</h4> :
                                <div className={'explorer-split'}>
                                    <div className={'left'}>
                                        <div className={'title'}>{this.state.activeBlog[0].title}</div>
                                        <div className={'properties'}>
                                            <ul>
                                                <div><Icon icon={iosCalendar}/></div>
                                                <div className={'label'}>{this.state.activeBlog[0].updated_on}</div>
                                            </ul>
                                            <ul onClick={() => this.handleReaction(1)}>
                                                <div><Icon  icon={thumbsUp}/></div>
                                                <div className={'label'}>{this.state.blogReaction !== null ? this.getReaction(1) : null}</div>
                                            </ul>
                                            <ul onClick={() => this.handleReaction(-1)}>
                                                <div><Icon icon={thumbsDown}/></div>
                                                <div className={'label'}>{this.state.blogReaction !== null ? this.getReaction(-1) : null}</div>
                                            </ul>
                                        </div>
                                        <div className={'image-con'}>
                                            <ImageLoader/>
                                            <img src={this.state.activeBlog[0].coverpic} alt=""/>
                                        </div>
                                        <div className={'details'} dangerouslySetInnerHTML={{__html: this.state.activeBlog[0].detail}} />
                                        {
                                            this.state.blogComments === null || this.state.users === null ? <Subloader/> :
                                                this.getHighlights().length < 1 ? <h4>No Comment available for blog post</h4> :
                                                    <div className={'highlight'}>
                                                        <h3>{this.getHighlights().length} Highlight{this.getHighlights().length > 1 ? 's' :null}</h3>
                                                        {this.getHighlights()}
                                                        {
                                                            this.state.current >= this.state.totalpages ? null :
                                                                this.state.Loadmore ? <button className={'controlButt'}><Icon className={'rotate'} icon={spinner6}/></button> :
                                                                    <button onClick={() => this.loadmore()} className={'controlButt'}>Load More</button>
                                                        }
                                                        <br/>
                                                        <br/>
                                                    </div>
                                        }
                                        <div className={'add-comment'}>
                                            <h3>Add Comment</h3>

                                            <form>
                                                <div className={'formgroup'}>
                                                    <textarea rows="15" placeholder={'message'}
                                                              value={this.state.comment}
                                                              onChange={(e) => this.setState({comment: e.target.value})}
                                                    > </textarea>
                                                </div>
                                                <div className={'formgroup'}>
                                                    <label>Name</label>
                                                    <input
                                                        value={this.state.username}
                                                        onChange={(e) => this.setState({username: e.target.value})}
                                                        type="text"/>
                                                </div>
                                                <div className={'formgroup'}>
                                                    <label>Email</label>
                                                    <input
                                                        value={this.state.email}
                                                        onChange={(e) => this.setState({email: e.target.value})}
                                                        type="email"/>
                                                </div>
                                                {
                                                    this.state.highlightSubmit ? <button className={'controlButt'} disabled={true}><Icon className={'rotate'} icon={spinner6}/></button> :
                                                        <button className={'controlButt'} onClick={(e) => [e.preventDefault(), this.setState({highlightSubmit:true}), this.submitHighlight()]}>Submit</button>
                                                }
                                            </form>

                                        </div>
                                    </div>
                                    <div className={'right'}>
                                        <h3>Recent Blogs</h3>
                                        <div className={'product-list'}>
                                            {this.getServices().length < 1 ? <h4>No recent blog post found</h4>:
                                            this.getServices()}
                                        </div>
                                    </div>
                                </div>
                    }
                </div>
                <Footer/>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return({
        userStatus: state.userStatus, blogs: state.blogContent, users: state.userContent, backEndLinks: state.backEndLinks,
    })
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        actionWithData: actionWithData, authorizeWithData: authorizeWithData, authorizeWithoutData: authorizeWithoutData,
        actionWithoutData: actionWithoutData, setContent: setContent,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(blogExplorer);
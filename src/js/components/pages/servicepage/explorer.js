import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit';
import {iosCalendar} from 'react-icons-kit/ionicons/iosCalendar'
import {iosAlbums} from 'react-icons-kit/ionicons/iosAlbums'
import {thumbsUp} from 'react-icons-kit/fa/thumbsUp'
import {thumbsDown} from 'react-icons-kit/fa/thumbsDown'
import {spinner6} from 'react-icons-kit/icomoon/spinner6'


import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import $ from 'jquery'

import {actionWithoutData, actionWithData, authorizeWithData, authorizeWithoutData, setContent} from '../../redux/actions';
import Subloader from '../common/subLoader'
import {FormatMoney, processError} from '../common/miscellaneous'

import Footer from '../common/footer';
import Slider from './components/slider';
import HeaderContact from '../common/header-contact';
import Slider1 from '../common/sliderProduct'
import Toast from '../common/toast'
import Goup from '../common/go_up'

import ImageLoader from '../common/imageLoader'

const initialState = {
    products: null, productType: null, productHighlight: null, productReaction: null, errorState: false,
    activeProduct: null, productCapture: null, productPurchase: null, users: null, toastType: "error", toastContent: "", toastStatus: false,
    comment: "", highlightSubmit: false, productCount: 1, max: 5, current: 1, totalpages: 0, Loadmore: false, activeIp: null,
};

class ServiceExplorer extends React.Component{

    constructor(props) {
        super(props);

        this.state = initialState;
    }
    getActiveIp(){
        let url = "https://api.ipify.org/?format=json";
        this.props.actionWithoutData('get', url).then(
            res => {
                this.setState({activeIp: res.data.ip});
            }
        )
    }

    getActiveProduct(){
        let _productList = [...this.state.products];
        let slug = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
        let activeProduct = _productList.filter(o => o.slug === slug);
        this.state.activeProduct = activeProduct;
        this.setState({activeProduct:activeProduct});
    }

    componentWillMount(){
        this.getActiveIp();
        this.verifyList();
        this.componentWillReceiveProps(this.props);
    }

    verifyList(){
        let url = "";
        if(!this.props.products.hasOwnProperty('products')){
            url = this.props.backEndLinks.product;
            this.props.actionWithoutData("get", url).then(
                res => {
                    this.props.products.products = res.data;
                    this.props.setContent("SET_PRODUCT_CONTENT",this.props.products);
                },
                err => {
                    this.setState({errorState:true})
                }
            )
        }
        if(!this.props.products.hasOwnProperty('productType')){
            url = this.props.backEndLinks.productType;
            this.props.actionWithoutData("get", url).then(
                res => {
                    this.props.products.productType = res.data;
                    this.props.setContent("SET_FORUM_CONTENT",this.props.products);
                },
                err => {
                    this.setState({errorState:true})
                }
            )
        }
        if(!this.props.products.hasOwnProperty('productHighlight')){
            url = this.props.backEndLinks.productHighlight;
            this.props.actionWithoutData("get", url).then(
                res => {
                    this.props.products.productHighlight = res.data;
                    this.props.setContent("SET_FORUM_CONTENT",this.props.products);
                },
                err => {
                    this.setState({errorState:true})
                }
            )
        }
        if(!this.props.products.hasOwnProperty('productReaction')){
            url = this.props.backEndLinks.productReaction;
            this.props.actionWithoutData("get", url).then(
                res => {
                    this.props.products.productReaction = res.data;
                    this.props.setContent("SET_FORUM_CONTENT",this.props.products);
                },
                err => {
                    this.setState({errorState:true})
                }
            )
        }
        if(!this.props.products.hasOwnProperty('productPurchase')){
            url = this.props.backEndLinks.productPurchase;
            this.props.actionWithoutData("get", url).then(
                res => {
                    this.props.products.productPurchase = res.data;
                    this.props.setContent("SET_FORUM_CONTENT",this.props.products);
                },
                err => {
                    this.setState({errorState:true})
                }
            )
        }
        if(!this.props.products.hasOwnProperty('productCapture')){
            url = this.props.backEndLinks.productCapture;
            this.props.actionWithoutData("get", url).then(
                res => {
                    this.props.products.productCapture = res.data;
                    this.props.setContent("SET_FORUM_CONTENT",this.props.products);
                },
                err => {
                    this.setState({errorState:true})
                }
            )
        }
    }

    componentWillReceiveProps(props){
        if(props.products.hasOwnProperty('products')){
            if(props.products.products !== this.state.products){
                this.setState({products: props.products.products});
                this.state.products = props.products.products;
                this.getActiveProduct()
            }
            else {
                this.getActiveProduct()
            }
        }

        if(props.products.hasOwnProperty('productType')){
            if(props.products.productType !== this.state.productType){
                this.setState({productType: props.products.productType});
                this.state.productType = props.products.productType;
            }
        }
        if(props.products.hasOwnProperty('productHighlight')){
            if(props.products.productHighlight !== this.state.productHighlight){
                this.setState({productHighlight: props.products.productHighlight});
                this.state.productHighlight = props.products.productHighlight;
            }
        }
        if(props.products.hasOwnProperty('productReaction')){
            if(props.products.productReaction !== this.state.productReaction){
                this.setState({productReaction: props.products.productReaction});
                this.state.productReaction = props.products.productReaction;
            }
        }
        if(props.products.hasOwnProperty('productPurchase')){
            if(props.products.productPurchase !== this.state.productPurchase){
                this.setState({productPurchase: props.products.productPurchase});
                this.state.productPurchase = props.products.productPurchase;
            }
        }
        if(props.products.hasOwnProperty('productCapture')){
            if(props.products.productCapture !== this.state.productCapture){
                this.setState({productCapture: props.products.productCapture});
                this.state.productCapture = props.products.productCapture;
            }
        }
        if(props.users.hasOwnProperty('users')){
            if(props.users.users !== this.state.users){
                this.setState({users: props.users.users});
                this.state.users = props.users.users;
            }
        }
    }

    getCategory(){
        let typeList = [...this.state.productType];
        typeList = typeList.filter(o => o.id === this.state.activeProduct[0].type);
        return typeList[0].title;
    }

    getReaction(type){
        let reactionList = [...this.state.productReaction];
        reactionList = reactionList.filter(o => o.product_id === this.state.activeProduct[0].id);
        reactionList = reactionList.filter(o => parseInt(o.value) === type);
        return reactionList.length;
    }

    getRelatedProduct(){
        let _products = [...this.state.products];
        let activeProduct = this.state.activeProduct[0];
        let _relatedList = _products.filter(o => o.type === activeProduct.type && o.id !== activeProduct.id);
        let _arrayCon = [];
        let count = _relatedList.length;
        count > 3 ? count = 3: null;
        for(let i = 0; i < count; i++){
            _arrayCon.push(
                <li key={i} onClick={() => this.changeContent(_relatedList[i].slug)}>
                    <div className={'image-con'}>
                        <ImageLoader/>
                        <img src={_relatedList[i].coverpic} alt=""/>
                    </div>
                    <div className={'content-show'}>
                        {_relatedList[i].title}
                    </div>
                </li>
            )
        }
        return _arrayCon
    }

    changeContent(slug){
        this.props.history.push('/products/'+slug);
        let goup = new Goup();
        goup.goup();
    }

    getHighlights(){
        let _productHighlights = [...this.state.productHighlight];
        let usersList = [...this.state.users];
        let activeProduct = this.state.activeProduct[0];
        let ActiveHighlight = _productHighlights.filter(o => o.product_id === activeProduct.id);
        let arrayList = [];
        this.state.totalpages= Math.ceil(ActiveHighlight.length / this.state.max);
        let ListCount = this.state.current * this.state.max;
        ActiveHighlight.length < ListCount ? ListCount = ActiveHighlight.length : null;
        for(let i = 0; i < ListCount; i++){
            let ActiveUser = usersList.filter(o => o.id === ActiveHighlight[i].user_id);
            arrayList.push(
                <li key={i}>
                    <div className={'username'}>{ActiveUser[0].username}</div>
                    <div className={'time'}>{ActiveHighlight[i].created_on}</div>
                    <p dangerouslySetInnerHTML={{__html: ActiveHighlight[i].comment}} />
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

    getPurchaseCount(){
        let _purchase = [...this.state.productPurchase];
        let _activePurchase = _purchase.filter(o => o.product_id === this.state.activeProduct[0].id);
        if(_activePurchase.length < 1){
            return 0;
        }
        else {
            let total = 0;
            _activePurchase.map(o => {
                total += parseInt(o.value);
            });
            return total
        }
    }

    submitHighlight(access = null){
        if(!this.props.userStatus){
            this.setState({toastType:"error", toastStatus: false});
            setTimeout(() => {
                this.setState({toastContent: "Only registered users can post an highlight",
                    toastType:"error", highlightSubmit: false, toastStatus: true});
            }, 200);
            return;
        }
        let highlight = {comment: this.state.comment, user_id: this.props.userStatus.id, product_id: this.state.activeProduct[0].id};
        let payload = new FormData();
        Object.entries(highlight).forEach(
            ([key, value]) => {
                payload.append(key, value)
            }
        );
        let accessToken = access;
        access === null ? accessToken = JSON.parse(localStorage.getItem('amykris-user')).access: null;
        let url = this.props.backEndLinks.productHighlight;
        this.props.authorizeWithData("post", url, payload, accessToken).then(
            (res) => {
                this.props.products.productHighlight.push(res.data);
                this.props.setContent("SET_PRODUCT_CONTENT",this.props.products);
                this.setState({toastType:"success", toastStatus: false});
                setTimeout(() => {
                    this.setState({toastContent: "highlight was posted successfully", highlightSubmit: false, toastStatus: true, comment: ""});
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

    handleReaction(type){
        if(this.state.activeIp === null) {
            this.setState({toastType:"error", toastStatus: false});
            setTimeout(() => {
                this.setState({toastContent: "Error performing operation", toastStatus: true});
            }, 500);
            this.getActiveIp();
            return
        }
        let reactionList = [...this.state.productReaction];
        let activeReaction = reactionList.filter(o => o.product_id === this.state.activeProduct[0].id);
        activeReaction.length >0 ? parseInt(activeReaction[0].value) === type ? type = 0: null: null;
        let formdata = new FormData;
        formdata.append('value', type);
        formdata.append('ip', this.state.activeIp);
        formdata.append('product_id', this.state.activeProduct[0].id);
        let method = 'post';
        activeReaction.length > 0 ? method = 'put' : null;
        let url = this.props.backEndLinks.productReaction;
        activeReaction.length > 0 ? url = url+activeReaction[0].id : null;
        this.props.actionWithData(method, url, formdata).then(
            res => {
                this.props.products.productReaction = res.data;
                this.props.setContent('SET_PRODUCT_CONTENT', this.props.products);
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
                        this.state.activeProduct === null ? <Subloader/> :
                            this.state.activeProduct.length < 1 ? <h4>This product no longer exist</h4>:
                                <div className={'explorer-split'}>
                                    <div className={'left'}>
                                        <div className={'title'}>{this.state.activeProduct[0].title}</div>
                                        <div className={'properties'}>
                                            <ul>
                                                <div><Icon icon={iosCalendar}/></div>
                                                <div className={'label'}>{this.state.activeProduct[0].updated_on}</div>
                                            </ul>
                                            <ul>
                                                <div><Icon icon={iosAlbums}/></div>
                                                <div className={'label'}>{this.state.productType !== null ? this.getCategory() : null}</div>
                                            </ul>
                                            <ul onClick={() => this.handleReaction(1)}>
                                                <div><Icon icon={thumbsUp}/></div>
                                                <div className={'label'}>{this.state.productReaction !== null ? this.getReaction(1) : null}</div>
                                            </ul>
                                            <ul onClick={() => this.handleReaction(-1)}>
                                                <div><Icon icon={thumbsDown}/></div>
                                                <div className={'label'}>{this.state.productReaction !== null ? this.getReaction(-1) : null}</div>
                                            </ul>
                                        </div>
                                        <div className={'image-con'}>
                                            <ImageLoader/>
                                            <img src={this.state.activeProduct[0].coverpic} alt=""/>
                                        </div>
                                        <div className={'details'} dangerouslySetInnerHTML={{__html: this.state.activeProduct[0].detail}} />

                                        {
                                            this.state.productCapture === null ? <Subloader/> :
                                                this.state.productCapture.length < 1 ? null :
                                                    <div className={'captures'}>
                                                        <Slider1 images={this.state.productCapture}/>
                                                    </div>
                                        }
                                        {
                                            this.state.productHighlight === null || this.state.users === null ? <Subloader/> :
                                                this.getHighlights().length < 1 ? <h4>No highlight was found for this product</h4> :
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
                                            <h3>Add Highlight</h3>

                                            <form>
                                                <div className={'formgroup'}>
                                                    <textarea value={this.state.comment} onChange={(e) => this.setState({comment: e.target.value})} rows="15" placeholder={'comment'}> </textarea>
                                                </div>

                                                {
                                                    this.state.highlightSubmit ? <button className={'controlButt'} disabled={true}><Icon className={'rotate'} icon={spinner6}/></button> :
                                                        <button className={'controlButt'} onClick={(e) => [e.preventDefault(), this.setState({highlightSubmit:true}), this.submitHighlight()]}>Submit</button>
                                                }

                                            </form>

                                        </div>
                                    </div>
                                    <div className={'right'}>
                                        <div className={'cats'}>
                                            <div className={'download'}>
                                                <div className={'title'}>Customers Already Bought</div>
                                                <div className={'content'}>
                                                    {this.state.productPurchase === null ? <h4>Loading</h4> :
                                                        this.state.productPurchase.length < 1 ? '0' :
                                                            this.getPurchaseCount()
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            !this.props.userStatus ? <h4><Link style={{'color':'blue'}} to={'/sign-in'}>Log in</Link> to make purchase</h4> :
                                                <div>
                                                    <div className={'selectGroup'}>
                                                        <select value={this.state.productCount} onChange={(e) => this.setState({productCount:e.target.value})}>
                                                            <option value="1">1</option>
                                                            <option value="2">2</option>
                                                            <option value="3">3</option>
                                                            <option value="4">4</option>
                                                            <option value="5">5</option>
                                                            <option value="6">6</option>
                                                            <option value="7">7</option>
                                                            <option value="8">8</option>
                                                            <option value="9">9</option>
                                                            <option value="10">10</option>
                                                        </select>
                                                    </div>
                                                    <div className={'controls'}>
                                                        <Link className={'git'}
                                                              to={
                                                                  '/payment-portal/?amount=' +this.state.activeProduct[0].price
                                                                  +'&email='+this.props.userStatus.email+'&title=' +this.state.activeProduct[0].title
                                                                  +'&count=' +this.state.productCount
                                                                  +'&product_id='+this.state.activeProduct[0].id
                                                                  +'&user_id='+this.props.userStatus.id
                                                              }
                                                        >
                                                            Buy {this.state.productCount} &#215; &#8358;{FormatMoney(this.state.activeProduct[0].price)}</Link>
                                                    </div>
                                                </div>
                                        }
                                        <h3>Related Products</h3>
                                        <div className={'product-list'}>
                                            {
                                                this.getRelatedProduct().length < 1 ? <h4>No related product found</h4>:
                                                    this.getRelatedProduct()
                                            }
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
        userStatus: state.userStatus, products: state.productContent, users: state.userContent, backEndLinks: state.backEndLinks,
    })
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        actionWithData: actionWithData, authorizeWithData: authorizeWithData, authorizeWithoutData: authorizeWithoutData,
        actionWithoutData: actionWithoutData, setContent: setContent,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceExplorer);
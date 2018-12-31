import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit';
import {ascending} from 'react-icons-kit/iconic/ascending'
import {descending} from 'react-icons-kit/iconic/descending'
import {basic_magnifier} from 'react-icons-kit/linea/basic_magnifier'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {spinner6} from 'react-icons-kit/icomoon/spinner6'
import $ from 'jquery'

import {actionWithoutData, actionWithData, authorizeWithData, authorizeWithoutData, setContent} from '../../redux/actions';
import Subloader from '../common/subLoader'

import Footer from '../common/footer';
import Pagination from '../common/pagination';
import Slider from './components/slider';
import ServiceContent from './components/serviceList';
import HeaderContact from '../common/header-contact';
import Goup from '../common/go_up'

const initialState = {
    products: null, productType: null, errorState: false, order: true, type: "", max: 6, current: 1, totalpages: 0,
    Loadmore: false
};

class ServiceIndex extends React.Component{

    constructor(props) {
        super(props);

        this.state = initialState;
    }

    componentWillMount(){
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
    }

    componentWillReceiveProps(props){
        if(props.products.hasOwnProperty('products')){
            if(props.products.products !== this.state.products){
                this.setState({products: props.products.products});
                this.state.products = props.products.products;
            }
        }

        if(props.products.hasOwnProperty('productType')){
            if(props.products.productType !== this.state.productType){
                this.setState({productType: props.products.productType});
                this.state.productType = props.products.productType;
            }
        }
    }

    getProductType(){
        let _tempType = [...this.state.productType];
        let _typeArray = [];

        _tempType.map((o,i) =>
            _typeArray.push(
                <option key={i} value={o.id}>{o.title}</option>
            )
        );
        return _typeArray;
    }

    switchOrder(){
        this.setState({order: !this.state.order});
    }

    getServices(){
        let _tempProduct = [...this.state.products];
        this.state.order ? _tempProduct = _tempProduct.reverse() : null;
        this.state.type !== "" ? _tempProduct = _tempProduct.filter(o => parseInt(o.type) === parseInt(this.state.type)): null;
        if(_tempProduct.length < 1){
            return false
        }
        let _tempType = [...this.state.productType];
        this.state.totalpages= Math.ceil(_tempProduct.length / this.state.max);
        let ListCount = this.state.current * this.state.max;
        _tempProduct.length < ListCount ? ListCount = _tempProduct.length : null;
        let _tempContent = [];
        for(let i = 0; i < ListCount; i++){
            let activeGenre = _tempType.filter(o => parseInt(o.id) === parseInt(_tempProduct[i].type));
            _tempContent.push(
                <ServiceContent key={i} imageFile={_tempProduct[i].coverpic}
                                genre={activeGenre[0].title}
                                title={_tempProduct[i].title}
                                details={_tempProduct[i].detail}
                                slug={_tempProduct[i].slug}
                />
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
                <div className={'product-container'}>
                    <div className={'control_header'}>
                        <div className={'item-select'}>
                            {
                                this.state.productType === null ? <select name="" id=""><option>Loading</option></select> :
                                    <select value={this.state.type} onChange={(e) => this.setState({type: e.target.value})}>
                                        <option value="">All</option>
                                        {this.getProductType()}
                                    </select>
                            }

                        </div>
                        <div className={'arrangement'}>
                            <button onClick={() => this.switchOrder()}>
                                {
                                    this.state.order ? <Icon icon={ascending}/> : <Icon icon={descending}/>
                                }

                            </button>
                        </div>
                    </div>
                    {
                        this.state.products === null || this.state.productType === null ? null :
                            this.state.products.length < 1 ? null :
                        !this.getServices() ? <h5>No product was found under this selection</h5> : null
                    }
                    <div className={'product-content'}>
                        {
                            this.state.products === null || this.state.productType === null ? <Subloader/> :
                                this.state.products.length < 1 ? <h4>No product was found!</h4>:
                                    this.getServices()
                        }
                    </div>
                    {
                        this.state.current >= this.state.totalpages ? null :
                        this.state.Loadmore ? <button className={'controlButt'}><Icon className={'rotate'} icon={spinner6}/></button> :
                            <button onClick={() => this.loadmore()} className={'controlButt'}>Load More</button>
                    }

                </div>

                <Footer/>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return({
        products: state.productContent, backEndLinks: state.backEndLinks,
    })
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        actionWithData: actionWithData, authorizeWithData: authorizeWithData, authorizeWithoutData: authorizeWithoutData,
        actionWithoutData: actionWithoutData, setContent: setContent,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceIndex);
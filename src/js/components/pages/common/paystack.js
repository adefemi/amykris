import React, { Component } from 'react';
import {Icon} from 'react-icons-kit';
import PaystackButton from 'react-paystack';
import QS from 'query-string'
import {spinner6} from 'react-icons-kit/icomoon/spinner6'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {actionWithoutData, actionWithData, authorizeWithData, authorizeWithoutData, setContent} from '../../redux/actions';

const key = "pk_test_2738ea7b83386afd8897e7092bbe084d785adc92";
const initialState = {
    email: null,
    amount: 0,
    count: null,
    title: null,
    product_id: null,
    activeReference: null,
    user_id: null,
    processing: false,
    goback: false,
};

class PayStack extends Component {

    constructor(props) {
        super(props);

        this.state = initialState;
    }

    componentWillMount(){
        let query = QS.parse(this.props.location.search);
        let amount = parseFloat(query.amount) * 100 * parseInt(query.count);
        this.setState({email:query.email, amount:amount, count:query.count,
            title: query.title, product_id: query.product_id, user_id: query.user_id})
    }

    processData(){
        this.setState({processing:true});
        let filetoSend = {product_id: this.state.product_id, value: this.state.count, amount: this.state.amount/100, user_id: this.state.user_id};
        let payload = new FormData();
        Object.entries(filetoSend).forEach(
            ([key, value]) => {
                payload.append(key, value)
            }
        );
        let url = this.props.backEndLinks.productPurchase;
        this.props.actionWithData('post', url, payload).then(
            res => {
                url = this.props.backEndLinks.userNotification;
                let content = "You've made a purchase for "+this.state.count+" <strong>"+this.state.title+"</strong> which amounts to &#8358;"+this.state.amount/100+", Amykris is currently working on it!!!";
                let filetoSend = { user_id: this.state.user_id, content: content, type: 1, status: 1};
                let payload = new FormData();
                Object.entries(filetoSend).forEach(
                    ([key, value]) => {
                        payload.append(key, value)
                    }
                );
                this.props.actionWithData('post', url, payload).then(
                    rem => {
                        this.props.products.productPurchase = res.data;
                        this.props.users.userNotification = rem.data;
                        this.props.setContent('SET_PRODUCT_CONTENT', this.props.products);
                        this.props.setContent('SET_USER_CONTENT', this.props.users);
                        this.setState({processing: false, goback:true})
                    }
                )
            }
        )
    }

    callback(res) {
       if(res.status === "success"){
           this.processData();
       }
    };

    close(){
        console.log("Payment closed");
    };

    getReference(){
        //you can put any unique reference implementation code here
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-.=";

        for( let i=0; i < 15; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        this.state.activeReference = text;

        return text;
    }

    render() {
        return (
            <div className={'paystack-container'}>
                {
                    this.state.processing ? <div className={'pay-process'}><span>Processing please wait!&nbsp;</span><Icon className={'rotate'} icon={spinner6}/></div> : null
                }
                {
                    this.state.goback ? <button onClick={() => this.props.history.goBack()} className={'controlButt'}>Go Back</button> : null
                }
                <div className={'inner'}>

                    <div className={'logo'}>
                        AmyKris
                    </div>
                    <PaystackButton
                        text="Make Payment"
                        class="payButton"
                        callback={this.callback.bind(this)}
                        close={this.close}
                        disabled={true}
                        embed={true}
                        reference={this.getReference()}
                        email={this.state.email}
                        amount={this.state.amount}
                        paystackkey={key}
                    />
                </div>
            </div>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(PayStack);
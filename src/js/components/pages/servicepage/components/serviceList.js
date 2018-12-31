import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit';
import {share} from 'react-icons-kit/ikons/share'
import {iosCart} from 'react-icons-kit/ionicons/iosCart'
import proptype from 'prop-types'

import Imageloader from '../../common/imageLoader'

class ServiceList extends React.Component{

    render(){
        const {imageFile, title, genre, details, slug} = this.props;
        return(
            <Link to={'/products/'+slug}>
                <li className={'product-item'}>
                    <div className={'product-img'}>
                        <Imageloader/>
                        <img src={imageFile} alt=""/>
                    </div>
                    <div className={'detail-con'}>
                        <div className={'item-title'}>{title}</div>
                        <div className={'item-genre'}>{genre}</div>
                        <div className={'product-detail'}>
                            {details.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 150)}
                            {details.replace(/<\/?[^>]+(>|$)/g, "").length > 150 ? "..." : null}
                        </div>
                    </div>
                </li>
            </Link>
        )
    }
}

ServiceList.propTypes = {
    imageFile : proptype.string.isRequired,
    title: proptype.string.isRequired,
    genre: proptype.string.isRequired,
    details: proptype.string.isRequired,
    slug: proptype.string.isRequired,
};



export default ServiceList;
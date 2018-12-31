import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit';
import {share} from 'react-icons-kit/ikons/share'
import {iosCart} from 'react-icons-kit/ionicons/iosCart'
import proptype from 'prop-types'

import ImageLoader from '../../common/imageLoader'

class ServiceList extends React.Component{

    render(){
        const {slug,imageFile, title, details} = this.props;
        return(
            <li className={'blog-item'}>
                <div className={'blog-img'}>
                    <ImageLoader/>
                    <img src={imageFile} alt=""/>
                </div>
                <div className={'detail-con'}>
                    <div className={'blog-title'}>{title}</div>
                    <div className={'blog-detail'}>
                        {details.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 200)}
                        {details.replace(/<\/?[^>]+(>|$)/g, "").length > 200 ? "..." : null}
                    </div>
                    <div className={'readmore'}>
                        <Link to={'/blog/'+slug}><button>Continue Reading</button></Link>
                    </div>

                </div>
            </li>
        )
    }
}

ServiceList.propTypes = {
    slug: proptype.string.isRequired,
    imageFile : proptype.string.isRequired,
    title: proptype.string.isRequired,
    details: proptype.string.isRequired
};

export default ServiceList;
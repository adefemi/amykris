import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit';
import Slider from "react-slick";
import protypes from 'prop-types'
import NoImage from '../../../../assets/images/No_Image_Available.jpg'
import ImageLoader from './imageLoader'

class Slider1 extends React.Component{

    render(){
        const {images} = this.props;
        let settings = {
            infinite: true,
            slidesToShow: 2,
            slidesToScroll: 1,
            speed: 1000,
            autoplay: true,
            autoplaySpeed: 5000,
            arrows: false,
            responsive: [
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        infinite: true,
                    }
                }
            ]
        };
        return(
            <Slider className={'sliderMain2'} {...settings}>
                {
                    images.map((o,i) => {
                        return(
                            <div key={i} className={'imagecon'}>
                                <label className={'image-container'}>
                                    <label className={'image-loader'}>loading</label>
                                </label>
                                <img src={o.coverpic} alt=""/>
                            </div>
                        );
                    })
                }
            </Slider>
        )
    }
}

Slider1.propTypes = {
    images : protypes.array
};

export default Slider1;
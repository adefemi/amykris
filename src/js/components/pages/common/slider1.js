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
        let setting2 = {
            centerMode: true,
            centerPadding: '60px',
            slidesToShow: images.length < 5 ? 2 : 3,
            speed: 2000,
            autoplay: true,
            autoplaySpeed: 8000,
            dots: true,
            arrows: false,
            responsive: [
                {
                    breakpoint: 600,
                    settings: {
                        arrows: false,
                        centerMode: true,
                        centerPadding: '40px',
                        slidesToShow: 1
                    }
                }
            ]
        };
        return(
            <Slider className={images.length < 5 ? 'sliderMain2' : 'sliderMain'} {...setting2}>
                {
                    images.map((o,i) => {
                        return(
                            <div className={'content-slide'} key={i}>
                                <div className={'imagecon'}>
                                    <label className={'image-container'}>
                                        <label className={'image-loader'}>loading</label>
                                    </label>
                                    {/*{console.log(o)}*/}
                                    <img src={o.coverpic} alt=""/>
                                </div>
                                <div className={'cover-image'}> </div>
                                <p className={'captions'}>{o.caption}</p>
                            </div>
                        );
                    })
                }
            </Slider>
        )
    }
}

Slider1.propTypes = {
    images : protypes.array.isRequired
};

export default Slider1;
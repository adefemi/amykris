import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit';

import HomeSlider from './components/homeSlider';
import HomeFeed from './components/homefeed';
import HomeService from './components/homeservice';
import HomeAbout from './components/homesabout';
import HeaderContact from '../common/header-contact';
import Footer from '../common/footer';
import Goup from '../common/go_up'

import Noimage from '../../../../assets/images/No_Image_Available.jpg';


class Index extends React.Component{

    render(){
        const {history} = this.props;
        return(
            <div className={'wrapper'}>
                <Goup/>
                <HeaderContact/>
                <HomeSlider history={history}/>
                <HomeAbout/>
                <HomeService/>
                <HomeFeed/>
                <Footer/>
            </div>
        )
    }
}

export default Index;
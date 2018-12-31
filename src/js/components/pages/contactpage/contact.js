import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit';

import Slider from './components/slider';
import Contact from '../common/contact';
import Footer from '../common/footer';
import HeaderContact from '../common/header-contact';

import Noimage from '../../../../assets/images/No_Image_Available.jpg';


class Index extends React.Component{

    render(){
        const {history} = this.props;
        return(
            <div className={'wrapper'}>
                <HeaderContact/>
                <Slider history={history}/>
                <Contact/>
                <Footer/>
            </div>
        )
    }
}

export default Index;
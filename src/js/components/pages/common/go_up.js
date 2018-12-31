import React from 'react';
import {Icon} from 'react-icons-kit';
import {chevronUp} from 'react-icons-kit/ionicons/chevronUp';
import $ from 'jquery'



class Go_up extends React.Component{
    constructor(props) {
        super(props);

        this.onScroll();
    }

    onScroll(){
        let defaultHeight = $(window).height();
        $(document).scroll(() => {
            let scrollFromTop = $(window).scrollTop();
            let goup = $('.go-up');
            if(scrollFromTop >= defaultHeight){
                goup.hasClass('close') ?  goup.removeClass('close') : null;
            }
            else{
                !goup.hasClass('close') ? goup.addClass('close') : null;

            }
        })

    }

    goup(){
        $('html, body, div').animate({scrollTop: 0}, 500)
    }

    render(){
        return(
            <div className={'go-up close'} onClick={() => this.goup()}>
                <Icon icon={chevronUp}/>
            </div>
        )
    }
}

export default Go_up;
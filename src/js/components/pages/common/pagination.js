import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit';
import {chevronLeft} from 'react-icons-kit/ionicons/chevronLeft'
import {chevronRight} from 'react-icons-kit/ionicons/chevronRight'


class Pagination extends React.Component{

    render(){
        return(
            <div className={'pagination-con'}>
                <div className={'pagination'}>
                    <li className={'disable'}><Icon icon={chevronLeft}/></li>
                    <li>1</li>
                    <li className={'active'}>2</li>
                    <li>3</li>
                    <li><Icon icon={chevronRight}/></li>
                </div>
            </div>
        )
    }
}

export default Pagination;
import React from 'react';

class MainLoader extends React.Component{
    render(){
        return(
            <div className={'mainloader-container'}>
                <div className={'mainloader-loader'}> </div>
                <div className={'mainloader-loader1'}> </div>
                <div className={'mainloader-loader2'}> </div>
            </div>
        )
    }
}
export default MainLoader;
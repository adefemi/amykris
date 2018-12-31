import React from 'react'
import {combineReducers} from 'redux'

//import reducers
import {backEndLinks} from './extras';
import {setAdminActive, setAboutContent, setUserContent, setServiceContent,
    setPageSettingContent, setBlogContent, setProductContent, setSliderContent} from './contentReducer';


const ReducerAll = combineReducers({
    backEndLinks : backEndLinks,
    userStatus : setAdminActive,
    userContent : setUserContent,
    aboutContent : setAboutContent,
    pageSettingContent : setPageSettingContent,
    blogContent : setBlogContent,
    serviceContent : setServiceContent,
    sliderContent : setSliderContent,
    productContent : setProductContent,
});

export default ReducerAll
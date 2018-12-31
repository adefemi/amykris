export function setAboutContent(state = null, action) {
    switch(action.type){
        case "SET_ABOUT_CONTENT":
            return action.payload;
            break;
    }
    return state
}

export function setBlogContent(state = [], action) {
    switch(action.type){
        case "SET_BLOG_CONTENT":
            return action.payload;
            break;
    }
    return state
}

export function setPageSettingContent(state = [], action) {
    switch(action.type){
        case "SET_PAGESETTING_CONTENT":
            return action.payload;
            break;
    }
    return state
}

export function setProductContent(state = [], action) {
    switch(action.type){
        case "SET_PRODUCT_CONTENT":
            return action.payload;
            break;
    }
    return state
}

export function setUserContent(state = [], action) {
    switch(action.type){
        case "SET_USER_CONTENT":
            return action.payload;
            break;
    }
    return state
}

export function setServiceContent(state = null, action) {
    switch(action.type){
        case "SET_SERVICE_CONTENT":
            return action.payload;
            break;
    }
    return state
}
export function setSliderContent(state = null, action) {
    switch(action.type){
        case "SET_SLIDER_CONTENT":
            return action.payload;
            break;
    }
    return state
}
export function setAdminActive(state = null, action) {
    switch(action.type){
        case "SET_USER_ACTIVE":
            return action.payload;
            break;
    }
    return state
}

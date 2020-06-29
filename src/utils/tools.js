// import axios from 'axios';
// import { Message } from 'element-ui';
var isArrOrObj = function(obj){
            if(Array.isArray)
               return Array.isArray(obj);
            else
               return Object.prototype.toString.call(obj)==="[object Array]";
    }
var requestCounterAdd = function(config){
  window.winObj.requestCounter++
  return config
}

var requestCounterMinus = function(){
  setTimeout(() => window.winObj.requestCounter--, 500)
}

var settingAxios = function(setting){
  if(setting)
     return setting.baseURL
   else
     return
}
var  moduleAxios = axios.create({
      baseURL: settingAxios(),
      headers: {
        'cool-token': window.token == undefined ? '00000000-0000-0000-0000-000000000000' : window.token,
      }
  })
// postMessage reLogin
function reLogin(){
   window.location.replace(`${serveDict.loginURL}##${encodeURIComponent(window.location.href.split('#')[0])}`)
}
 // 添加请求拦截器
moduleAxios.interceptors.request.use(function (config) {
        // 在发送请求之前做些什么
       window.winObj.requestCounter++ 
        return config;
      }, function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
  });
  // 拦截器
moduleAxios.interceptors.response.use(function (response) {
    // 在发送请求之前做些什么
    console.log(response)
    if(response){
       setTimeout(()=>{window.winObj.requestCounter--},500)
      if(!isArrOrObj(response)){
        if(response.hasOwnProperty('data')){
          // code 字符串
          if (response.data.code) {
            if(response.data.code == 101){
              Vue.prototype.$notify.error({
                title: response.data.message,
                message: '5秒后将返回登录界面',
                duration: 5000,
              })
              console.log('登录失效')
              setTimeout(()=>{
                window.top.postMessage({ method: 'reLogin'}, '*') 
                },5000)
              console.log(response.data)
              return Promise.reject(response.data)
            }
            if(response.data.code != 0){
              console.log('response.data.code != 0')
              Vue.prototype.$notify.error({
                title: response.data.message,
                message: '详情请看控制台',
                duration: 0,
              })
              return Promise.reject(response.data)
            }
               console.log(response.data)
               return Promise.resolve(response.data)
          }    
          else {
            if(response.data.hasOwnProperty('state')){
                  if(response.data.state == 'success'){
                    if(response.data.hasOwnProperty('total'))                        
                       return response.data;
                    else                        
                      return response.data.rows;                    
                  }else{
                   Vue.prototype.$notify.error({
                          title: response.data.state,
                          message: response.data.message,
                          duration: 3000
                      });
                    return
                  }
                }
          }
        }
    }else{
      return response
    }
    }
  }, function (error) {
    console.log(error,window.winObj.requestCounter)
     Vue.prototype.$notify.error({
                title: error,
                message: error,
                duration: 3000
            });
    // 对请求错误做些什么
    setTimeout(()=>{window.winObj.requestCounter--},500)    
    return Promise.reject(error);
  });

export {isArrOrObj,settingAxios,moduleAxios,requestCounterAdd,requestCounterMinus}

'use strict'

app.service('adminConfig', function () {
  var that = this
  this.config = {
    version        : 1,
    timestamp      : Date.now(),
    toasterTimeout : 1500,
    restfulUrl     : 'http://localhost:8080/api/adminweb/',
    ossUrl         : 'http://armenu.oss-cn-shanghai.aliyuncs.com/'
  }

  this.auth = {
    access_token  : '',
    expires_in    : 0,
    refresh_token : ''
  }
  try {
    this.auth = JSON.parse(localStorage.getItem('auth')) || this.auth
  }
  catch (ex) {
    this.clearAuth()
  }

  this.clearAuth = function () {
    localStorage.removeItem('auth')
  }

  this.setAuth = function (auth) {
    localStorage.setItem('auth', JSON.stringify(auth))
    that.auth.access_token = auth.access_token || that.auth.access_token
    that.auth.expires_in = auth.expires_in || that.auth.expires_in
    that.auth.refresh_token = auth.refresh_token || that.auth.refresh_token
  }
})

'use strict'

app.service('restfulAPI', [
  '$q',
  '$http',
  '$state',
  '$timeout',
  'toaster',
  'adminConfig',
  function ($q, $http, $state, $timeout, toaster, cfg) {
    var that = this

    this.baseUrl = cfg.config.restfulUrl
    this.refreshAuthUrl = this.baseUrl + 'auth/refresh'
    this.uploadUrl = {
      category : that.baseUrl + 'category/upload',
      item     : that.baseUrl + 'item/upload'
    }

    this.query = function (module, callbackSuccess, callbackFinally) {
      // console.log('api query', module, start, number);
      var url = this.baseUrl + module + '/list'
      var promise = httpGet(url)
      handlePromise(promise, callbackSuccess, callbackFinally)
    }

    this.queryOrder = function (module, timestamp, table, start, number, callbackSuccess, callbackFinally) {
      var url = this.baseUrl + module + '/list?t=' + timestamp + '&table=' + table + '&s=' + start + '&n=' + number
      var promise = httpGet(url)
      handlePromise(promise, callbackSuccess, callbackFinally)
    }

    this.submit = function (module, opt, payload, callbackSuccess, callbackFinally) {
      var url = this.baseUrl + module + '/' + opt
      var method = ''

      var operation = opt.toLowerCase()
      if (operation === 'remove') {
        method = 'DELETE'
      }
      else if (operation === 'add' || operation === 'signin') {
        method = 'POST'
      }
      else {
        method = 'PUT'
      }

      var promise = http(method, url, payload)
      handlePromise(promise, callbackSuccess, callbackFinally)
    }

    var httpGet = function (url) {
      // console.log('httpGet', url)
      var deferred = $q.defer()

      var accessToken = cfg.auth.access_token
      if (accessToken.length > 0) {
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken
      }

      $http({
        url     : url,
        method  : 'GET',
        headers : { 'Content-Type': 'application/json' },
        params  : ''
      })
        .success(function (result) {
          // console.log('success', result);
          deferred.resolve(result)
        })
        .error(function (result) {
          // console.log('error', result)
          deferred.reject(result)
        })

      return deferred.promise
    }

    var http = function (method, url, payload) {
      // console.log('http', method, url, payload)
      var deferred = $q.defer()

      var accessToken = cfg.auth.access_token
      if (accessToken.length > 0) {
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken
      }

      $http({
        url     : url,
        method  : method,
        headers : { 'Content-Type': 'application/json' },
        data    : payload
      })
        .success(function (result) {
          // console.log('success', result);
          deferred.resolve(result)
        })
        .error(function (result) {
          // console.log('error', result)
          deferred.reject(result)
        })

      return deferred.promise
    }

    var handlePromise = function (promise, callbackSuccess, callbackFinally) {
      promise
        .then(function (result) {
          // console.log('---- promise success')
          var code = result.code
          var message = result.message
          var obj = result.data

          if (code === 1) {
            callbackSuccess(obj)
            toaster.pop('success', '数据已同步', '', cfg.config.toasterTimeout)
          }
          else if (code === 401) {
            toaster.pop('error', '授权错误，请重新登录')
            $timeout(function () {
              $state.go('access.signin')
            }, 5000)
          }
          else if (code === 402) {
            refreshAuth(function (result) {
              var code = result.code
              var message = result.message
              var auth = result.data

              if (code === 1) {
                cfg.setAuth(auth)
              }
              else {
                toaster.pop('warning', '会话过期，请重新登录')
                $timeout(function () {
                  $state.go('access.signin')
                }, 5000)
              }
            },
            function (result) {
              toaster.pop('warning', '会话过期，请重新登录')
              $timeout(function () {
                $state.go('access.signin')
              }, 5000)
            })
          }
          else {
            toaster.pop('error', code, message)
          }
        },
        function (result) {
          // console.log('---- promise error')
          toaster.pop('error', 'Error', result)
        },
        function (result) {
          // console.log('---- promise notify')
          toaster.pop('info', 'Info', result, cfg.config.toasterTimeout)
        })
        .catch(function (exception) {
          // console.log('---- promise catch')
          toaster.pop('error', 'Error', exception)
        })
        .finally(function (result) {
          // console.log('---- promise finally');
          callbackFinally(result)
        })
    }

    var refreshAuth = function (callbackSuccess, callbackError) {
      // console.log('httpGet', that.refreshAuthUrl)
      var refreshToken = cfg.auth.refresh_token
      if (refreshToken.length > 0) {
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + refreshToken
      }

      $http({
        url     : that.refreshAuthUrl,
        method  : 'POST',
        headers : { 'Content-Type': 'application/json' },
        params  : ''
      })
        .success(function (result) {
          callbackSuccess(result)
        })
        .error(function (result) {
          callbackError(result)
        })
    }
  }
])

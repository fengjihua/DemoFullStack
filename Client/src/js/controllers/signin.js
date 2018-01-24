'use strict'

/* Controllers */
// signin controller
app.controller('SigninFormController', [
  '$scope',
  '$http',
  '$state',
  'restfulAPI',
  'adminConfig',
  function ($scope, $http, $state, api, cfg) {
    $scope.user = {}
    $scope.authError = null

    cfg.clearAuth()

    $scope.login = function () {
      $scope.authError = null

      var payload = {
        username : $scope.user.username,
        password : $scope.user.password
      }
      api.submit('auth', 'signin', payload, function (auth) {
        // success
        cfg.setAuth(auth)
        $state.go('app.dashboard')
      }, function () {
        // finally
      })
    }
  }
])

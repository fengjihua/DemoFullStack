'use strict'

// Modal controller
app.controller('ConfirmModalInstanceCtrl', [
  '$scope',
  '$modalInstance',
  'adminConfig',
  function ($scope, $modalInstance, cfg) {
    // $scope.items = items;
    // $scope.selected = {
    //   item: $scope.items[0]
    // };

    // console.log($rootScope.$$childHead.app)
    // $scope.timestamp = $rootScope.$$childHead.app.config.timestamp;
    $scope.timestamp = cfg.config.timestamp
    $scope.title = $modalInstance.params.title
    $scope.message = $modalInstance.params.message

    $scope.confirmOK = function () {
      $modalInstance.close('ok')
    }

    $scope.confirmCancel = function () {
      $modalInstance.dismiss('cancel')
    }
  }
])

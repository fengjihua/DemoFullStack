app.controller('TableCtrl', [
  '$scope',
  '$http',
  '$q',
  '$timeout',
  '$filter',
  '$modal',
  '$aside',
  'restfulAPI',
  'adminConfig',
  function ($scope, $http, $q, $timeout, $filter, $modal, $aside, api, cfg) {
    // console.log(api, cfg, localStorage);
    $scope.isLoading = false

    $scope.domainUrl = cfg.config.ossUrl

    //  pagination
    $scope.itemsByPage = 10
    // console.log('itemsByPage', $scope.itemsByPage)


    $scope.optAddItem = function () {
      $scope.formDialog('', 'add', null, function (obj) {
        var rowObj = obj
        $scope.rowCollection.push(rowObj)
        setLocalData($scope.module, $scope.rowCollection)
      })
    }

    $scope.optEditItem = function (rowObj) {
      $scope.formDialog('', 'edit', rowObj, function (obj) {
        rowObj = obj
        setLocalData($scope.module, $scope.rowCollection)
      })
    }

    $scope.optRemoveItem = function (rowObj) {
      $scope.confirmDialog('sm', 'remove', rowObj, function () {
        var index = $scope.rowCollection.indexOf(rowObj)
        if (index !== -1) {
          $scope.rowCollection.splice(index, 1)
          setLocalData($scope.module, $scope.rowCollection)
        }
      })
    }

    $scope.optNewItem = function (rowObj) {
      $scope.confirmDialog('sm', 'new', rowObj, function () {
        rowObj.is_new = rowObj.is_new === 0 ? 1 : 0
        setLocalData($scope.module, $scope.rowCollection)
      })
    }

    $scope.optHotItem = function (rowObj) {
      $scope.confirmDialog('sm', 'hot', rowObj, function () {
        rowObj.is_hot = rowObj.is_hot === 0 ? 1 : 0
        setLocalData($scope.module, $scope.rowCollection)
      })
    }

    $scope.optRecommendItem = function (rowObj) {
      $scope.confirmDialog('sm', 'recommend', rowObj, function () {
        rowObj.is_recommend = rowObj.is_recommend === 0 ? 1 : 0
        setLocalData($scope.module, $scope.rowCollection)
      })
    }

    $scope.confirmDialog = function (size, opt, rowObj, callbackSuccess) {
      var modalInstance = $modal.open({
        size        : size,
        templateUrl : 'myModalContent.html',
        controller  : 'ConfirmModalInstanceCtrl'
      })
      modalInstance.params = {
        title   : 'Confirm',
        message : 'Are you sure?'
      }

      modalInstance.result.then(function () {
        // ok: do api
        // console.log(result);
        $scope.isLoading = true
        api.submit($scope.module, opt, rowObj, function () {
          // success
          callbackSuccess()
        }, function () {
          // finally
          $scope.isLoading = false
        })
      }, function () {
        // cancel: do nothing
        // console.log(result);
      })
    }

    $scope.formDialog = function (size, opt, rowObj, callbackSuccess) {
      var modalInstance = $aside.open({
        size        : size,
        placement   : 'left',
        templateUrl : 'myFormContent.html',
        controller  : 'FormInstanceCtrl'
      })
      modalInstance.params = {
        opt     : opt,
        payload : rowObj
      }

      modalInstance.result.then(function (formData) {
        // ok: do api
        // console.log('ok', formData);
        $scope.isLoading = true
        api.submit($scope.module, opt, formData, function (obj) {
          // success
          callbackSuccess(obj)
        }, function () {
          // finally
          $scope.isLoading = false
        })
      }, function () {
        // cancel: do nothing
        // console.log('calcel', result);
      })
    }

    $scope.loadData = function (tableState) {
      // if ($scope.isLoading) { return }
      console.log('====== loadData ======', $scope.module)

      // here you could create a query string from tableState
      if (tableState) {
        tableState.pagination.number = tableState.pagination.number || $scope.itemsByPage
        $scope.tableState = tableState
      }
      else {
        tableState = $scope.tableState
      }

      if ($scope.module.indexOf('order') >= 0) {
        var moduleName = 'order'
        
        var timestamp = 1
        if ($scope.module === 'order.today') {
          timestamp = 0
        }

        var pagination = tableState.pagination
        var start = pagination.start || 0 // This is NOT the page number, but the index of item in the list that you want to use to display the table.
        var number = pagination.number || 10 // Number of entries showed per page.

        var predicateObject = tableState.search.predicateObject || {}
        var table = predicateObject.table || ''

        $scope.isLoading = true
        api.queryOrder(moduleName, timestamp, table, start, number, function (serverData) {
          // success
          // console.log(serverData)
          // setLocalData($scope.module, serverData)
          // filterData(serverData)
          $scope.rowCollection = serverData.orders
          $scope.tableState.pagination.numberOfPages = Math.ceil(serverData.count / $scope.itemsByPage)
          // console.log($scope.tableState.pagination.numberOfPages)
        }, function () {
          // finally
          $scope.isLoading = false
        })
      }
      else {
        var localData = getLocalData($scope.module)
        if (localData) {
          // use local data
          filterData(localData)
        }
        if ($scope.mustQuery || !localData) {
          // query server data
          $scope.isLoading = true
          api.query($scope.module, function (serverData) {
            // success
            setLocalData($scope.module, serverData)
            filterData(serverData)
          }, function () {
            // finally
            $scope.isLoading = false
          })
        }
      }
    }

    $scope.refreshData = function () {
      $scope.mustQuery = true
      $scope.loadData()
      $scope.mustQuery = false
    }

    var filterData = function (dataCollection) {
      var tableState = $scope.tableState
      var filtered = tableState.search.predicateObject
        ? $filter('filter')(dataCollection, tableState.search.predicateObject)
        : dataCollection

      if (tableState.sort.predicate) {
        filtered = $filter('orderBy')(filtered, tableState.sort.predicate, tableState.sort.reverse)
      }

      // var pages = Math.ceil(filtered.length / number);
      // $scope.rowCollection = filtered.slice(start, start + number)
      $scope.rowCollection = filtered
    }

    var setLocalData = function (module, dataCollection) {
      if (module === 'category' || module === 'sku' || module === 'item') {
        console.log('localSave', module)
        localStorage.setItem(module, JSON.stringify(dataCollection))
      }
    }

    var getLocalData = function (module) {
      if (module === 'category' || module === 'sku' || module === 'item') {
        var localDataCollection = JSON.parse(localStorage.getItem(module))
        console.log('localGet', module, localDataCollection)

        return localDataCollection
      }
      else {
        return null
      }
    }

    $scope.initSelectCategory = function () {
      $scope.categoryCollection = getLocalData('category')
      $scope.selectedCategory = ''
    }

    $scope.selectCategory = function () {
      if ($scope.tableState) {
        $scope.tableState.search.predicateObject = $scope.tableState.search.predicateObject || {}
        if ($scope.selectedCategory) {
          $scope.tableState.search.predicateObject.cid = $scope.selectedCategory
        }
        else if ($scope.tableState.search.predicateObject.cid) {
          delete $scope.tableState.search.predicateObject.cid
        }
        $scope.loadData()
      }
    }
  }
])

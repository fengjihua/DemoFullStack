'use strict'

// Form controller
app.controller('FormInstanceCtrl', [
  '$scope',
  '$filter',
  '$modalInstance',
  'FileUploader',
  'toaster',
  'restfulAPI',
  'adminConfig',
  function ($scope, $filter, $modalInstance, FileUploader, toaster, api, cfg) {
    $scope.timestamp = cfg.config.timestamp
    $scope.uploadUrl = null
    $scope.formDataNeedInit = false
    $scope.formData = {}

    // Init formData
    $scope.operation = $modalInstance.params.opt.toLowerCase()
    if ($scope.operation === 'edit') {
      $scope.formDataNeedInit = false
      $scope.formData = $modalInstance.params.payload
    }
    else {
      $scope.formDataNeedInit = true
    }

    // Submit formData
    $scope.processForm = function () {
      // console.log('formData', $scope.formData);
      // console.log('formData.sku', $scope.formData.sku);
      // console.log('formData.skuCollection', $scope.skuCollection);

      if ($scope.uploadUrl) {
        if ($scope.formData.icon_url) $scope.formData.icon_url = $scope.uploadUrl
        if ($scope.formData.image_url) $scope.formData.image_url = $scope.uploadUrl
      }
      if ($scope.skuDetailCollection) {
        $scope.formData.sku = []
        $scope.formData.price = []
        for (var i = 0; i < $scope.skuDetailCollection.length; i++) {
          $scope.formData.sku.push($scope.skuDetailCollection[i].name)
          $scope.formData.price.push(parseFloat($scope.skuDetailCollection[i].price))
        }
      }
      if ($scope.skuCollection) {
        $scope.formData.skuid = []
        $scope.formData.sku_title = []
        $scope.skuCollection = $filter('orderBy')($scope.skuCollection, 'sort', false)
        // console.log($scope.skuCollection)
        for (i = 0; i < $scope.skuCollection.length; i++) {
          if ($scope.skuCollection[i].checked) {
            $scope.formData.skuid.push($scope.skuCollection[i].id)
            $scope.formData.sku_title.push(($scope.skuCollection[i].title))
          }
        }
      }
      if ($scope.itemCollection) {
        return
      }
      // console.log($scope.formData);
      $modalInstance.close($scope.formData)
    }

    // $scope.processIcon = function(files) {
    //     console.log('processIcon', files[0]);
    // }

    /*
    ** form category
    */
    $scope.initFormCategory = function () {
      initUploader(api.uploadUrl.category)
    }

    /*
    ** form sku
    */
    $scope.initFormSku = function () {
      // console.log('initFormSku');
      $scope.skuDetailCollection = []
      if ($scope.operation === 'add') {
        $scope.formData.sku = []
        $scope.formData.price = []
      }
      for (var i = 0; i < $scope.formData.sku.length; i++) {
        var skuDetail = {
          id    : i + 1,
          name  : $scope.formData.sku[i],
          price : $scope.formData.price[i]
        }
        // xeditable table
        $scope.skuDetailCollection.push(skuDetail)
      }
      // $scope.formData.xedit = [
      //   {id: 1, name: '七分甜', price: 3},
      //   {id: 2, name: '五分甜', price: 2},
      //   {id: 3, name: '三分甜', price: 1},
      //   {id: 4, name: '无糖', price: 0},
      // ];
      // console.log($scope.formData.xedit);
    }

    $scope.removeSkuDetail = function (row) {
      var index = $scope.skuDetailCollection.indexOf(row)
      if (index !== -1) {
        $scope.skuDetailCollection.splice(index, 1)
      }
    }

    $scope.addSkuDetail = function () {
      $scope.inserted = {
        id    : $scope.skuDetailCollection.length + 1,
        name  : '',
        price : 0
      }
      $scope.skuDetailCollection.push($scope.inserted)
    }

    $scope.checkSkuDetailName = function (value, id) {
      if (id === 2 && value !== 'awesome') {
        //   return 'Username 2 should be `awesome`';
      }

      return null
    }

    $scope.checkSkuDetailPrice = function (value, id) {
      if (id === 2 && value !== 'awesome') {
        //   return 'Username 2 should be `awesome`';
      }

      return null
    }

    /*
    ** form item
    */
    var bindSkuCollection = function (dataCollection) {
      if ($scope.formData.skuid) {
        for (var i = 0; i < $scope.formData.skuid.length; i++) {
          var filter = $filter('filter')(dataCollection, { 'id': $scope.formData.skuid[i] }, false)
          if (filter[0]) {
            filter[0].checked = true
            $scope.skuCollection.push(filter[0])
          }
        }
        for (i = 0; i < dataCollection.length; i++) {
          var id = dataCollection[i].id
          if ($scope.formData.skuid.indexOf(id) < 0) {
            dataCollection[i].checked = false
            $scope.skuCollection.push(dataCollection[i])
          }
        }
      }
      else {
        for (i = 0; i < dataCollection.length; i++) {
          dataCollection[i].checked = false
          $scope.skuCollection.push(dataCollection[i])
        }
      }
      for (i = 0; i < $scope.skuCollection.length; i++) {
        $scope.skuCollection[i].sort = i + 1
      }
      // console.log($scope.skuCollection)
    }

    $scope.initFormItem = function () {
      $scope.categoryCollection = []
      $scope.skuCollection = []
      initUploader(api.uploadUrl.item)

      var localCategory = JSON.parse(localStorage.getItem('category'))
      $scope.categoryCollection = localCategory

      var localSku = JSON.parse(localStorage.getItem('sku'))
      bindSkuCollection(localSku)

      var sortable = angular.element('#sortable')
      sortable.bind('sortupdate', function () {
        // Triggered when the user stopped sorting and the DOM position has changed.
        var inputs = sortable.find('input')
        for (var i = 0; i < inputs.length; i++) {
          var id = inputs[i].value
          for (var j = 0; j < $scope.skuCollection.length; j++) {
            if ($scope.skuCollection[j].id === id) {
              $scope.skuCollection[j].sort = i + 1
            }
          }
          // var title = inputs[i].title;
          // console.log(id, title, $scope.skuCollection);
        }
      })
    }

    /*
    ** form order
    */
    var bindOrderTime = function () {
      $scope.createtime = $filter('date')($scope.formData.createtime * 1000, 'yyyy-MM-dd HH:mm:ss')
      $scope.updatetime = $filter('date')($scope.formData.updatetime * 1000, 'yyyy-MM-dd HH:mm:ss')
    }

    $scope.initFormOrder = function () {
      $scope.itemCollection = []
      $scope.itemCollection = $scope.formData.items

      $scope.sum = 0
      for (var i = 0; i < $scope.itemCollection.length; i++) {
        $scope.sum += $scope.itemCollection[i].price
      }

      bindOrderTime()
    }

    $scope.orderCheck = function () {
      // console.log('orderCheck')
      var payload = { id: $scope.formData.id }
      api.submit('order', 'check', payload, function (obj) {
        // success
        $scope.formData.is_check = obj.is_check
        $scope.formData.reason = obj.reason
        $scope.formData.updatetime = obj.updatetime

        bindOrderTime()
      }, function () {
        // finally
      })
    }

    $scope.orderTogo = function () {
      // console.log('orderTogo')
    }

    /*
    ** file upload
    */
    var initUploader = function (apiUrl) {
      var accessToken = cfg.auth.access_token

      // FileUploader
      var uploader = $scope.uploader = new FileUploader({
        url        : apiUrl,
        autoUpload : true,
        headers    : { 'Authorization': 'Bearer ' + accessToken }
      })
      // console.info('uploader', uploader);

      // FileUploader FILTERS
      // uploader.filters.push({
      //     name: 'customFilter',
      //     fn: function(item /*{File|FileLikeObject}*/, options) {
      //         return this.queue.length < 10;
      //     }
      // });
      uploader.filters.push({
        name : 'imageFilter',
        fn   : function (item /* {File|FileLikeObject} */, options) {
          var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|'

          // return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
          return '|jpg|png|jpeg|'.indexOf(type) !== -1
        }
      })

      // FileUploader CALLBACKS
      uploader.onWhenAddingFileFailed = function (item, filter, options) {
        // console.info('onWhenAddingFileFailed', item, filter, options);
      }
      uploader.onAfterAddingFile = function (fileItem) {
        // console.info('onAfterAddingFile', fileItem);
        // fileItem.upload();
      }
      uploader.onAfterAddingAll = function (addedFileItems) {
        // console.info('onAfterAddingAll', addedFileItems);
      }
      uploader.onBeforeUploadItem = function (item) {
        // console.info('onBeforeUploadItem', item);
      }
      uploader.onProgressItem = function (fileItem, progress) {
        // console.info('onProgressItem', fileItem, progress);
      }
      uploader.onProgressAll = function (progress) {
        // console.info('onProgressAll', progress);
      }
      uploader.onSuccessItem = function (fileItem, response, status, headers) {
        // console.info('onSuccessItem', fileItem, response, status, headers);
        var code = response.code
        var message = response.message
        var obj = response.data

        if (code === 1) {
          $scope.uploadUrl = obj.url
          toaster.pop('success', '图片已上传', '', cfg.config.toasterTimeout)
        }
        else {
          $scope.uploadUrl = null
          toaster.pop('error', '图片上传失败', message)
        }
      }
      uploader.onErrorItem = function (fileItem, response, status, headers) {
        // console.info('onErrorItem', fileItem, response, status, headers);
        $scope.uploadUrl = null
        toaster.pop('error', 'title', 'Upload error')
      }
      uploader.onCancelItem = function (fileItem, response, status, headers) {
        // console.info('onCancelItem', fileItem, response, status, headers);
        $scope.uploadUrl = null
      }
      uploader.onCompleteItem = function (fileItem, response, status, headers) {
        // console.info('onCompleteItem', fileItem, response, status, headers);
      }
      uploader.onCompleteAll = function () {
        // console.info('onCompleteAll');
      }
    }
  }
])

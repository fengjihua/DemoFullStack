
/*!
 * angular-aside - v1.4.0
 * https://github.com/dbtek/angular-aside
 * 2017-03-27
 * Copyright (c) 2017 İsmail Demirbilek
 * License: MIT
 */

(function() {
  'use strict';

  /**
   * @ngdoc overview
   * @name ngAside
   * @description
   * Main module for aside component.
   * @function
   * @author İsmail Demirbilek
   */
  angular.module('ngAside', ['ui.bootstrap']);
})();

(function() {
  'use strict';

  angular.module('ngAside')
    /**
     * @ngdoc service
     * @name ngAside.services:$aside
     * @description
     * Factory to create a uibModal instance to use it as aside. It simply wraps $uibModal by overriding open() method and sets a class on modal window.
     * @function
     */
    .factory('$aside', ['$modal', function($modal) {
      var defaults = this.defaults = {
        placement: 'left'
      };

      var asideFactory = {
        // override open method
        open: function(config) {
          var options = angular.extend({}, defaults, config);
          // check placement is set correct
          if(['left', 'right', 'bottom', 'top'].indexOf(options.placement) === -1) {
            options.placement = defaults.placement;
          }
          var vertHoriz = ['left', 'right'].indexOf(options.placement) === -1 ? 'vertical' : 'horizontal';
          // set aside classes
          options.windowClass  = 'ng-aside ' + vertHoriz + ' ' + options.placement + (options.windowClass ? ' ' + options.windowClass : '');
          delete options.placement
          return $modal.open(options);
        }
      };

      // create $aside as extended $modal
      var $aside = angular.extend({}, $modal, asideFactory);
      return $aside;
    }]);
})();

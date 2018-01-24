'use strict';

/**
 * Config for the router
 */
angular
	.module('app')
	.run([
		'$rootScope',
		'$state',
		'$stateParams',
		function($rootScope, $state, $stateParams) {
			$rootScope.$state = $state;
			$rootScope.$stateParams = $stateParams;
		},
	])
	.config([
		'$stateProvider',
		'$urlRouterProvider',
		'JQ_CONFIG',
		'MODULE_CONFIG',
		function($stateProvider, $urlRouterProvider, JQ_CONFIG, MODULE_CONFIG) {
			var timestamp = Date.now();
			var layout = 'tpl/app.html?v=' + timestamp;

			// set default router
			$urlRouterProvider.otherwise('/app/dashboard');
			// $urlRouterProvider.otherwise('/access/signin');

			$stateProvider
				.state('access', {
					url: '/access',
					template: '<div ui-view class="fade-in-right-big smooth"></div>',
				})
				.state('access.signin', {
					url: '/signin',
					templateUrl: 'tpl/page_signin.html?v=' + timestamp,
					resolve: load(['toaster']),
				})
				.state('app', {
					abstract: true,
					url: '/app',
					templateUrl: layout,
				})
				.state('app.dashboard', {
					url: '/dashboard',
					templateUrl: 'tpl/app_dashboard.html?v=' + timestamp,
					resolve: load(['js/controllers/chart.js']),
				})
				.state('app.category', {
					url: '/category',
					templateUrl: 'tpl/table/category.html?v=' + timestamp,
					resolve: load([
						'smart-table', 
						'toaster', 
						'ngAside', 
						'angularFileUpload', 
						'lightbox2'
					]),
				})

			function load(srcs, callback) {
				return {
					deps: [
						'$ocLazyLoad',
						'$q',
						function($ocLazyLoad, $q) {
							var deferred = $q.defer();
							var promise = false;
							srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
							if (!promise) {
								promise = deferred.promise;
							}
							angular.forEach(srcs, function(src) {
								promise = promise.then(function() {
									if (JQ_CONFIG[src]) {
										return $ocLazyLoad.load(JQ_CONFIG[src]);
									}
									angular.forEach(MODULE_CONFIG, function(module) {
										if (module.name == src) {
											name = module.name;
										} else {
											name = src;
										}
									});

									return $ocLazyLoad.load(name);
								});
							});
							deferred.resolve();
							return callback
								? promise.then(function() {
										return callback();
									})
								: promise;
						},
					],
				};
			}
		},
	])
	// // Clear template cache
	// .run(function($rootScope, $templateCache) {
	// 	$rootScope.$on('$routeChangeStart', function(event, next, current) {
	// 		if (typeof current !== 'undefined') {
	// 			$templateCache.remove(current.templateUrl);
	// 		}
	// 	});
	// });

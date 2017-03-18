angular.module('hang', [
		'hang.services',
		'hang.auth',
		'ngRoute'
	])
	.config(function ($routeProvider, $httpProvider, $locationProvider) {
		$routeProvider
			.when('/signin', {
				templateUrl: 'app/auth/signin.html',
				controller: 'AuthController'
			})
			.when('/signup', {
				templateUrl: 'app/auth/signup.html',
				controller: 'AuthController'
			})
			.when('/home', {
				templateUrl: 'app/auth/home.html',
				controller: 'AuthController'
			})
			.otherwise({
				redirectTo: '/signin'
			});

		$locationProvider.hashPrefix('');
		$httpProvider.interceptors.push('AttachTokens');
	})

	.factory('AttachTokens', function ($window) {
		var attach = {
			request: function (object) {
				var jwt = $window.localStorage.getItem('com.hang');
				if (jwt) {
					object.headers['x-access-token'] = jwt;
				}
				object.headers['Allow-Control-Allow-Origin'] = '*';
				return object;
			}
		};
		return attach;
	})
	.run(function ($rootScope, $location, Auth) {
		$rootScope.$on('$routeChangeStart', function (evt, next, current) {
			if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
				$location.path('/signin');
			}
		});

	})
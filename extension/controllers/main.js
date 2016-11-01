angular.module('mainController', ['ui.router'])

.controller('main', function($scope, $http, $location, $state, __url) {
  const destUrl = __env.destUrl;
  $scope.testSession = function() {
    chrome.tabs.create({url: destUrl + '/dashboard.html'})
  },
  $scope.signOut = function() {
    chrome.cookies.remove({url: destUrl + '/dashboard.html', name: 'username'}, function(removedCookie) {
      console.log(removedCookie);
    });
    chrome.cookies.remove({url: destUrl + '/', name: 'connect.sid'}, function(removedCookie) {
      console.log(removedCookie);
      localStorage.removeItem('username');
      $state.transitionTo('login');
    });

  };
});

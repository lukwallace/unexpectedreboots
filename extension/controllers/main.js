angular.module('mainController', ['ui.router'])

.controller('main', function($scope, $http, $location, $state, __env) {
  const liveUrl = __env.liveUrl;
  $scope.testSession = function() {
    chrome.tabs.create({url: liveUrl + '/client/dashboard.html'})
  },
  $scope.signOut = function() {
    chrome.cookies.remove({url: liveUrl + '/client/dashboard.html', name: 'username'}, function(removedCookie) {
      console.log(removedCookie);
    });
    chrome.cookies.remove({url: liveUrl + '/', name: 'connect.sid'}, function(removedCookie) {
      console.log(removedCookie);
      localStorage.removeItem('username');
      $state.transitionTo('login');
    });

  };
});

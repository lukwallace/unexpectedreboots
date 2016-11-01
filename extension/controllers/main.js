angular.module('mainController', ['ui.router'])

.controller('main', function($scope, $http, $location, $state) {
  $scope.testSession = function() {
    chrome.tabs.create({url: 'http://162.243.154.104:3000/dashboard.html'})
  },
  $scope.signOut = function() {
    chrome.cookies.remove({url: 'http://162.243.154.104:3000/dashboard.html', name: 'username'}, function(removedCookie) {
      console.log(removedCookie);
    });
    chrome.cookies.remove({url: 'http://162.243.154.104:3000/', name: 'connect.sid'}, function(removedCookie) {
      console.log(removedCookie);
      localStorage.removeItem('username');
      $state.transitionTo('login');
    });

  };
});

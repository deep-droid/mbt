angular.module('ui.bootstrap.demo', ['ngAnimate', 'ui.bootstrap']);
angular.module('ui.bootstrap.demo').controller('CarouselDemoCtrl', function ($rootScope, $scope, $http, $uibModal) {
  	$scope.playInterval = -1;
  	$scope.noWrapSlides = true;
  	$scope.active = 0;
  	$scope.slides = [];
  	$scope.videoList = [];
  	var active = $scope.active;

	$scope.callURL = function (url, successCB, errorCB, alertCB) {
		url = url + "&rnd="+new Date().getTime();
		$http.get(url)
			.success(function(returnData, status) {
				if (returnData.error) {
					if (errorCB) errorCB(returnData);
					else alertMsg([returnData.error]);
				}
				else if (returnData.alertMessage && returnData.alertMessage!='ok') {
					if (alertCB) alertCB(returnData);
					else if (errorCB) errorCB(returnData);
					else alertMsg([returnData.alertMessage]);
				}
				else {
					if (successCB) successCB(returnData);
				}
			})
			.error(function(returnData, status) {
				if (errorCB) errorCB(returnData);
				else alertMsg(["Http error: " + status]);
			});
	}
  
	$scope.init = function () {
		$scope.callURL ("../app=websvc&action=video&cmd=videoList", function (retData) {
			$scope.videoList = retData;
			if ($scope.videoList.length == 0) {
				$scope.videoList.push ({name: "-- No Video --"});
			}
			$scope.openVideo($scope.videoList[0]);
			
			$scope.$watch ('active', function (newVal, oldVal) {
				setSlideAt(newVal);
			});
		});
	}
	
	function setSlideAt (slideId) {
		$scope.active = slideId;
		var slideId1 = slideId - 3;
		var slideId2 = slideId + 10;
		for (var i in $scope.slides) {
			var slide = $scope.slides[i];
			if (i < slideId1 || i > slideId2) {
				slide.imgName = 'blank';
			}
			else slide.imgName = slide.fname;
		}
	}
	
	$scope.openVideo = function (video) {
		if (video==undefined || video.createDT == undefined) {
			return;
		}
		
		$scope.callURL ("../app=websvc&action=video&cmd=videoSlideList&name=" + video.name, function (retData) {
			$scope.curVideo = video;
			$scope.slides = retData.fileList;
			$scope.startDT = retData.startDT;
			$scope.endDT = retData.endDT;
			$scope.startTS = retData.startTS;
			$scope.endTS = retData.endTS;
			$scope.saveAsName = video.name;
			for (var i in $scope.slides) {
				var slide = $scope.slides[i];
				slide.id = i;
			}
			
			if ($scope.slides == undefined || $scope.slides.length == 0) {
				$scope.slides = [];
				$scope.slides.push({fname: "blank", imgName: "blank", dt: "", ts: ""});
			}
			setSlideAt(0);
		});
	}

	$scope.delCurVideo = function () {
		$scope.callURL ("../app=websvc&action=video&cmd=delVideo&name=" + $scope.curVideo.name, function (retData) {
			alertMsg (["Video " + $scope.curVideo.name + " has been deleted."]);
			var idx = $scope.videoList.indexOf($scope.curVideo);
			$scope.videoList.splice(idx,1);
			$scope.openVideo ($scope.videoList[0]);
		});
	}
	
	$scope.renameCurVideo = function (newName) {
		$scope.callURL ("../app=websvc&action=video&cmd=renameVideo&newName=" + newName, function (retData) {
			$scope.curVideo.name = newName;
			$scope.openVideo ($scope.curVideo);
		});
	}
	
	$scope.playPause = function (playMode) {
		if (playMode) {
			$scope.playInterval = 5000;
		}
		else {
			$scope.playInterval = 0;
		}
	}
   
    function alertMsg (msgList) {
	    var modalInstance = $uibModal.open({
	      animation: $scope.animationsEnabled,
	      templateUrl: 'alertPopup.html',
	      controller: 'ModalInstanceCtrl',
	      resolve: {
	        items: function () {
	          return msgList;
	        }
	      }
	    });
    }
    
	$scope.init();


})
.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items) {
  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $uibModalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
})
.directive('toggle', function(){
  return {
    restrict: 'A',
    link: function(scope, element, attrs){
      if (attrs.toggle=="tooltip"){
        $(element).tooltip();
      }
      if (attrs.toggle=="popover"){
        $(element).popover();
      }
    }
  };
});


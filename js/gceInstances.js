/**
 * Created by danielrivkin on 6/1/15.
 */

var app = angular.module('app', ['ngMaterial']);

app.controller('Controller', ['$scope', '$http', '$window', '$location', '$filter', function ($scope, $http, $window, $location, $filter) {

    var filteredDataTemp;

    $scope.head = {
        "instance_type": "Name",
        "family": "Family",
        "vCPU": "vCPU",
        "memory": "Memory",
        "GECU": "GECU",
        "linux": "Linux Cost",
        "windows": "Windows Cost",
        "suse": "Suse Cost",
        "rhel": "Rhel Cost",
        "preemptible": "Preemptible Cost"
    };

    $scope.costs = [ {name:'hourly', 'mult': 1},
        {name:'daily', 'mult': 24},
        {name:'weekly', 'mult': 168},
        {name:'monthly', 'mult': 732},
        {name:'anually', 'mult': 8760}
    ];

    $scope.regions = [];

    $scope.families = ['--'];

    $scope.selRegion = 'us';

    $scope.sort = {
        column: 'instance_type',
        descending: true
    };

    $scope.sortOrder = [];

    $scope.getAllRegionsNFamilies = function() {

        angular.forEach($scope.allData, function(instance, i) {
            angular.forEach(instance.pricing, function(price, region) {
                if ($scope.regions.indexOf(region) == -1) { $scope.regions = $scope.regions.concat(region); }
            });

            if ($scope.families.indexOf(instance.family) == -1) { $scope.families = $scope.families.concat(instance.family); }
        });
    }

    $scope.filterData = function() {

        //$scope.filteredData = [];
        var allDataTemp = angular.copy($scope.allData);
        filteredDataTemp = [];

        angular.forEach(allDataTemp, function(instance, i) {
            if (instance.family == $scope.familyFilter || $scope.familyFilter == $scope.families[0]) {
                var filteredPricing = {};
                angular.forEach(instance.pricing, function(obj, iRegion) {
                    if (iRegion == $scope.regionFilter) {
                        angular.copy(obj, filteredPricing);
                        if ($scope.costFilter != undefined) {
                            var mult = 1;
                            angular.forEach($scope.costs, function(cost, i) {
                                if (cost.name == $scope.costFilter) { mult = cost.mult; }
                            });
                            angular.forEach(filteredPricing, function(price, os) {
                                //filteredPricing[os] = $filter('number')(filteredPricing[os]*mult, 3);
                                instance[os] = parseFloat($filter('number')(filteredPricing[os]*mult, 3));
                            });
                        }
                    }
                });
                //instance.currPricing = filteredPricing;
                instance.pricing = {};
                filteredDataTemp = filteredDataTemp.concat(instance);
            }
        });
        //$scope.filteredData = [];
        $scope.filteredData = filteredDataTemp;

        $scope.orderByFunc($scope.sort.column);

    }

    $scope.selectedCls = function(column) {
        return column == scope.sort.column && 'sort-' + scope.sort.descending;
    }

    $scope.changeSorting = function(column) {
        var sort = $scope.sort;
        if (sort.column == column) {
            sort.descending = !sort.descending;
        } else {
            sort.column = column;
            sort.descending = false;
        }
        if (sort.descending === false) { $scope.sortOrder[column] = 'fa-angle-double-up'; }
        else { $scope.sortOrder[column] = 'fa-angle-double-down'; }
    };

    $scope.orderByFunc = function(column) {

        $scope.changeSorting(column);

        $scope.filteredData = $filter('orderBy')($scope.filteredData, column, $scope.sort.descending);

        angular.forEach($scope.head, function(name, column) {

            if (column === $scope.sort.column) {
                $scope.sortOrder[column] += ' activeColumn';
            } else {
                $scope.sortOrder[column] += ' passiveColumn';
            }
        });
        console.log($scope.sortOrder);
    }

    $http.get('scraper/instances.json').success (function(data){

        $scope.allData = data;

        $scope.getAllRegionsNFamilies();

        $scope.regionFilter = 'us';
        $scope.familyFilter = $scope.families[0];
        $scope.costFilter = $scope.costs[0].name;

        $scope.filterData();
        angular.forEach($scope.head, function(name, column) {

            $scope.sortOrder[column] = 'fa-angle-double-up';
            if (column === 'instance_type') {
                $scope.sortOrder[column] += ' activeColumn';
            } else {
                $scope.sortOrder[column] += ' passiveColumn';
            }
        });

    });

}]);

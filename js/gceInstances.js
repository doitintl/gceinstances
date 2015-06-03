/**
 * Created by danielrivkin on 6/1/15.
 */

var app = angular.module('app', ['ngMaterial']);

app.controller('Controller', ['$scope', '$http', '$window', '$location', '$filter', function ($scope, $http, $window, $location, $filter) {

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
        descending: false
    };

    $scope.showArrow = [];

    $scope.getAllRegionsNFamilies = function() {

        angular.forEach($scope.allData, function(instance, i) {
            angular.forEach(instance.pricing, function(price, region) {
                if ($scope.regions.indexOf(region) == -1) { $scope.regions = $scope.regions.concat(region); }
            });

            if ($scope.families.indexOf(instance.family) == -1) { $scope.families = $scope.families.concat(instance.family); }
        });
    }

    $scope.filterData = function() {

        $scope.filteredData = [];
        var allDataTemp = angular.copy($scope.allData);

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
                $scope.filteredData = $scope.filteredData.concat(instance);
                $scope.orderByFunc($scope.sort.column);
            }
        });
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
        if (sort.descending === false) { $scope.sortOrder = 'fa-angle-double-up'; }
        else { $scope.sortOrder = 'fa-angle-double-down'; }
    };

    $scope.orderByFunc = function(column) {
        //if (column.indexOf('cost') !== -1) {

        //} else {
            $scope.filteredData = $filter('orderBy')($scope.filteredData, column, $scope.sort.descending);
        //}

        angular.forEach($scope.head, function(name, column) {

            if (column === $scope.sort.column) {
                $scope.showArrow[column] = true;
            } else {
                $scope.showArrow[column] = false;
            }
        });
    }

    $http.get('scraper/instances.json').success (function(data){

        $scope.allData = data;

        $scope.getAllRegionsNFamilies();

        $scope.regionFilter = 'us';
        $scope.familyFilter = $scope.families[0];
        $scope.costFilter = $scope.costs[0].name;

        $scope.filterData();
        $scope.sortOrder = 'fa-angle-double-up'
    });

}]);

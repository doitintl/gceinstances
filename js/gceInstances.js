/**
 * Created by danielrivkin on 6/1/15.
 */

var app = angular.module('app', ['ngMaterial']);

app.controller('Controller', ['$scope', '$http', '$window', '$mdSidenav', '$filter', function ($scope, $http, $window, $mdSidenav, $filter) {

    var filteredDataTemp;

    $scope.head = {
        "instance_type": "Name",
        "family": "Family",
        "vCPU": "vCPU",
        "memory": "Memory",
        "GECU": "GECU",
        "linux": "Linux",
        "windows": "Windows",
        "suse": "SUSE",
        "rhel": "RHEL",
        "preemptible": "Preemptible"
    };

    $scope.headMobile = {
        "instance_type": "Name",
        "vCPU": "vCPU",
        "memory": "Memory",
        "linux": "Linux"
    };

    $scope.costs = [ {name:'Hourly', 'mult': 1},
        {name:'Daily', 'mult': 24},
        {name:'Weekly', 'mult': 168},
        {name:'Monthly', 'mult': 732},
        {name:'Anually', 'mult': 8760}
    ];

    $scope.regions = [];

    $scope.families = ['All'];

    $scope.regionFilter = 'US';

    $scope.sort = {
        column: 'instance_type',
        descending: false
    };

    $scope.sortChanged = false;

    $scope.sortOrder = [];

    $scope.user = true;

    $scope.showColumn = false;

    $scope.centerColomnHead = [];

    $scope.toggleSidenav = function() {
        $mdSidenav('left').toggle();
    }

    $scope.getAllRegionsNFamilies = function() {

        angular.forEach($scope.allData, function(instance, i) {
            angular.forEach(instance.pricing, function(price, region) {
                if ($scope.regions.indexOf(region) === -1) { $scope.regions = $scope.regions.concat(region); }
            });

            if ($scope.families.indexOf(instance.family) === -1) { $scope.families = $scope.families.concat(instance.family); }
        });
        angular.forEach($scope.regions, function(region, i) {
            $scope.regions[i] = region.toUpperCase();
        });
    }

    $scope.calulatePrice = function(os, instance, price) {

        if ($scope.costFilter === 'Monthly' || $scope.costFilter === 'Anually') {
            if (os === 'linux') {
                price *= 0.7;
            }
            else if (os === 'windows') {
                if (instance.instance_type === 'f1-micro' || instance.instance_type === 'g1-small') {
                    price = (price - 0.02) * 0.7 + 0.02;
                } else {
                    price = (price - 0.04 * instance.vCPU) * 0.7 +  0.04 * instance.vCPU;
                }
            } else if (os === 'suse') {
                if (instance.instance_type === 'f1-micro' || instance.instance_type === 'g1-small') {
                    price = (price - 0.02) * 0.7 + 0.02;
                } else {
                    price = (price - 0.11) * 0.7 +  0.11;
                }
            } else if (os === 'rhel') {
                if (instance.vCPU < 8) {
                    price = (price - 0.06) * 0.7 + 0.06;
                } else {
                    price = (price - 0.13) * 0.7 + 0.13;
                }
            }
        }
        return price;
    }

    $scope.filterData = function() {

        var allDataTemp = angular.copy($scope.allData);
        filteredDataTemp = [];

        angular.forEach(allDataTemp, function(instance, i) {

            if (instance.family === $scope.familyFilter || $scope.familyFilter == $scope.families[0]) {

                var filteredPricing = {};

                angular.forEach(instance.pricing, function(obj, iRegion) {

                    if (iRegion.toUpperCase() === $scope.regionFilter) {

                        angular.copy(obj, filteredPricing);

                        if ($scope.costFilter !== undefined) {

                            var mult = 1;
                            angular.forEach($scope.costs, function(cost, i) {
                                if (cost.name === $scope.costFilter) { mult = cost.mult; }
                            });
                            angular.forEach(filteredPricing, function(price, os) {
                                price = $scope.calulatePrice(os, instance, price);
                                instance[os] = parseFloat($filter('number')(price*mult, 3).replace(',', ''));
                            });
                        }
                    }
                });
                instance.pricing = {};
                filteredDataTemp = filteredDataTemp.concat(instance);
            }
        });

        $scope.filteredData = filteredDataTemp;

        $scope.sortChanged = false;
        $scope.orderByFunc($scope.sort.column);
        $scope.sortChanged = true;

    }

    $scope.filterDataNToggle = function() {

        $scope.filterData();
        $scope.toggleSidenav();
    }

    $scope.resetFiltersNToggle = function() {

        $scope.familyFilter = $scope.families[0];
        $scope.costFilter = $scope.costs[0].name;
        $scope.regionFilter = 'US';
        $scope.searchText = '';

        $scope.filterDataNToggle();
    }

    $scope.selectedCls = function(column) {

        return column == scope.sort.column && 'sort-' + scope.sort.descending;

    }

    $scope.changeSorting = function(column) {
        var sort = $scope.sort;
        if (sort.column === column) {
            sort.descending = !sort.descending;
        } else {
            sort.column = column;
            sort.descending = false;
        }

        angular.forEach($scope.head, function (name, column) {
            if (column === $scope.sort.column) {
                if (sort.descending === false) { $scope.sortOrder[column] = 'fa-angle-double-up activeColumn'; }
                else { $scope.sortOrder[column] = 'fa-angle-double-down activeColumn'; }
            } else {
                // if column is passive we don't care about sorting order
                // still an arrow is there (hidden) to prevent column from width changing
                $scope.sortOrder[column] = 'fa-angle-double-up passiveColumn';
            }
        });
    };

    $scope.orderByFunc = function(column) {

        if ($scope.sortChanged) {
            $scope.changeSorting(column);
        }

        $scope.filteredData = $filter('orderBy')($scope.filteredData, column, $scope.sort.descending);

    }

    $http.get('scraper/instances.json').success (function(data){

        $scope.allData = data;

        $scope.getAllRegionsNFamilies();

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

            if (column === 'vCPU' || column === 'memory' || column === 'GECU') {
                $scope.centerColomnHead[column] = "centered";
            }
        });

    });

}])
.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if(event.which === 13) {
                scope.$apply(function(){
                    scope.$eval(attrs.ngEnter, {'event': event});
                });

                event.preventDefault();
            }
        });
    };
});

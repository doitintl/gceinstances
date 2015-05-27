# gceinstances
Inspired by ec2instances.info, this is a summary page for Google Compute Engine instances

# Implementation
The grid can be presented by AngularJS using either ng-table.com, ui-grid.info or smartTable (http://lorenzofox3.github.io/smart-table-website/#top) components.

The client code will read (using $http) the scraper/instances.json file and present as it a grid to the end-user

# Requirements
We are going to mainly resemble ec2instances.info website. 
 - Filter by Region (as a dropdown above the grid)
 - Select Cost based on hourly, daily, weekly, monthly and anually (as dropdown above the grid)
 - Free text search filter (input field above the grid)

Grid columns should include the following fields from json file:
 - vcpu
 - memory
 - gecu
 - linux cost (according to selected region)
 - windows cost (according to selected region)
 - suse cost (according to selected region)
 - rhel cost (according to selected region)
 - preemptible cost (according to selected region)


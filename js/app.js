$(document).ready(function () {
    $.getJSON("scraper/instances.json", function (data) {
        $('#grid').dataTable({
            "data": data,
            "order": [[1, "asc"]],
            paging: false,
            "columnDefs": [
                {
                    "targets": [8],
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": [9],
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": [10],
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": [11],
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": [12],
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": [13],
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": [14],
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": [15],
                    "visible": false,
                    "searchable": false
                }],
            "columns": [
                {"data": "instance_type"},
                {"data": "vCPU"},
                {"data": "memory"},
                {"data": "GECU"},
                {"data": "pricing.us.linux"},
                {"data": "pricing.us.windows"},
                {"data": "pricing.us.rhel"},
                {"data": "pricing.us.suse"},
                {"data": "pricing.eu.linux"},
                {"data": "pricing.eu.windows"},
                {"data": "pricing.eu.rhel"},
                {"data": "pricing.eu.suse"},
                {"data": "pricing.apac.linux"},
                {"data": "pricing.apac.windows"},
                {"data": "pricing.apac.rhel"},
                {"data": "pricing.apac.suse"}
            ]
        });
    })

    $('#region-dropdown li a').click(function () {
        var region = $(this).data('region')
        $('#region-dropdown').find('a span').text(region);
        var grid = $('#grid').DataTable();

        switch (region) {
            case "eu-west":
            {
                // Hide US prices
                grid.column(4).visible(false);
                grid.column(5).visible(false);
                grid.column(6).visible(false);
                grid.column(7).visible(false);
                // Hide ASIA prices
                grid.column(12).visible(false);
                grid.column(13).visible(false);
                grid.column(14).visible(false);
                grid.column(15).visible(false);
                // Show EU prices
                grid.column(8).visible(true);
                grid.column(9).visible(true);
                grid.column(10).visible(true);
                grid.column(11).visible(true);
                break;
            }
            case "us-central":
            {
                // Show US prices
                grid.column(4).visible(true);
                grid.column(5).visible(true);
                grid.column(6).visible(true);
                grid.column(7).visible(true);
                // Hide EU prices
                grid.column(8).visible(false);
                grid.column(9).visible(false);
                grid.column(10).visible(false);
                grid.column(11).visible(false);
                // Hide ASIA prices
                grid.column(12).visible(false);
                grid.column(13).visible(false);
                grid.column(14).visible(false);
                grid.column(15).visible(false);
                break;
            }
            case "asia-east":
            {
                // Show ASIA prices
                grid.column(12).visible(true);
                grid.column(13).visible(true);
                grid.column(14).visible(true);
                grid.column(15).visible(true);
                // Hide EU prices
                grid.column(8).visible(false);
                grid.column(9).visible(false);
                grid.column(10).visible(false);
                grid.column(11).visible(false);
                // Hide US prices
                grid.column(4).visible(false);
                grid.column(5).visible(false);
                grid.column(6).visible(false);
                grid.column(7).visible(false);
                break;
            }
        }
        return true;
    });

});

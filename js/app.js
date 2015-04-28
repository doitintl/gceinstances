var current = "hourly";

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

    $('#cost-dropdown li a').click(function () {
        var grid = $('#grid').DataTable();
        var duration = $(this).data('duration');
        $('#cost-dropdown').find('a span').text(duration);

        switch (duration) {
            case "hourly":
            {
                break;
            }
            case "daily":
            {
                if (current!="daily") {
                    grid.rows().every(function () {
                        var data = this.data();
                        // Change US prices to Daily
                        data.pricing.us.linux = (data.pricing.us.linux * 24).toFixed(3);
                        data.pricing.us.windows = (data.pricing.us.windows * 24).toFixed(3);
                        data.pricing.us.rhel = (data.pricing.us.rhel * 24).toFixed(3);
                        data.pricing.us.suse = (data.pricing.us.suse * 24).toFixed(3);

                        // Change EU prices to Daily
                        data.pricing.eu.linux = (data.pricing.eu.linux * 24).toFixed(3);
                        data.pricing.eu.windows = (data.pricing.eu.windows * 24).toFixed(3);
                        data.pricing.eu.rhel = (data.pricing.eu.rhel * 24).toFixed(3);
                        data.pricing.eu.suse = (data.pricing.eu.suse * 24).toFixed(3);

                        // Change AP prices to Daily
                        data.pricing.apac.linux = (data.pricing.apac.linux * 24).toFixed(3);
                        data.pricing.apac.windows = (data.pricing.apac.windows * 24).toFixed(3);
                        data.pricing.apac.rhel = (data.pricing.apac.rhel * 24).toFixed(3);
                        data.pricing.apac.suse = (data.pricing.apac.suse * 24).toFixed(3);

                        this.invalidate();
                        current = "daily";
                    });
                    grid.draw();
                    break;
                }
            }
            case "weekly":
            {
                break;
            }
            case "monthly":
            {
                break;
            }
            case "annually":
            {
                break;
            }
        }
    });
});

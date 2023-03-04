$(document).ready(function()
{
    let chart_type_virtualServerStats = source.chart_type_virtualServerStats;
    let chart_data_virtualServerStats = source.chart_data_virtualServerStats;
    let selection_virtualServerStats = source.selection_virtualServerStats;
    let labels_virtualServerStats = source.labels_virtualServerStats;
    let stacked_virtualServerStats = source.stacked_virtualServerStats;

    new Morris[chart_type_virtualServerStats](
    {
        element: 'instance-chart',
        data: chart_data_virtualServerStats,
        xkey: tjs.get('Time'),
        ykeys: selection_virtualServerStats,
        labels: labels_virtualServerStats,
        fillOpacity: 0.6,
        hideHover: 'auto',
        behaveLikeLine: true,
        resize: true,
        stacked: stacked_virtualServerStats
    });
});
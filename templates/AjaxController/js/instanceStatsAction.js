$(document).ready(function()
{
    let chart_type_instanceStats = source.chart_type_instanceStats;
    let chart_data_instanceStats = source.chart_data_instanceStats;
    let selection_instanceStats = source.selection_instanceStats;
    let labels_instanceStats = source.labels_instanceStats;
    let stacked_instanceStats = source.stacked_instanceStats;

    new Morris[chart_type_instanceStats](
    {
        element: 'instance-chart',
        data: chart_data_instanceStats,
        xkey: tjs.get('Time'),
        ykeys: selection_instanceStats,
        labels: labels_instanceStats,
        fillOpacity: 0.6,
        hideHover: 'auto',
        behaveLikeLine: true,
        resize: true,
        stacked: stacked_instanceStats
    });
});
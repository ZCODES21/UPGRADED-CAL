function createChart(ctx, labels, data) {
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Conversion Results',
                data: data,
                backgroundColor: 'rgba(102, 126, 234, 0.5)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 1,
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Converted Value'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Units'
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false,
        }
    });
}

function updateChart(chart, labels, data) {
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update();
}
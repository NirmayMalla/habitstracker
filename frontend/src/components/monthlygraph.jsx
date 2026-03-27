import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, Filler} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(ArcElement,  Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, Filler);

function MonthlyGraph({currMonthDays, totalMonthHabits, habits}) {

    const numberOfDays = [];
    for (let i=0; i<currMonthDays; i++)
        numberOfDays.push(i + 1);

    const data = {
        labels: numberOfDays,

        datasets: [{
            fill: 'origin',
            backgroundColor: 'hsla(202, 100%, 50%, 0.30)',
            pointRadius: 0,
            borderColor: 'hsl(202, 100%, 50%)',
            cubicInterpolationMode: 'monotone',
            data: totalMonthHabits,
        }],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            x: {
                ticks: {
                    display: false,
                    font: {
                        size: 12,
                        family: 'Verdana, Geneva, Tahoma, sans-serif'
                    },
                },
                grid: {
                    display: false,
                },
                title: {
                    display: false,
                    text: 'Days',
                    font: {
                        size: 15,
                        family: 'Verdana, Geneva, Tahoma, sans-serif',
                    },
                },
            },
            y: {
                ticks: {
                    display: false,
                    font: {
                        size: 15,
                        family: 'Verdana, Geneva, Tahoma, sans-serif'
                    },
                },
                grid: {
                    display: false,
                },
                title: {
                    display: false,
                    text: 'Habits',
                    font: {
                        size: 15,
                        family: 'Verdana, Geneva, Tahoma, sans-serif',
                    },
                },
                min: 0,
                max: habits.length,
                beginAtZero: true
            }
        }
    };

    return <Line data={data} options={options}/>
}


export default MonthlyGraph
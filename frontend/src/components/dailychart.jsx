import { Chart as ChartJS, ArcElement, Tooltip, Legend, layouts } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function DailyChart({percentage, computeHSL, cutoutPercent, borderWidthAmt}) {

    const progressColour = computeHSL(percentage);

    const data = {
    
        labels : ["Completed", "Remaining"],

        datasets: [
            {
                data: [percentage, 100 - percentage],
                backgroundColor: [progressColour, 'rgb(199, 199, 199)'],
                borderWidth: borderWidthAmt,
            }
        ]
        
    };

    const options = {

        plugins: {
            legend: {
                display: false,
            }
        },
        cutout: cutoutPercent,
    };

    return <Doughnut data={data} options={options} />;
}

export default DailyChart
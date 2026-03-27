import { useEffect, useState } from 'react';
import { createRoutesFromElements, useLocation } from 'react-router-dom';
import HabitCard from '../components/habitcard';
import DailyChart from '../components/dailychart';
import MonthlyGraph from '../components/monthlygraph';
import "../styles/Dash.css";

function Dash() { 

    //day numbers to be used in table headers
	const dates = [];
    

    const location = useLocation();
    const username = location.state?.username;
    const userid = location.state?.userid;

    console.log('username:', username);
	console.log('userid:', userid);

    const [completedMap, setCompletedMap] = useState({});
    const [habits, setHabits] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(new Date().getDate());


    // are we adding a habit?, what is the value
    const [isAdding, setIsAdding] = useState(false);
    const [addingValue, setAddingValue] = useState("");


    //For rendering month and year
    const currMonth = currentDate.getMonth() + 1;
    const currYear = currentDate.getFullYear();
    const currMonthName = currentDate.toLocaleString('en-US', {month: 'long'});

    //No. of days -> into checkboxes (value is used later to render checkboxes)
    const currMonthDays = new Date(
		currentDate.getFullYear(),
		currentDate.getMonth() + 1,
        0
    ).getDate();
    
    for (let i=0; i<currMonthDays; i++) {
		dates.push(
			<th key={i} 
            className={`Dates ${selectedDay === i + 1 ? "selected-column" : ""}`}
            onClick={() => setSelectedDay(i + 1)}
            >   
              {i + 1}  
			</th>
		);
    }


    
    let percentage = 0;

    //  completedMap given as
    //  {'habitid-dayofcomplete' : 'true'}
    //  so extract habitids as numbers
    const completedArr = Object.keys(completedMap)
                        .filter(key => Number(key.split("-")[1]) === selectedDay)
                        .map(key => Number(key.split("-")[0]));
    

    function calculatePercentage(habits) {
        if (habits.length === 0)
            return percentage = 0;
        return (completedArr.length / habits.length) * 100;
    };
    percentage = calculatePercentage(habits);


    //dynamically changing the HSL and cutout of doughnut
    function computeHSL(percentage) {
        return (`hsl(${percentage}, 70%, 50%)`)
    };

    function cutoutWidth(percentage) {
        if (percentage === 100) {
            return '0%';
        }
        return '50%'
    };
    const cutoutPercent = cutoutWidth(percentage);

    function borderWidth(percentage) {
        if (percentage === 100) {
            return 4;
        }
        return 0
    };
    const borderWidthAmt = borderWidth(percentage);


    function computeHSLText(percentage) {
        if (percentage === 100)
            return 'hsl(93, 62%, 56%)'
        else return 'hsl(0, 0%, 37%)'
    };


    //get the list of how many habits per day for the whole month
    //to use in line graph
    let monthHabitsCount = [];
    function getMonthHabits(completedMap, currMonthDays, monthHabitsCount) {
        for (let i=0; i<currMonthDays; i++) {
            let countHabits = Object.keys(completedMap).filter(key => Number(key.split("-")[1]) === i + 1);
            monthHabitsCount[i] = countHabits.length;
        }
        return monthHabitsCount;
    };
    const totalMonthHabits = getMonthHabits(completedMap, currMonthDays, monthHabitsCount);

    //Fetch all habits
    useEffect(() => {
        async function fetchHabits() {
            const response = await fetch(
                `http://localhost:5000/habits/${username}`
            );
            const data = await response.json();

            setHabits(data);
        }
        if (username) {
            fetchHabits();
        }
    }, [username]);


    //Fetch completed habits
    useEffect(() => {
        async function fetchCompletedMap() {
            const response = await fetch(
                `http://localhost:5000/habits/completed/${userid}?year=${currYear}&month=${currMonth}`,
            );
            const data = await response.json();

            //map for date completed lookup instead of array
            const map = {}

            data.forEach(entry => { 
                const key = `${entry.habitid}-${entry.day}`;
                map[key] = true;
            })
            setCompletedMap(map);
        }
        if (userid)
            fetchCompletedMap();

    }, [currentDate]);



    const deleteHabit = async (id) => {
        console.log("deleting:", id);
        try {
            const response = await fetch(`http://localhost:5000/habits/${id}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (!response.ok) {
				console.log('Error:', data.message);
				return;
            }

            setHabits((prevHabits) =>
                prevHabits.filter((habit) => habit.habitid !== id)
            );

            console.log('Success:', data.message);
        }
        catch (err) { 
            console.error(err);
        }
    }



    const handleEditClick = (habit) => { 
        setEditingId(habit.habitid);
        setEditValue(habit.habit);
    }

    const handleEditCancel = () => { 
        setEditingId(null);
        setEditValue("");
    }

    const handleEditSave = async (id) => { 

        try {
            const response = await fetch(`http://localhost:5000/habits/${id}`, {
                method: 'PUT',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ habitName: editValue }),
            });
            
            
            const data = await response.json();
   
            if (!response.ok) {
                console.log('Error: ', data.message);
                return;
            }

   
            setHabits((prevHabits) =>
                prevHabits.map((habit) => {
                    if (habit.habitid === id) {
                        return { ...habit, habit: editValue }
                    }
                    else return habit;
                })
            );

            setEditingId(null);
            setEditValue("");

            console.log('Edited instance: ', data.message);
        }
        catch (err) { 
            console.log(err)
        }
    } 




    const handleAddClick = () => { 
        setIsAdding(true);
    }

    const handleAddSave = async () => { 
        try {
            const response = await fetch("http://localhost:5000/habits", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: username, newHabit: addingValue })
            });

            const data = await response.json();

            if (!response.ok) {
                console.log('Error: ', data.message);
                return;
            }

            setHabits(prev => [...prev, data.newHabit]);

            console.log('Success: ', data.message);

            setIsAdding(false);
            setAddingValue("");
            
        }
        catch (err) { 
            console.log("Error occured when trying to add habit: ", err);
        }
        
    }

    const handleAddCancel = () => { 
        setIsAdding(false);
        setAddingValue("");
    }


	
    
    const changeMonth = (offset) => {
        setCurrentDate(prev =>
            new Date(prev.getFullYear(), prev.getMonth() + offset, 1)
        );
    }

    //on checkbox checked
    const onChecked = async (isChecked, id, date) => {

        setSelectedDay(date);
        const year = currentDate.getFullYear();
		const month = currentDate.getMonth() + 1;
        const dateOfCompletion = `${year}-${month}-${date}`;

        //set key as habitid-date; example: 7-15
        const key = `${id}-${date}`;
        
        if (isChecked) {

            setCompletedMap(prev => ({
                ...prev,
                [key]: true
            }));

            try {
                const response = await fetch("http://localhost:5000/habits/completed", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ habitId: id, dateCompleted: dateOfCompletion }),
                });

                const data = await response.json();

                if (!response.ok) {
                    console.log("Error: ", data.message);
                    return;
                }
                
                console.log("Success", data);
            }
            
            catch (err) {
                console.log("Error: ", err);
            }
        }

        else {

            setCompletedMap(prev => {
                const newMap = { ...prev };
                delete newMap[key];
                return newMap;
            });

            try {
                const response = await fetch(`http://localhost:5000/habits/completed/${id}/${dateOfCompletion}`, {
                    method: 'DELETE',
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    console.log("Error: ", data.message);
                    return;
                }

                console.log("Success: ", data.message);
                
            }
            
            catch (err) {
                console.log("Error: ", err);
            }
        }
    }
	


    console.log(habits);
    return (
		<div className='Dashboard-page'>
			<div>
				<h1 className='Dash-title'>Dashboard</h1>
			</div>
			<div className='Dash-container'>
				<div className='Carousel-container'>
					<button
						className='Carousel-left-btn'
						onClick={() => changeMonth(-1)}
					>{'<'}</button>
					<h1 className='Month-year'>
						{currMonthName} {currYear}
					</h1>
					<button
                        className='Carousel-right-btn'
                        onClick={() => changeMonth(1)}
					>{'>'}</button>
				</div>
                <div className='Graphs-wrapper'>
                    <div className='Monthly-graph-wrapper'>
                        <MonthlyGraph
                            currMonthDays={currMonthDays}
                            totalMonthHabits={totalMonthHabits}
                            habits={habits}
                        />
                    </div>
                    <div className='Daily-chart-wrapper'>
                        <div className='Chart-center-text' style={{ color: computeHSLText(percentage) }}>
                            <p>{`${selectedDay} ${currMonthName}`}</p>
                            <p>{`${completedArr.length} / ${habits.length} complete`}</p>
                            {/* <p>{`${Math.round(percentage)} %`}</p> */}
                        </div>
                        <DailyChart
                            percentage={percentage}
                            computeHSL={computeHSL}
                            cutoutPercent={cutoutPercent}
                            borderWidthAmt={borderWidthAmt}
                        />
                    </div>
                </div>
                <div className='Habits-table-wrapper'>
                    <table className='Habits-table'>
					    <thead>
					    	<tr>
					    		<th>
					    			<button
					    				className='Add-btn'
					    				onClick={handleAddClick}
					    			>
					    				+
					    			</button>
					    		</th>
					    		{dates}
					    	</tr>
					    </thead>

					    <tbody>
                            {/* for each habit render a habit card */}
					    	{habits.map((habit) => (
					    		<HabitCard
					    			key={habit.habitid}
					    			habit={habit}
					    			completedMap={completedMap}
					    			onDelete={deleteHabit}
					    			isEditing={habit.habitid === editingId}
					    			editValue={editValue}
					    			setEditValue={setEditValue}
					    			onEdit={handleEditClick}
					    			onCancel={handleEditCancel}
					    			onSave={handleEditSave}
					    			onChecked={onChecked}
					    			daysInMonth={currMonthDays}
                                    selectedDay={selectedDay}
                                    setSelectedDay={setSelectedDay}
					    		/>
					    	))}
					    	{isAdding && (
					    		<HabitCard
					    			habit={{ habitid: 'new', habit: '' }}
					    			completedMap={completedMap}
					    			isEditing={true}
					    			editValue={addingValue}
					    			setEditValue={setAddingValue}
					    			onCancel={handleAddCancel}
					    			onSave={handleAddSave}
					    			daysInMonth={currMonthDays}
					    		/>
					    	)}
					    </tbody>
				    </table> 
                </div>
			</div>
		</div>
	);
}


export default Dash
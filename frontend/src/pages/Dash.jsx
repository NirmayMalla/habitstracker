import { useEffect, useState } from 'react';
import { createRoutesFromElements, useLocation } from 'react-router-dom';
import HabitCard from '../components/habitcard';
import "../styles/Dash.css";

function Dash() { 

    // for table headers
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

    //For the checkboxes
    const currMonthDays = new Date(
		currentDate.getFullYear(),
		currentDate.getMonth() + 1,
		0,
    ).getDate();
    
    //For rendering month and year
    const currMonth = currentDate.getMonth() + 1;
    const currYear = currentDate.getFullYear();

    const currMonthName = currentDate.toLocaleString('en-US', {month: 'long'});
    

    // are we adding?, what is the value
    const [isAdding, setIsAdding] = useState(false);
    const [addingValue, setAddingValue] = useState("");

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


	for (let i = 0; i < currMonthDays; i++) {
		dates.push(
			<th key={i} className='Dates'>
				{i + 1}
			</th>
		);
    }
    
    const changeMonth = (offset) => {
        setCurrentDate(prev =>
            new Date(prev.getFullYear(), prev.getMonth() + offset, 1)
        );
    }


    const onChecked = async (isChecked, id, date) => {

        const year = currentDate.getFullYear();
		const month = currentDate.getMonth() + 1;
        const dateOfCompletion = `${year}-${month}-${date}`;

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
					></button>
					<h1 className='Month-year'>
						{currMonthName} {currYear}
					</h1>
					<button
						className='Carousel-right-btn'
						onClick={() => changeMonth(1)}
					></button>
				</div>

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
	);
}


export default Dash
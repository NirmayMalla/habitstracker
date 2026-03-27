function HabitCard({ habit, onDelete, isEditing, editValue, setEditValue, onEdit, onCancel, onSave, onChecked, daysInMonth, completedMap, selectedDay, setSelectedDay }) { 
	
	const daysBoxes = [];
	
	for (let i = 0; i < daysInMonth; i++) {
		
		const day = i + 1;
		const key = `${habit.habitid}-${day}`;
		const isCompleted = completedMap[key] || false;

		//to check if that day is the selected day
		//if true then render differently, same as Dash
		const isSelected = selectedDay === day;

		daysBoxes.push(
			<td key={i} 
			className={`Checkbox-cell ${isSelected ? "selected-cell" : ""}`}
			onClick={() => {setSelectedDay(day)}}
			>
				<div
				className="Cell"
				// className={`Cell ${isCompleted ? "checked" : ""}`}
				//when rendered it renders boxes checking ifCompleted value
				//if false (box emtpy), when you click on the box, you wan to send true (opposite of empty box) !isCompleted
				onClick={(e) => {e.stopPropagation(); onChecked(!isCompleted, habit.habitid, day)}}
				>
    				<svg width="25" height="25" viewBox="0 0 25 25">
						{/* outer circle */}
    					<circle
    					  cx="12.5"
    					  cy="12.5"
    					  r="11.5"
    					  stroke="black"
    					  strokeWidth="1"
    					  fill="white"
    					/>	
    					{/* animated inner fill */}
    					<circle
    					  cx="12.5"
    					  cy="12.5"
    					  r={isCompleted ? 7 : 0}
    					  fill="rgb(131, 216, 4)"
    					  style={{
							transition: "r 0.2s cubic-bezier(.08,.82,.17,1)"
    					  }}
    					/>
    				</svg>						
				</div>
			</td>
		);
	}

	return (
		<tr className='Habit-card'>
			{/* first col is habit name + buttons */}
			<td className='Habit-col'>
				{isEditing ? (
					<div className='Habit-edit'>
						<input
							className='Edit-input'
							type='text'
							value={editValue}
							onChange={(e) => setEditValue(e.target.value)}
						/>
						<div className='Update-btns'>
							<button className='Save-btn'onClick={() => onSave(habit.habitid)}>Save</button>
							<button className='Cancel-btn' onClick={onCancel}>Cancel</button>
						</div>
					</div>
				) : (
					<div className='Habit-edit'>
						<p className='Habit-name'>{habit.habit}</p>
						<div className='Update-habit'>
							<button
								className='Delete-btn'
								onClick={() => onDelete(habit.habitid)}
							>
								Delete
							</button>
							<button
								className='Edit-btn'
								onClick={() => onEdit(habit)}
							>
								Edit
							</button>
						</div>
					</div>
				)}
			</td>

			{daysBoxes}
		</tr>
	);

}

export default HabitCard
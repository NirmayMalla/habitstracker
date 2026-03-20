function HabitCard({ habit, onDelete, isEditing, editValue, setEditValue, onEdit, onCancel, onSave, onChecked, daysInMonth, completedMap }) { 
	
	
	const daysBoxes = [];
	

	
	for (let i = 0; i < daysInMonth; i++) {
		
		const day = i + 1;
		const key = `${habit.habitid}-${day}`;
		const isCompleted = completedMap[key] || false;

		daysBoxes.push(
			<td key={i} className="Checkbox-cell">
				<input type="checkbox" checked={ isCompleted } onChange={(e) => onChecked(e.target.checked, habit.habitid, day)}/>
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
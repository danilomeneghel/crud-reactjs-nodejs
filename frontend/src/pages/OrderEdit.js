import 'date-fns';
import React, { useState, useEffect } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { TextField, MenuItem, IconButton } from "@material-ui/core";
import CancelIcon from '@material-ui/icons/Cancel';
import SaveIcon from '@material-ui/icons/Save';
import { Form } from "../styles/form";
import api from "../services/api";

const EditForm = props => {
	const [ item, setForm ] = useState(props.currentEdit)
	const [ msg, setMsg ] = useState({})
	const users = useState([{ "_id": "", "name": "Select User" }].concat(props.users))
	const products = useState([{ "_id": "", "name": "Select Product" }].concat(props.products))
	const [ userSelected, setUserSelected ] = useState(item.userSelected)
	const [ productSelected, setProductSelected ] = useState(item.productSelected)
	const [ deliveryDateSelected, handleDateChange ] = useState(item.deliveryDate)

	useEffect( () => { setForm(props.currentEdit) },
		[ props ]
	)

	const handleInputChange = event => {
		const { name, value } = event.target
		setForm({ ...item, [name]: value })
	}

	const saveItem = (_id, item) => {
		item.user = userSelected
		item.product = productSelected
		item.deliveryDate = deliveryDateSelected
		api.post('/order-update/'+_id, { item })
		.then(response => {
			if(response.data.success) {
				setMsg({ success: response.data.success, error: "" })
				var items = {
					_id: item._id,
					user: item.user,
					product: item.product,
					quantity: item.quantity,
					deliveryDate: item.deliveryDate,
					note: item.note
				}
				props.editForm(item._id, items)
			} else {
				setMsg({ error: "Registration error", success: "" })
			}
		})
		.catch(err => {
			setMsg({ error: "Registration error", success: "" })
		})
	}

	return (
		<Form
		  onSubmit={event => {
			event.preventDefault()
			saveItem(item._id, item)
		  }}
		>
			{msg.success && <p>{msg.success}</p>}
          	{msg.error && <p>{msg.error}</p>}
			
			<TextField
				select
				name="user"
				label="User"
				value={userSelected}
				onChange={e => setUserSelected(e.target.value)}
				variant="outlined"
				fullWidth
				required
			>
				{users[0].map((option) => (
					<MenuItem key={option._id} value={option._id}>
						{option.name}
					</MenuItem>
				))}
			</TextField><br /><br />
			
			<TextField
				select
				name="product"
				label="Product"
				value={productSelected}
				onChange={e => setProductSelected(e.target.value)}
				variant="outlined"
				fullWidth
				required
			>
				{products[0].map((option) => (
					<MenuItem key={option._id} value={option._id}>
						{option.name}
					</MenuItem>
				))}
			</TextField><br /><br />
			
			<TextField type="number" name="quantity" value={item.quantity} label="Quantity" variant="outlined" fullWidth onChange={handleInputChange} required /><br /><br />

			<MuiPickersUtilsProvider utils={DateFnsUtils}>
				<DateTimePicker
					name="deliveryDate"
					label="Delivery Date"
					inputVariant="outlined"
					value={deliveryDateSelected}
					format="yyyy-MM-dd HH:mm"
					fullWidth
					onChange={handleDateChange}
				/>
			</MuiPickersUtilsProvider><br /><br />
			
			<TextField name="note" value={item.note} label="Note" variant="outlined" fullWidth multiline rows={4} onChange={handleInputChange} /><br /><br />

			<IconButton onClick={props.handleClose}><CancelIcon /> Cancel</IconButton>
			<IconButton type="submit"><SaveIcon /> Save</IconButton>
		</Form>
	)
}

export default EditForm
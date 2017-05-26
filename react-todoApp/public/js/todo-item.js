var React = require("react");                //you can use import statements, like the one below
var ReactDom = require("react-dom");

import $ from 'jquery'



class TodoItem extends React.Component {
	
	constructor(props) {
	    super(props);
	    this.state = {                       //These are state variables
	        isEdit: false
	    };
	    
	    this.deleteItem = this.deleteItem.bind(this);
	    this.editTodo = this.editTodo.bind(this);
	    this.cancelEdit = this.cancelEdit.bind(this);
	    this.editContent = this.editContent.bind(this);
	}

	componentDidMount() {
		console.log(this.props.id);
		console.log(this.props.status)
	}

	deleteItem(id){                         // Triggers once the the delete button is clicked.  
		var that = this;
		console.log(that.props)

		$.ajax({        
			type: 'POST',
			url: '/delete',
			data: {
				_id: that.props.id          // Sending the id of the item to the server.
			},
			datatype:"json",
			success: function(data){                         
				console.log("successfully sent");  
				that.props.fetchTodosFromServer();  
			},
			error: function(httpRequest, status, error){
				console.log(error);
			}
		
		});

	}

	editTodo(){                                //Once the Edit button is clicked the state variable isEdit changes to true.
		console.log("editing!")
		this.setState({
			isEdit: true
		});
		

	}

	cancelEdit(){                               //Once the Cancel button is clicked the state variable isEdit changes to false.
		console.log("Editing cancelled");
		this.setState({
			isEdit:false
		});
	}

	editContent() {                             // Once the input field is edited the and when the save button is clicked content and the id willbe sent to the server.

		var that = this;
		var inputField = document.getElementById("input"+this.props.id);

		if(inputField.value){                  // The request will not be sent if the editing field is empty. 

			$.ajax({

			type: 'POST',
			url: '/edit',
			data: {
				_id: that.props.id,
				content: inputField.value
			},
			datatype:"json",
			success: function(data){   
				
				//that.props.fetchTodosFromServer();  //    /* To avoid fetching all the list items once again from the server instead of changing the specific item.  */ 
				that.setState({                        // render() follows setState().       
					isEdit: false    
				});
				
				document.getElementById("content"+that.props.id).innerHTML = inputField.value;  // Changes the only item which was edited.
			},
			error: function(httpRequest, status, error){
				console.log(error); 
			}
		});
	} else {                                         // Edit field cant't be empty. 

		alert('Please edit the content');         
	}                       
		

}


	render() {
		


		if(this.state.isEdit === false){          
			return (
				<div className="panel panel-default">
				  <div className="panel-heading">
				    <h3 className="panel-title">Status: {this.props.status}</h3>
				  </div>
				  <div className="panel-body">
				  	<p><strong>Name: </strong>{this.props.name}</p>
				    <p><strong>Content: </strong>
				    	<span id={"content"+ this.props.id}>{this.props.content}</span> 
				    	{/* "Content"+this.props.id -- is a temporary id given to the content of the list item which is not sent to the server. */} 
				    </p>
				    <p><strong>Date: </strong>{this.props.date}</p>  
				    <button type="button" className="btn btn-primary" onClick={this.editTodo}>Edit</button> 
				    <button type="button" className="btn btn-danger" onClick={this.deleteItem}>Delete</button>
				
				  </div>
				</div>
			);
		}else {

			return(

				<div>
				<p><strong>Name: </strong>{this.props.name}</p>
				<p><strong>Date: </strong>{this.props.date}</p>
			
				<input id={"input"+this.props.id} type="text" placeholder="Type your content here"/> <br/>{/* // value is always rendered with the same value (shop_profile_data.NAME) nothing is able to change.   */}
				<br/>{/* if there is no closing tag close with / */} 
				<button onClick={this.editContent}>Save</button> 
				<button onClick={this.cancelEdit}>Cancel</button>
			</div>
			);
				
		}
	}
} 

module.exports = {   
	TodoItem: TodoItem

}


//var React = require("react"); //you can use import statements, like the one below
//var ReactDom = require("react-dom"); 

import React from 'react'
import ReactDom from 'react-dom' 
import $ from 'jquery' 

import { TodoItem } from './todo-item.js' 

class TodoApp extends React.Component {       // Components(here TodoApp) are like JavaScript functions. They accept arbitrary inputs (called "props") and return React elements describing what should appear on the screen.

    constructor(props) {
        super(props);
        this.state = { //These are state variables
            todoList: []
        };

      //  this.changeName = this.changeName.bind(this); 
        this.addNewItem = this.addNewItem.bind(this);    //Add any new function if created
        this.fetchTodosFromServer = this.fetchTodosFromServer.bind(this);
    }


    // changeName() {                          
    //     console.log("this function runs");
    //     this.setState({
    //         name: "Akhila"
    //     });
    // }

    fetchTodosFromServer(){                      // Fetches the todoList from the server.  
        var that = this;
        $.ajax({
            type: 'GET',
            url: '/todos?name='+that.props.name, // 'name' which enterd on the url. If nothing is entered Name will be assigned as 'Unknown' 
            datatype: 'json',
            success: function (data, x, y) {
                that.setState({
                    todoList: data.todoList      
                });
            },
            error: function (httpRequest, status, error) {
                console.log(error);

            }
        });
    }

    componentDidMount() {                       // componentDidMount is executed after first render only on the client side.  
        
        console.log("this function called after render");
        this.fetchTodosFromServer();
    }


    // componentWillMount() {
    //     console.log("this function called before render")
    //     console.log(TodoItem)
    // }


    addNewItem() {                             // Adding a new content from the input field.                  
        console.log("new item added");
        var todoInput = document.getElementById("todo-input");
        var that = this;


        $.ajax({                               // Sending content and name to the server.
            type: 'POST',
            url: '/createtodo',
            data: {
                content: todoInput.value,
                name: that.props.name
            },
            datatype: 'json',
            success: function (data) {
                console.log(data);            
                that.fetchTodosFromServer()   // On success the added content is displayed.
            },
            error: function (httpRequest, status, error) {
                console.log(error);
            }
        })

        todoInput.value = "";                // The input field should be empty once the "add new item" button is clicked.

    }



    render() {                              // When called, it should examine this.props and this.state and return a single React element.
        var todoList = this.state.todoList; // Fethces from the fetchTodosFromServer() on success callback
       // console.log(todoList)
        var that = this;                    
        
        var todoElements = todoList.map(function(todoItem, index){
            //console.log(todoItem.content);
            
            var date = "" + new Date(todoItem.date);  
            return (
                <TodoItem id={todoItem["_id"]}     
                    key={index} content={todoItem.content} name={todoItem.name}
                    date={date} status={todoItem.status} fetchTodosFromServer={that.fetchTodosFromServer}/>
            )
        });

        var message; 

        if(this.props.name === ""){
            message= "Please enter your name in the url"
        }else{
            message = "Welcome, " + this.props.name
        }

        return (
          <div>
          	<h2 id="TodoApp">
          		{message}
          	</h2>

            <input id="todo-input" type="text" />

            <button onClick={this.addNewItem}>Add new item</button>

            <div id="todo-list">
              {todoElements} 
            </div>
          </div>
        );
 }

}

var username = document.body.getAttribute("data-name");      

ReactDom.render(<TodoApp name={username}/>, document.getElementById("container"));

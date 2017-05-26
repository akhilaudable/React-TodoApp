function initialize(app, db){                          // Main function
	
	app.get("/", function(req, res){                     
		var name = req.query.name;                         // Fetches the name field fromt the URL 
		console.log("request to localhost received");      

		if(name === undefined){                             
			res.render("index.html", {message: ""});
		}else{
			res.render("index.html", {
				message: name
			});
		}	
	});

	
  app.post("/createtodo", function(req, res){     

		//console.log(req.body);
		//console.log(req.body);
	
		var date = new Date();

    if(req.body.name !== "") {                 

        var todoItem = {
      name: req.body.name,
      status: "unfinished",
      content: req.body.content,
      date: date

    };

    db.collection("todoItems").insert(todoItem, function(err, results) {
            if(err) {
                console.log(err)
            }else {
              //  console.log(results);
                res.json({
                    message: "Inserted successfully"
                });
            }
        });

    } else {                               // If name is not defined by default the name field is assigned as "Unknown".
      console.log("name is not defined");    

      var todoItem = {
      name: "Unknown",
      status: "unfinished",
      content: req.body.content,
      date: date

    };

    db.collection("todoItems").insert(todoItem, function(err, results) {
            if(err) {
                console.log(err)
            }else {
              //  console.log(results);     
                res.json({                
                    message: "Inserted successfully"
                });
            }
        });
    }

		


	});


	app.get("/todos", function(req, res){
		console.log("request to /todos received");

      if(req.query.name) {                     

            console.log("this name is "+req.query.name);
      db.collection("todoItems").find({name:req.query.name}).toArray(function(err, results) {
            if(err) {
                console.log(err)
            }else {
                console.log(results);
                
                res.json({
                  todoList: results
                });
            }
        });

      } else {                        // If name is not defined only the names which are Unknown will be sent to the browser. 

         console.log("name is not defined"); 

        db.collection("todoItems").find({name:"Unknown"}).toArray(function(err, results) {
            if(err) {
                console.log(err)
            }else {
                console.log(results);
                
                res.json({
                  todoList: results
                });
            }
        });



      }

});

		app.post('/delete',function(req,res){                 
       //console.log(req.body);
       var ObjectId = require('mongodb').ObjectID;
       var collection = db.collection('todoItems');
       
       collection.remove({_id:new ObjectId(req.body._id)}, function(err,results){     // Deleted by Id.
          	 if (err) {
                console.log(err);
            } else {
              console.log("deleted");
              res.json({message: "deleted successfully"})
            }
           // db.close()
       });
   });

  


   app.post('/edit',function(req,res){
       //console.log(req.body);
       var ObjectId = require('mongodb').ObjectID;
       var collection = db.collection('todoItems');
       
      collection.update({_id: new ObjectId(req.body._id)}, {$set:{content:req.body.content}}, function(err,results){
      
          	 if (err) {
                console.log(err);
            } else {
              console.log("Updated");
              res.json({message: "Updated"})
            }
           // db.close()
       	});
    });
}

exports.initialize = initialize;

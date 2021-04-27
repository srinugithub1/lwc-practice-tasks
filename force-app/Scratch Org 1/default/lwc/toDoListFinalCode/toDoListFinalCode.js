import { LightningElement, track, wire } from 'lwc';
import getTask from '@salesforce/apex/ToDoListTask.getTask';
import { refreshApex } from '@salesforce/apex';
import insertTask from '@salesforce/apex/ToDoListTask.insertTask';
import deleteTask from '@salesforce/apex/ToDoListTask.deleteTask';

export default class TodoList extends LightningElement {

    @track
    todoTasks = [];

    newTask = '';
    toDoTaskResponse;
    processing = true;

    //Get the value from Lightning input value

    updateNewTask(event){
       // console.log(event.target.value);
        //console.log(this.newTask); 
        this.newTask = event.target.value;
    }

     //----- Display list values----
    
     @wire(getTask)
     getToDoTasks(response) {
         this.toDoTaskResponse = response;
         let data = response.data;
         let error = response.error;

         if(data || error){
            this.processing = false;
         }
 
         if(data){
             console.log('data');
             console.log(data);
             this.todoTasks = [];
            data.forEach(task => {
                this.todoTasks.push({
                    id : this.todoTasks.length +1,
                    Name : task.Subject,
                    recordId : task.Id
                })
            });
            console.log(this.todoTasks);
         }else if(error){
             console.log('error');
             console.log(error);
         }
     }

    //---- insert method ----
    //insert the value in task object and display on list

    addTaskToList(event){

        if(this.newTask == ''){
            return;
        }        

        this.processing = true;
        insertTask({ subject: this.newTask})
        .then(result => {
            this.processing = false;
            console.log(result);
             // * push function - used to add element at the end of the array
            // * unshift function - used to add element at the front of the array 
             this.todoTasks.push({
                id : this.todoTasks[this.todoTasks.length - 1] ? this.todoTasks[this.todoTasks.length - 1].id + 1 : 0,
                Name : this.newTask,
                recordId : result.Id
        });
            //console.log(this.todoTasks);
            this.newTask = '';
            console.log(JSON.stringify(this.todoTasks));
            })
        .catch(result => {
           console.log(result);
           this.processing = false;
        });  
      
    }

    //---------Delete Method -------
    //delete th value from list and database

    deleteTaskFromList(event){
        console.log('deleteing task id ' + event.target.name);
        //console.log(event.target.name);

        let idToDelete = event.target.name;
        let toDoTasks = this.todoTasks;
        let toDoTaskIndex;
        let recordIdToDelete;

        this.processing = true;

         for(let i=0; i<toDoTasks.length; i++){
            if(idToDelete === toDoTasks[i].id){
                toDoTaskIndex = i;  
                console.log('toDoTaskIndex--' + toDoTaskIndex);
            }
        }
        recordIdToDelete = toDoTasks[toDoTaskIndex].recordId;
        console.log(recordIdToDelete);

        deleteTask({ recordId : recordIdToDelete})
        .then( result =>
            {
            console.log(result)
            if(result){
                this.todoTasks.splice(toDoTaskIndex, 1);
            }else{
                console.log('unable to delete task');
            }
            console.log(JSON.stringify(this.todoTasks));
          })

        .catch(result => console.log(error))
        .finally( () => this.processing = false);
    }

   

    //------ Refresh button-----

    refreshToDoList(){
        
        this.processing = true;
        /*
            * it'll refresh the data in browser cache only
            * if there is change on the server side
        */
        refreshApex(this.toDoTaskResponse)
        .finally( () => this.processing = false);
    }
}
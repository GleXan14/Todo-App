import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {

  apiTodo: any[] = [];
  todoRemaining: number = 0;
  todosFiltered: any[] = [];
  isEditing: boolean = false;
  todoToEdit: any;
  isCharging: boolean = false;
  todoForm: FormGroup;

  constructor(private _services: SharedService, private _builder: FormBuilder) { 
    this.todoForm = this._builder.group({
      title: ['', Validators.required]
    });
  }

  ngOnInit(): void {

    this.getData();
    
  }

  //get data from jsonplaceholder (get request)
  getData():void{
    this._services.getTodoList().subscribe((res:any)=>{
      this.apiTodo = res;
      this.sortArray();
      this.todosFiltered = this.apiTodo;
      console.log(this.apiTodo);
      this.getItemsRemaining();
    })
  }

  //form submit (update/post request)
  onSubmit(e:any ,value:any){
    e.preventDefault();
    
    this.isCharging = true;

    //put request
    if(this.isEditing){
      let newArray: any[] = [];
      this.todoToEdit.title = value.title;
      let json = JSON.stringify(this.todoToEdit);

      this._services.updateTodo(json, this.todoToEdit.id).subscribe((res:any)=>{

        newArray.push(res);
        this.apiTodo.forEach((todo:any)=>{
          if(todo.id != res.id){
            newArray.push(todo);
          }
        });
        this.sortArray();
        this.filter('a');
        this.getItemsRemaining();
        this.isCharging = false;

      },(err:any)=>{
        console.error(err);
      });


    }else{ //post request

      let json = JSON.stringify({
        userId: '1',
        title: value.title,
        completed: false
  
      });

      
  
      this._services.postTodo(json).subscribe((res:any)=>{
        console.log(res);
        let newTodo: any = res;
        newTodo.id = this.getAnId();
        this.apiTodo.push(newTodo);
        this.sortArray();
        this.filter('a');
        this.getItemsRemaining();
      },(err:any)=>{
        console.error(err);
      });

    }

    this.isCharging = false;
    this.todoForm.setValue({
      title: ''
    })
    
  }

  //delete a todo (delete request)
  deleteTodo(id:any):void{

    let conf = confirm('Are you sure about delete this todo?');
    

    if(conf){
      this.isCharging = true;

      this._services.deleteTodo(id).subscribe((res:any)=>{
        let array: any[];
        array = this.apiTodo.filter((todo:any) => todo.id != id )
        this.apiTodo = array;
        this.sortArray();
        this.filter('a');
        this.getItemsRemaining();
        this.isCharging = false;

      },(err:any)=>{
        console.error(err);
      })
      
     
    }

    

  }

  //delete completed todo (no request to API)
  deleteCompleted():void{

    let conf = confirm('Are you sure about delete completed todo?');
    if(conf){
      let array: any[] = [];
      this.apiTodo.forEach((todo:any)=>{
        if(!todo.completed){
          array.push(todo);
        }
      })
  
      this.apiTodo = array;
      this.sortArray();
      this.filter('a');
      this.getItemsRemaining();

    }

  }

  //to sort the api data
  sortArray():void{
    this.apiTodo.sort((a:any, b:any)=>{
      return (b.id - a.id);
    });
  }

  //to get a Id to new todos
  getAnId():number{
    let lastTodo = this.apiTodo[0];
    return lastTodo.id + 1;
  }

  //literally the function name
  getItemsRemaining():void{
    let total: number = 0;

    this.todosFiltered.forEach((todo:any)=>{
      if(!todo.completed){
        total +=1;
      }
    })

    this.todoRemaining = total;
  }

  //some changes when a checkbox is checked or not
  onChkChange(id:any, check:boolean):void{

    this.apiTodo.forEach((todo:any)=>{
      if(todo.id == id){
        todo.completed = check;
      }
    })

    this.getItemsRemaining();
  }

  //filters for the todos
  filter(param:string):void{
    let array: any[] = [];
    if(param == 'c'){
      this.apiTodo.forEach((todo:any)=>{
        if(todo.completed == true){
          array.push(todo);
        }
      })
  
    }else if(param =='b'){

      this.apiTodo.forEach((todo:any)=>{
        if(todo.completed == false){
          array.push(todo);
        }
      })

    }else{
      array = this.apiTodo;

    }

    this.todosFiltered = array;
    
  }
  //edit button
  onEdit(id:any):void{
    this.isEditing = true;
    this.apiTodo.forEach((todo:any)=>{
      if(todo.id == id){
        this.todoForm.setValue({
          title: todo.title
        })

        this.todoToEdit = todo;
      }
    });
  }



  
}

import { ChangeDetectorRef, Component, Input, input} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { AsyncPipe, NgFor, NgForOf, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
  HttpClientModule,
AsyncPipe, NgForOf, NgIf, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'testapi';

  pizzaForm! : FormGroup;
 
  pizzas$?: Observable<any[]>;

  constructor(private formBuilder : FormBuilder, private http: HttpClient) {
  }
  
 
  ngOnInit(): void {
    this.pizzaForm = this.formBuilder.group({
      name : ["", Validators.required],
      isGlutenFree : [false, Validators.required]
    },
    {updateOn: 'change'});
    
    this.getPizzas();
  }

  getPizzas(): void {
    this.pizzas$ = this.http.get<any[]>('https://localhost:7230/pizza');
    this.pizzas$.forEach(element => {
      console.log(element);
      
    });
  }

  addPizza(): void {
    console.log(this.pizzaForm.value);
    type Pizza = {
      "name" : string,
      "isGlutenFree" : boolean
    }
    

    this.http.post<Pizza>('https://localhost:7230/pizza/add', this.pizzaForm.value).subscribe();
    this.pizzaForm.patchValue({name: '', isGlutenFree: false});
    this.getPizzas()
  }

  updatePizza(id: number): void {
    const pizza = {
      "id" : id,
      "name" : "MAJ via angular"
      
    }

    this.http.put(`https://localhost:7230/pizza/edit/${id}`, pizza).subscribe();
    this.getPizzas()


  }

  deletePizza(id: number) : void {this.http.delete(`https://localhost:7230/pizza/delete/${id}`).subscribe();
  this.getPizzas()

}
}

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css'
})
export class LabsComponent {
  welcome = 'Hola';
  tasks = signal([
    'Insertar el Angular CLI',
    'Crear Todo App',
    'Crear Proyecto',
    'Crear Componentes'
  ]);
  name = signal('Kevin');
  age = 888;
  disabled = true;
  img = 'https://i.imgur.com/QkIa5tT.jpeg';

  person = signal({
    name: 'kevin',
    age: 888,
    avatar: 'https://i.imgur.com/QkIa5tT.jpeg'
  });

  colorCtrl = new FormControl();
  widthCtrl = new FormControl(50, {
    nonNullable: true,
  });
  heightCtrl = new FormControl(50, {
    nonNullable: true,
  });

  constructor() {
    this.colorCtrl.valueChanges.subscribe(console.log);
  }

  clickHandler() {
    alert('hola');
  }

  changeHandler(event: Event) {
    const input = event.target as HTMLInputElement
    const newValue = input.value;
    this.name.set(newValue)
    // console.log(event);
  }

  keydownHandler(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    console.log(input.value);
  }

  changeAge(event: Event) {
    const input = event.target as HTMLInputElement
    const newValue = input.value;
    this.person.update(prevState => {
      return {
        ...prevState,
        age: parseInt(newValue, 10)
      }
    });
    // console.log(event);
  }

  changeName(event: Event) {
    const input = event.target as HTMLInputElement
    const newValue = input.value;
    this.person.update(prevState => {
      return {
        ...prevState,
        name: newValue
      }
    });
  }
}

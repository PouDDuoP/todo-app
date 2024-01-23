import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css'
})
export class LabsComponent {
  welcome = 'Hola';
  tasks = [
    'Insertar el Angular CLI',
    'Crear Todo App',
    'Crear Proyecto',
    'Crear Componentes'
  ];
  name = 'Kevin';
  age = 888;
  disabled = true;
  img = 'https://i.imgur.com/QkIa5tT.jpeg';

  person = {
    name: 'kevin',
    age: 888,
    avatar: 'https://i.imgur.com/QkIa5tT.jpeg'
  }
}

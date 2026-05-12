import { Component } from '@angular/core';
import { Navbar } from "../../shared/components/navbar/navbar";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sala-auditorias',
  imports: [Navbar, CommonModule],
  templateUrl: './sala-auditorias.html',
  styleUrl: './sala-auditorias.scss',
})
export class SalaAuditorias { }

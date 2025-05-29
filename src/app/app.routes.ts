import { Routes } from '@angular/router';
import { EtudiantComponent } from './components/etudiant/etudiant.component';
import { ReservationComponent } from './components/reservation/reservation.component';
import { BlocComponent } from './components/bloc/bloc.component';
import { ChambreComponent } from './components/chambre/chambre.component';
import { FoyerComponent } from './components/foyer/foyer.component';
import { UniversiteComponent } from './components/universite/universite.component';

export const routes: Routes = [
  { path: '', redirectTo: '/etudiants', pathMatch: 'full' },
  { path: 'etudiants', component: EtudiantComponent },
  { path: 'reservations', component: ReservationComponent },
  { path: 'blocs', component: BlocComponent },
  { path: 'chambres', component: ChambreComponent },
  { path: 'foyers', component: FoyerComponent },
  { path: 'universites', component: UniversiteComponent },
  { path: '**', redirectTo: '/etudiants' }
];

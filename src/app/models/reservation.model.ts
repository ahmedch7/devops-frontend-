import { Etudiant } from './etudiant.model';

export interface Reservation {
    idReservation: string;  // String ID for reservation
    anneeUniversitaire: string;
    estValide: boolean;
    etudiants: Etudiant[];
    idEtudiant?: number; // Optional field for form handling
}
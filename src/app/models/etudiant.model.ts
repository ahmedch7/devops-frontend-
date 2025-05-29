import { Reservation } from "./reservation.model";

export interface Etudiant {
    idEtudiant: number;
    nomEt: string;
    prenomEt: string;
    cin: number;
    ecole: string;
    dateNaissance: Date;
    reservations: Reservation[];
}
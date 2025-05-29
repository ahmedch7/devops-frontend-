import { Bloc } from './bloc.model';
import { Reservation } from './reservation.model';

export enum TypeChambre {
    SIMPLE = 'SIMPLE',
    DOUBLE = 'DOUBLE',
    TRIPLE = 'TRIPLE'
}

export interface Chambre {
    idChambre: number;
    numeroChambre: number;
    typeC: TypeChambre;
    bloc: Bloc;
    reservations: Reservation[];
} 
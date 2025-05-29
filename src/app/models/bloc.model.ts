import { Foyer } from './foyer.model';
import { Chambre } from './chambre.model';

export interface Bloc {
    idBloc: number;
    nomBloc: string;
    capaciteBloc: number;
    foyer: Foyer;
    chambres: Chambre[];
} 
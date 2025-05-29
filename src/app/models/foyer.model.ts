import { Bloc } from './bloc.model';
import { Universite } from './universite.model';

export interface Foyer {
    idFoyer: number;
    nomFoyer: string;
    capaciteFoyer: number;
    blocs: Bloc[];
    universite?: Universite;
} 
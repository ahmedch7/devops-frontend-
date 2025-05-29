import { Foyer } from './foyer.model';

export interface Universite {
    idUniversite: number;
    nomUniversite: string;
    adresse: string;
    foyer: Foyer;
} 
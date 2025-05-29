import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Etudiant } from '../../models/etudiant.model';
import { EtudiantService } from '../../services/etudiant.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-etudiant',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './etudiant.component.html',
  styleUrl: './etudiant.component.css'
})
export class EtudiantComponent implements OnInit {
  etudiants: Etudiant[] = [];
  etudiantForm: FormGroup;
  searchForm: FormGroup;
  isEditing = false;
  selectedEtudiantId: number | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private etudiantService: EtudiantService,
    private fb: FormBuilder
  ) {
    this.etudiantForm = this.fb.group({
      nomEt: ['', Validators.required],
      prenomEt: ['', Validators.required],
      cin: ['', [Validators.required, Validators.minLength(8)]],
      ecole: ['', Validators.required],
      dateNaissance: ['', Validators.required]
    });

    this.searchForm = this.fb.group({
      searchNom: ['']
    });
  }

  ngOnInit(): void {
    this.loadEtudiants();
  }

  loadEtudiants(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.etudiantService.getAll().subscribe({
      next: (data) => {
        this.etudiants = data;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.handleError(error);
        this.isLoading = false;
      }
    });
  }

  searchByNom(): void {
    const searchTerm = this.searchForm.get('searchNom')?.value;
    if (searchTerm) {
      this.isLoading = true;
      this.errorMessage = '';
      
      this.etudiantService.findByNom(searchTerm).subscribe({
        next: (data) => {
          this.etudiants = data;
          this.isLoading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = this.handleError(error);
          this.isLoading = false;
        }
      });
    } else {
      this.loadEtudiants();
    }
  }

  onSubmit(): void {
    if (this.etudiantForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const formValue = this.etudiantForm.value;
      const etudiant: Etudiant = {
        ...formValue,
        idEtudiant: this.selectedEtudiantId || undefined
      };
      
      const request = this.isEditing && this.selectedEtudiantId
        ? this.etudiantService.update(this.selectedEtudiantId, etudiant)
        : this.etudiantService.create(etudiant);

      request.subscribe({
        next: () => {
          this.loadEtudiants();
          this.resetForm();
          this.isLoading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = this.handleError(error);
          this.isLoading = false;
        }
      });
    }
  }

  editEtudiant(etudiant: Etudiant): void {
    this.isEditing = true;
    this.selectedEtudiantId = etudiant.idEtudiant;
    this.etudiantForm.patchValue({
      nomEt: etudiant.nomEt,
      prenomEt: etudiant.prenomEt,
      cin: etudiant.cin,
      ecole: etudiant.ecole,
      dateNaissance: new Date(etudiant.dateNaissance).toISOString().split('T')[0]
    });
  }

  deleteEtudiant(id: number): void {
    if (confirm('Are you sure you want to delete this student?')) {
      this.isLoading = true;
      this.errorMessage = '';
      
      this.etudiantService.delete(id).subscribe({
        next: () => {
          this.loadEtudiants();
          this.isLoading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = this.handleError(error);
          this.isLoading = false;
        }
      });
    }
  }

  resetForm(): void {
    this.isEditing = false;
    this.selectedEtudiantId = null;
    this.etudiantForm.reset();
    this.errorMessage = '';
  }

  resetSearch(): void {
    this.searchForm.reset();
    this.loadEtudiants();
  }

  private handleError(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      return `Error: ${error.error.message}`;
    } else {
      // Server-side error
      return `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
  }
}

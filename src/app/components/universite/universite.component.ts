import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Universite } from '../../models/universite.model';
import { UniversiteService } from '../../services/universite.service';
import { Foyer } from '../../models/foyer.model';
import { FoyerService } from '../../services/foyer.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-universite',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './universite.component.html',
  styleUrl: './universite.component.css'
})
export class UniversiteComponent implements OnInit {
  universites: Universite[] = [];
  foyers: Foyer[] = [];
  universiteForm: FormGroup;
  isEditing = false;
  selectedUniversiteId: number | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private universiteService: UniversiteService,
    private foyerService: FoyerService,
    private fb: FormBuilder
  ) {
    this.universiteForm = this.fb.group({
      nomUniversite: ['', Validators.required],
      adresse: ['', Validators.required],
      foyer: [null]
    });
  }

  ngOnInit(): void {
    this.loadUniversites();
    this.loadFoyers();
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

  loadUniversites(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.universiteService.getAll().subscribe({
      next: (data) => {
        this.universites = data;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.handleError(error);
        this.isLoading = false;
      }
    });
  }

  loadFoyers(): void {
    this.foyerService.getAll().subscribe({
      next: (data) => {
        this.foyers = data;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.handleError(error);
      }
    });
  }

  onSubmit(): void {
    if (this.universiteForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      const universite: Universite = this.universiteForm.value;
      
      const request = this.isEditing && this.selectedUniversiteId
        ? this.universiteService.update(this.selectedUniversiteId, universite)
        : this.universiteService.create(universite);

      request.subscribe({
        next: () => {
          this.loadUniversites();
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

  assignFoyer(universite: Universite, foyerId: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    const foyerIdNum = parseInt(foyerId, 10);
    if (isNaN(foyerIdNum)) {
      this.errorMessage = 'Invalid foyer ID';
      this.isLoading = false;
      return;
    }

    const foyer = this.foyers.find(f => f.idFoyer === foyerIdNum);
    if (!foyer) {
      this.errorMessage = 'Selected foyer not found';
      this.isLoading = false;
      return;
    }

    const updatedUniversite: Universite = {
      ...universite,
      foyer: foyer
    };

    this.universiteService.update(universite.idUniversite, updatedUniversite).subscribe({
      next: () => {
        this.loadUniversites();
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.handleError(error);
        this.isLoading = false;
      }
    });
  }

  editUniversite(universite: Universite): void {
    this.isEditing = true;
    this.selectedUniversiteId = universite.idUniversite;
    this.universiteForm.patchValue({
      nomUniversite: universite.nomUniversite,
      adresse: universite.adresse,
      foyer: universite.foyer?.idFoyer || null
    });
  }

  deleteUniversite(id: number): void {
    if (confirm('Are you sure you want to delete this university?')) {
      this.isLoading = true;
      this.errorMessage = '';
      
      this.universiteService.delete(id).subscribe({
        next: () => {
          this.loadUniversites();
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
    this.selectedUniversiteId = null;
    this.universiteForm.reset();
    this.errorMessage = '';
  }
}

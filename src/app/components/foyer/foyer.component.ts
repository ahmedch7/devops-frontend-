import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Foyer } from '../../models/foyer.model';
import { FoyerService } from '../../services/foyer.service';
import { Universite } from '../../models/universite.model';

@Component({
  selector: 'app-foyer',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './foyer.component.html',
  styleUrl: './foyer.component.css'
})
export class FoyerComponent implements OnInit {
  foyers: Foyer[] = [];
  foyerForm: FormGroup;
  isEditing = false;
  selectedFoyerId: number | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private foyerService: FoyerService,
    private fb: FormBuilder
  ) {
    this.foyerForm = this.fb.group({
      nomFoyer: ['', Validators.required],
      capaciteFoyer: ['', [Validators.required, Validators.min(1)]],
      idUniversite: ['']
    });
  }

  ngOnInit(): void {
    this.loadFoyers();
  }

  loadFoyers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.foyerService.getAll().subscribe({
      next: (data) => {
        this.foyers = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error loading foyers: ' + error;
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.foyerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      const foyer: Foyer = this.foyerForm.value;
      
      const request = this.isEditing && this.selectedFoyerId
        ? this.foyerService.update(this.selectedFoyerId, foyer)
        : this.foyerService.create(foyer);

      request.subscribe({
        next: () => {
          this.loadFoyers();
          this.resetForm();
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = `Error ${this.isEditing ? 'updating' : 'creating'} foyer: ` + error;
          this.isLoading = false;
        }
      });
    }
  }

  editFoyer(foyer: Foyer): void {
    this.isEditing = true;
    this.selectedFoyerId = foyer.idFoyer;
    this.foyerForm.patchValue({
      ...foyer,
      idUniversite: foyer.universite?.idUniversite
    });
  }

  deleteFoyer(id: number): void {
    if (confirm('Are you sure you want to delete this foyer?')) {
      this.isLoading = true;
      this.errorMessage = '';
      
      this.foyerService.delete(id).subscribe({
        next: () => {
          this.loadFoyers();
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Error deleting foyer: ' + error;
          this.isLoading = false;
        }
      });
    }
  }

  affecterFoyerAUniversite(idFoyer: number, idUniversite: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.foyerService.affecterFoyerAUniversiteByIds(idFoyer, idUniversite).subscribe({
      next: () => {
        this.loadFoyers();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error assigning foyer to university: ' + error;
        this.isLoading = false;
      }
    });
  }

  desaffecterFoyerAUniversite(idUniversite: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.foyerService.desaffecterFoyerAUniversite(idUniversite).subscribe({
      next: () => {
        this.loadFoyers();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error unassigning foyer from university: ' + error;
        this.isLoading = false;
      }
    });
  }

  resetForm(): void {
    this.isEditing = false;
    this.selectedFoyerId = null;
    this.foyerForm.reset();
    this.errorMessage = '';
  }
}

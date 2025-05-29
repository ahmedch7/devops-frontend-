import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Chambre, TypeChambre } from '../../models/chambre.model';
import { ChambreService } from '../../services/chambre.service';

@Component({
  selector: 'app-chambre',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './chambre.component.html',
  styleUrl: './chambre.component.css'
})
export class ChambreComponent implements OnInit {
  chambres: Chambre[] = [];
  chambreForm: FormGroup;
  isEditing = false;
  selectedChambreId: number | null = null;
  isLoading = false;
  errorMessage = '';
  TypeChambre = TypeChambre; // Make enum available in template

  constructor(
    private chambreService: ChambreService,
    private fb: FormBuilder
  ) {
    this.chambreForm = this.fb.group({
      numeroChambre: ['', [Validators.required, Validators.min(1)]],
      typeC: ['', Validators.required],
      idBloc: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadChambres();
  }

  loadChambres(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.chambreService.getAll().subscribe({
      next: (data) => {
        this.chambres = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error loading chambres: ' + error;
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.chambreForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      const chambre: Chambre = this.chambreForm.value;
      
      const request = this.isEditing && this.selectedChambreId
        ? this.chambreService.update(this.selectedChambreId, chambre)
        : this.chambreService.create(chambre);

      request.subscribe({
        next: () => {
          this.loadChambres();
          this.resetForm();
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = `Error ${this.isEditing ? 'updating' : 'creating'} chambre: ` + error;
          this.isLoading = false;
        }
      });
    }
  }

  editChambre(chambre: Chambre): void {
    this.isEditing = true;
    this.selectedChambreId = chambre.idChambre;
    this.chambreForm.patchValue({
      ...chambre,
      idBloc: chambre.bloc?.idBloc
    });
  }

  deleteChambre(id: number): void {
    if (confirm('Are you sure you want to delete this chambre?')) {
      this.isLoading = true;
      this.errorMessage = '';
      
      this.chambreService.delete(id).subscribe({
        next: () => {
          this.loadChambres();
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Error deleting chambre: ' + error;
          this.isLoading = false;
        }
      });
    }
  }

  resetForm(): void {
    this.isEditing = false;
    this.selectedChambreId = null;
    this.chambreForm.reset();
    this.errorMessage = '';
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Bloc } from '../../models/bloc.model';
import { BlocService } from '../../services/bloc.service';

@Component({
  selector: 'app-bloc',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './bloc.component.html',
  styleUrl: './bloc.component.css'
})
export class BlocComponent implements OnInit {
  blocs: Bloc[] = [];
  blocForm: FormGroup;
  isEditing = false;
  selectedBlocId: number | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private blocService: BlocService,
    private fb: FormBuilder
  ) {
    this.blocForm = this.fb.group({
      nomBloc: ['', Validators.required],
      capaciteBloc: ['', [Validators.required, Validators.min(0)]],
      idFoyer: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadBlocs();
  }

  loadBlocs(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.blocService.getAll().subscribe({
      next: (data) => {
        this.blocs = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error loading blocs: ' + error;
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.blocForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      const bloc: Bloc = this.blocForm.value;
      
      const request = this.isEditing && this.selectedBlocId
        ? this.blocService.update(this.selectedBlocId, bloc)
        : this.blocService.create(bloc);

      request.subscribe({
        next: () => {
          this.loadBlocs();
          this.resetForm();
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = `Error ${this.isEditing ? 'updating' : 'creating'} bloc: ` + error;
          this.isLoading = false;
        }
      });
    }
  }

  editBloc(bloc: Bloc): void {
    this.isEditing = true;
    this.selectedBlocId = bloc.idBloc;
    this.blocForm.patchValue({
      ...bloc,
      idFoyer: bloc.foyer?.idFoyer
    });
  }

  deleteBloc(id: number): void {
    if (confirm('Are you sure you want to delete this bloc?')) {
      this.isLoading = true;
      this.errorMessage = '';
      
      this.blocService.delete(id).subscribe({
        next: () => {
          this.loadBlocs();
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Error deleting bloc: ' + error;
          this.isLoading = false;
        }
      });
    }
  }

  resetForm(): void {
    this.isEditing = false;
    this.selectedBlocId = null;
    this.blocForm.reset();
    this.errorMessage = '';
  }
}

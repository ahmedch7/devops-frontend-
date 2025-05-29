import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Reservation } from '../../models/reservation.model';
import { ReservationService } from '../../services/reservation.service';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css'
})
export class ReservationComponent implements OnInit {
  reservations: Reservation[] = [];
  reservationForm: FormGroup;
  isEditing = false;
  selectedReservationId: string | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private reservationService: ReservationService,
    private fb: FormBuilder
  ) {
    this.reservationForm = this.fb.group({
      idReservation: ['', Validators.required],
      anneeUniversitaire: ['', Validators.required],
      estValide: [true],
      idEtudiant: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.reservationService.getAll().subscribe({
      next: (data) => {
        this.reservations = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error loading reservations: ' + error;
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.reservationForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      const reservation: Reservation = this.reservationForm.value;
      
      const request = this.isEditing && this.selectedReservationId
        ? this.reservationService.update(this.selectedReservationId, reservation)
        : this.reservationService.create(reservation);

      request.subscribe({
        next: () => {
          this.loadReservations();
          this.resetForm();
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = `Error ${this.isEditing ? 'updating' : 'creating'} reservation: ` + error;
          this.isLoading = false;
        }
      });
    }
  }

  editReservation(reservation: Reservation): void {
    this.isEditing = true;
    this.selectedReservationId = reservation.idReservation;
    this.reservationForm.patchValue(reservation);
  }

  deleteReservation(id: string): void {
    if (confirm('Are you sure you want to delete this reservation?')) {
      this.isLoading = true;
      this.errorMessage = '';
      
      this.reservationService.delete(id).subscribe({
        next: () => {
          this.loadReservations();
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Error deleting reservation: ' + error;
          this.isLoading = false;
        }
      });
    }
  }

  resetForm(): void {
    this.isEditing = false;
    this.selectedReservationId = null;
    this.reservationForm.reset();
    this.errorMessage = '';
  }
}

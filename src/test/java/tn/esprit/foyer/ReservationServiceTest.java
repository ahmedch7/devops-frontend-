package tn.esprit.foyer;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import tn.esprit.foyer.DAO.Entities.Reservation;
import tn.esprit.foyer.DAO.Repositories.ChambreRepository;
import tn.esprit.foyer.DAO.Repositories.EtudiantRepository;
import tn.esprit.foyer.DAO.Repositories.ReservationRepository;
import tn.esprit.foyer.Services.Reservation.ReservationService;
@ExtendWith(MockitoExtension.class)
 class ReservationServiceTest {

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private ChambreRepository chambreRepository;

    @Mock
    private EtudiantRepository etudiantRepository;

    @InjectMocks
    private ReservationService reservationService;

    @Test
    void testAddOrUpdate() {
        // Arrange
        Reservation r = new Reservation();
        r.setIdReservation("2024/2025-BLOC1-01-12345678");

        Mockito.when(reservationRepository.save(r)).thenReturn(r);

        // Act
        Reservation result = reservationService.addOrUpdate(r);

        // Assert
        Assertions.assertEquals("2024/2025-BLOC1-01-12345678", result.getIdReservation());
        Mockito.verify(reservationRepository).save(r);
    }
}


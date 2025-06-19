package tn.esprit.foyer;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import tn.esprit.foyer.DAO.Entities.Reservation;
import tn.esprit.foyer.Services.Reservation.ReservationService;

import java.time.LocalDate;

@SpringBootTest
class ReservationServiceIntegrationTest {

    @Autowired
    ReservationService reservationService;

    @Test
    void testAddReservation() {
        // Arrange : Créer une réservation
        Reservation reservation = Reservation.builder()
                .idReservation("TEST-RES-001")
                .estValide(true)
                .anneeUniversitaire(LocalDate.now())
                .build();

        // Act : sauvegarder la réservation
        Reservation savedReservation = reservationService.addOrUpdate(reservation);

        // Assert : vérifier que la réservation a bien été sauvegardée
        Assertions.assertNotNull(savedReservation);
        //Assertions.assertEquals("TEST-RES-001", savedReservation.getIdReservation());
        Assertions.assertTrue(savedReservation.isEstValide());
    }
}

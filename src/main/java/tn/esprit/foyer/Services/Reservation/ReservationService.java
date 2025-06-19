package tn.esprit.foyer.Services.Reservation;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import tn.esprit.foyer.DAO.Entities.Chambre;
import tn.esprit.foyer.DAO.Entities.Etudiant;
import tn.esprit.foyer.DAO.Entities.Reservation;
import tn.esprit.foyer.DAO.Repositories.ChambreRepository;
import tn.esprit.foyer.DAO.Repositories.EtudiantRepository;
import tn.esprit.foyer.DAO.Repositories.ReservationRepository;

import java.time.LocalDate;
import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class ReservationService implements IReservationService {
    ReservationRepository repo;
    ChambreRepository chambreRepository;
    EtudiantRepository etudiantRepository;

    private static final String NOT_FOUND_SUFFIX = " introuvable";
    private static final String NOT_FOUND_SUFFIX2 = " Réservation";

    private RuntimeException notFound(String entity, Object id) {
        return new RuntimeException(entity + " " + id + NOT_FOUND_SUFFIX);
    }

    @Override
    public Reservation addOrUpdate(Reservation r) {
        return repo.save(r);
    }

    @Override
    public List<Reservation> findAll() {
        return repo.findAll();
    }

    @Override
    public Reservation findById(String id) {
        return repo.findById(id).orElseThrow(() -> notFound(NOT_FOUND_SUFFIX2, id));
    }

    @Override
    public void deleteById(String id) {
        repo.deleteById(id);
    }

    @Override
    public void delete(Reservation r) {
        repo.delete(r);
    }

    public LocalDate getDateDebutAU() {
        int year = LocalDate.now().getYear() % 100;
        return (LocalDate.now().getMonthValue() <= 7)
                ? LocalDate.of(Integer.parseInt("20" + (year - 1)), 9, 15)
                : LocalDate.of(Integer.parseInt("20" + year), 9, 15);
    }

    public LocalDate getDateFinAU() {
        int year = LocalDate.now().getYear() % 100;
        return (LocalDate.now().getMonthValue() <= 7)
                ? LocalDate.of(Integer.parseInt("20" + year), 6, 30)
                : LocalDate.of(Integer.parseInt("20" + (year + 1)), 6, 30);
    }

    @Override
    public Reservation ajouterReservationEtAssignerAChambreEtAEtudiant(Long numChambre, long cin) {
        Chambre chambre = chambreRepository.findByNumeroChambre(numChambre);
        Etudiant etudiant = etudiantRepository.findByCin(cin);

        int nombreReservations = chambreRepository
                .countReservationsByIdChambreAndReservationsAnneeUniversitaireBetween(
                        chambre.getIdChambre(), getDateDebutAU(), getDateFinAU());

        int capaciteMaximale = switch (chambre.getTypeC()) {
            case SIMPLE -> 1;
            case DOUBLE -> 2;
            case TRIPLE -> 3;
        };

        if (nombreReservations >= capaciteMaximale) {
            log.info("Chambre " + chambre.getTypeC() + " remplie !");
            return null;
        }

        String idReservation = getDateDebutAU().getYear() + "/" + getDateFinAU().getYear() + "-"
                + chambre.getBloc().getNomBloc() + "-" + chambre.getNumeroChambre() + "-" + etudiant.getCin();

        Reservation reservation = Reservation.builder()
                .estValide(true)
                .anneeUniversitaire(LocalDate.now())
                .idReservation(idReservation)
                .build();

        reservation.getEtudiants().add(etudiant);
        reservation = repo.save(reservation);
        chambre.getReservations().add(reservation);
        chambreRepository.save(chambre);

        return reservation;
    }

    @Override
    public long getReservationParAnneeUniversitaire(LocalDate debutAnnee, LocalDate finAnnee) {
        return repo.countByAnneeUniversitaireBetween(debutAnnee, finAnnee);
    }

    @Override
    public String annulerReservation(long cinEtudiant) {
        Reservation r = repo.findByEtudiantsCinAndEstValide(cinEtudiant, true);
        if (r == null) throw notFound("Réservation pour étudiant", cinEtudiant);
        Chambre c = chambreRepository.findByReservationsIdReservation(r.getIdReservation());
        if (c == null) throw notFound("Chambre associée à la réservation", r.getIdReservation());

        c.getReservations().remove(r);
        chambreRepository.save(c);
        repo.delete(r);

        return "La réservation " + r.getIdReservation() + " est annulée avec succès";
    }

    @Override
    public void affectReservationAChambre(String idRes, long idChambre) {
        Reservation r = repo.findById(idRes).orElseThrow(() -> notFound(NOT_FOUND_SUFFIX2, idRes));
        Chambre c = chambreRepository.findById(idChambre).orElseThrow(() -> notFound("Chambre", idChambre));

        c.getReservations().add(r);
        chambreRepository.save(c);
    }

    @Override
    public void deaffectReservationAChambre(String idRes, long idChambre) {
        Reservation r = repo.findById(idRes).orElseThrow(() -> notFound(NOT_FOUND_SUFFIX2, idRes));
        Chambre c = chambreRepository.findById(idChambre).orElseThrow(() -> notFound("Chambre", idChambre));

        c.getReservations().remove(r);
        chambreRepository.save(c);
    }

    @Override
    public void annulerReservations() {
        LocalDate dateDebutAU = getDateDebutAU();
        LocalDate dateFinAU = getDateFinAU();

        for (Reservation reservation : repo.findByEstValideAndAnneeUniversitaireBetween(true, dateDebutAU, dateFinAU)) {
            reservation.setEstValide(false);
            repo.save(reservation);
            log.info("La réservation " + reservation.getIdReservation() + " est annulée automatiquement");
        }
    }
}

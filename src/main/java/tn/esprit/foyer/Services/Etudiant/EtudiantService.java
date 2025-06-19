package tn.esprit.foyer.Services.Etudiant;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.foyer.DAO.Entities.Etudiant;
import tn.esprit.foyer.DAO.Entities.Reservation;
import tn.esprit.foyer.DAO.Repositories.EtudiantRepository;
import tn.esprit.foyer.DAO.Repositories.ReservationRepository;

import java.util.List;

@Service
@AllArgsConstructor
public class EtudiantService implements IEtudiantService {
    EtudiantRepository repo;
    ReservationRepository reservationRepository;

    private static final String NOT_FOUND_SUFFIX = " introuvable";

    private RuntimeException notFound(String entity, Object id) {
        return new RuntimeException(entity + " " + id + NOT_FOUND_SUFFIX);
    }

    @Override
    public Etudiant addOrUpdate(Etudiant e) {
        return repo.save(e);
    }

    @Override
    public List<Etudiant> findAll() {
        return repo.findAll();
    }

    @Override
    public Etudiant findById(long id) {
        return repo.findById(id).orElseThrow(() -> notFound("Etudiant", id));
    }

    @Override
    public void deleteById(long id) {
        repo.deleteById(id);
    }

    @Override
    public void delete(Etudiant e) {
        repo.delete(e);
    }

    @Override
    public List<Etudiant> selectJPQL(String nom) {
        return repo.selectJPQL(nom);
    }

    @Override
    public void affecterReservationAEtudiant(String idR, String nomE, String prenomE) {
        Reservation res = reservationRepository.findById(idR)
                .orElseThrow(() -> notFound("Réservation", idR));
        Etudiant et = repo.getByNomEtAndPrenomEt(nomE, prenomE);
        et.getReservations().add(res);
        repo.save(et);
    }

    @Override
    public void desaffecterReservationAEtudiant(String idR, String nomE, String prenomE) {
        Reservation res = reservationRepository.findById(idR)
                .orElseThrow(() -> notFound("Réservation", idR));
        Etudiant et = repo.getByNomEtAndPrenomEt(nomE, prenomE);
        et.getReservations().remove(res);
        repo.save(et);
    }
}

package tn.esprit.foyer;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import tn.esprit.foyer.DAO.Entities.Etudiant;
import tn.esprit.foyer.Services.Etudiant.EtudiantService;

@SpringBootTest
class FoyerApplicationTests {

    @Autowired
    EtudiantService etudiantService;

    @Test
    public void testAddEtudiant() {
        // Création d’un étudiant
        Etudiant etudiant = Etudiant.builder()
                .nomEt("Cheikhrouhou")
                .prenomEt("Ahmed")
                .cin(12345678)
                .ecole("ESPRIT")
                .build();

        // Ajout de l'étudiant via le service
        Etudiant savedEtudiant = etudiantService.addOrUpdate(etudiant);

        // Vérifier que l'étudiant a bien un ID (donc a été persisté)
        Assertions.assertNotNull(savedEtudiant.getIdEtudiant());

        // (optionnel) Supprimer ensuite si tu veux garder la base propre
        // etudiantService.deleteById(savedEtudiant.getIdEtudiant());
    }
}

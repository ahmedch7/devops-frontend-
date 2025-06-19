package tn.esprit.foyer;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import tn.esprit.foyer.DAO.Entities.Etudiant;
import tn.esprit.foyer.DAO.Repositories.EtudiantRepository;
import tn.esprit.foyer.Services.Etudiant.EtudiantService;

@ExtendWith(MockitoExtension.class)
class EtudiantServiceTest {

    @Mock
    private EtudiantRepository etudiantRepository;

    @InjectMocks
    private EtudiantService etudiantService;

    @Test
    void testAddOrUpdate() {
        // Arrange
        Etudiant e = new Etudiant();
        e.setNomEt("Ahmed");
        e.setPrenomEt("Slimi");

        Mockito.when(etudiantRepository.save(e)).thenReturn(e);

        // Act
        Etudiant result = etudiantService.addOrUpdate(e);

        // Assert
        Assertions.assertEquals("Ahmed", result.getNomEt());
        Assertions.assertEquals("Slimi", result.getPrenomEt());
        Mockito.verify(etudiantRepository).save(e);
    }
}


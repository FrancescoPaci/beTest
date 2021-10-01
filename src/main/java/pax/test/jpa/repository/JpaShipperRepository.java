package pax.test.jpa.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pax.test.jpa.model.JpaShipper;

@Repository
public interface JpaShipperRepository extends JpaRepository<JpaShipper, Integer> {
}

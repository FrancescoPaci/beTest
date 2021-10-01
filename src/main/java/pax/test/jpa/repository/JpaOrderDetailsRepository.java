package pax.test.jpa.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pax.test.jpa.model.JpaOrdersDetails;

@Repository
public interface JpaOrderDetailsRepository extends JpaRepository<JpaOrdersDetails, Integer> {

}

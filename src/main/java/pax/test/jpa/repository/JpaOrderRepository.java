package pax.test.jpa.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pax.test.jpa.model.JpaOrder;

@Repository
public interface JpaOrderRepository extends JpaRepository<JpaOrder, Integer> {

}

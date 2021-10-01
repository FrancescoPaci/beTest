package pax.test.jpa.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pax.test.jpa.model.JpaOrder;
import pax.test.jpa.model.JpaShipper;
import pax.test.jpa.repository.JpaOrderDetailsRepository;
import pax.test.jpa.repository.JpaOrderRepository;
import pax.test.jpa.repository.JpaShipperRepository;
import pax.test.springJdbc.model.OrderFilters;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import java.util.List;

@Service
public class JpaOrderService {

    @Autowired
    JpaOrderRepository jpaOrderRepository;
    @Autowired
    JpaShipperRepository jpaShipperRepository;
    @Autowired
    JpaOrderDetailsRepository jpaOrderDetailsRepository;
    @PersistenceContext
    EntityManager entityManager;

    public Long findCountOrders(OrderFilters filter){
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Long> cq = cb.createQuery(Long.class);
        Root<JpaOrder> root = cq.from(JpaOrder.class);
        cq.select(cb.count(root));
        createOrderFilter(filter, cb, cq, root);
        return entityManager.createQuery(cq).getSingleResult();
    }

    public List<JpaOrder> findOrdersByRange(OrderFilters filter) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<JpaOrder> cq = cb.createQuery(JpaOrder.class);
        Root<JpaOrder> root = cq.from(JpaOrder.class);
        createOrderFilter(filter, cb, cq, root);
        TypedQuery<JpaOrder> query = entityManager.createQuery(cq);
        int pageSize = filter.getSize();
        query.setFirstResult((filter.getPage() - 1) * pageSize);
        query.setMaxResults(pageSize);
        return query.getResultList();
    }

    public List<JpaShipper> getShippers(){
        return jpaShipperRepository.findAll();
    }

    private void createOrderFilter(OrderFilters filter, CriteriaBuilder cb, CriteriaQuery cq, Root root){
        if(filter != null) {
            if (filter.getOrderDate() != null) {
                cq.where(cb.equal(root.get("orderDate"), filter.getOrderDate()));
            }
            if (filter.getShipCity() != null && filter.getShipCity().length() > 0) {
                cq.where(cb.like(root.get("shipCity"), "%"+filter.getShipCity()+"%"));
            }
            if (filter.getShipCountry() != null && filter.getShipCountry().length() > 0) {
                cq.where(cb.like(root.get("shipCountry"), "%"+filter.getShipCountry()+"%"));
            }
            if (filter.getShipAddress() != null && filter.getShipAddress().length() > 0) {
                cq.where(cb.like(root.get("shipAddress"), "%"+filter.getShipAddress()+"%"));
            }
            if (filter.getShipPostalCode() != null && filter.getShipPostalCode().length() > 0) {
                cq.where(cb.like(root.get("shipPostalCode"), "%"+filter.getShipPostalCode()+"%"));
            }
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public void updateOrderAndProducts(JpaOrder order){
        jpaOrderDetailsRepository.saveAll(order.getOrderDetails());
    }

}

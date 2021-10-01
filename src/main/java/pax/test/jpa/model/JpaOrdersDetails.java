package pax.test.jpa.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "orders_details")
public class JpaOrdersDetails implements Serializable {

    @Id
    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonIgnore
    private JpaOrder order;

    @Id
    @ManyToOne
    @JoinColumn(name = "product_id")
    private JpaProduct product;

    @Column(name="quantity")
    private Integer quantity;

    @Column(name="discount")
    private BigDecimal discount;

}
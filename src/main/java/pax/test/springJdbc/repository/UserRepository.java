package pax.test.springJdbc.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public String findUser(String username, String psw) {
        return jdbcTemplate.queryForObject("SELECT role FROM users where username = '"+username+"' " +
                "AND Password = '"+psw+"'", String.class);
    }

    public void insertUser(String username, String psw) {
        jdbcTemplate.update("INSERT INTO users (username, password, role)\n" +
                "VALUES ('"+username+"','"+psw+"','USER')");
    }
}

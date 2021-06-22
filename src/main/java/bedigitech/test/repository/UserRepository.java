package bedigitech.test.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public String findUser(String user, String psw) {
        return jdbcTemplate.queryForObject("SELECT ROLE FROM Users where [User] = '"+user+"' " +
                "AND [Password] = '"+psw+"'", String.class);
    }

    public void insertUser(String user, String psw) {
        jdbcTemplate.update("INSERT INTO Users ([User],[Password],[Role])\n" +
                "VALUES ('"+user+"','"+psw+"','USER')");
    }
}

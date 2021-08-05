package pax.test.mybatis.custom;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface OrdersCustomMapper {

    @Select("SELECT ${column} FROM Orders WHERE id = #{id}")
    List<String> selectColumnById(@Param("column") String column, @Param("id") int id);

    List<String> selectDistinctByColumnFromXml(@Param("column") String column);
}

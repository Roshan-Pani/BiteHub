package com.bitehub.mapper;

import com.bitehub.config.MapStructConfig;
import com.bitehub.domain.entity.User;
import com.bitehub.dto.UserResponse;
import org.mapstruct.Mapper;

@Mapper(config = MapStructConfig.class)
public interface UserMapper {
    UserResponse toDto(User user);
}

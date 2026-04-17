package com.bitehub.service;

import com.bitehub.domain.entity.User;
import com.bitehub.dto.UserResolveRequest;
import com.bitehub.dto.UserResponse;
import com.bitehub.mapper.UserMapper;
import com.bitehub.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserService(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    public List<UserResponse> getUserList() {
        return userRepository.findAll().stream().map(userMapper::toDto).toList();
    }

    @Transactional
    public UserResponse resolveUserIdentity(UserResolveRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.email())
                .orElseGet(User::new);

        user.setEmail(request.email().trim().toLowerCase());
        user.setName(request.name() == null || request.name().isBlank()
                ? request.email().split("@")[0]
                : request.name().trim());
        user.setPhone(request.phone());
        user.setAddress(request.address());
        user.setProfileImage(request.profileImage());
        user.setAuthenticated(Boolean.TRUE.equals(request.authenticated()));
        user.setSource("runtime");

        return userMapper.toDto(userRepository.save(user));
    }
}

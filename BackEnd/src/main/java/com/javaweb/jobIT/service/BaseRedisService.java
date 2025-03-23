package com.javaweb.jobIT.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class BaseRedisService {
    private final RedisTemplate<String, Object> redisTemplate;

    public void set(String key, String value, long timeoutInDays) {
        redisTemplate.opsForValue().set(key, value, timeoutInDays, TimeUnit.DAYS);
    }

    public void setForMinutes(String key, String value, long timeoutInMinutes) {
        redisTemplate.opsForValue().set(key, value, timeoutInMinutes, TimeUnit.MINUTES);
    }

    public Object get(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    public void delete(String key) {
        redisTemplate.delete(key);
    }
}

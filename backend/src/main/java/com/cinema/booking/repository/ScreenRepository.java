package com.cinema.booking.repository;

import com.cinema.booking.entity.Screen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScreenRepository extends JpaRepository<Screen, Long> {
    List<Screen> findByTheatreTheatreId(Long theatreId);
    boolean existsByTheatreTheatreIdAndScreenName(Long theatreId, String screenName);
}

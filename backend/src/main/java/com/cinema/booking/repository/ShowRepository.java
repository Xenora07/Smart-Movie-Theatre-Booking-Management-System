package com.cinema.booking.repository;

import com.cinema.booking.entity.Show;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ShowRepository extends JpaRepository<Show, Long> {
    List<Show> findByMovieMovieIdOrderByShowDateAscShowTimeAsc(Long movieId);
    List<Show> findByScreenScreenId(Long screenId);
    List<Show> findByShowDateGreaterThanEqualOrderByShowDateAscShowTimeAsc(LocalDate date);
    boolean existsByScreenScreenIdAndShowDateAndShowTime(Long screenId, LocalDate showDate, LocalTime showTime);
}

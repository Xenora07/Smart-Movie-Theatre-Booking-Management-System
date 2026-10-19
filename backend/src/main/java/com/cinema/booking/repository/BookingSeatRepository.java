package com.cinema.booking.repository;

import com.cinema.booking.entity.BookingSeat;
import com.cinema.booking.entity.BookingSeatId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingSeatRepository extends JpaRepository<BookingSeat, BookingSeatId> {
    List<BookingSeat> findByShowShowId(Long showId);
    List<BookingSeat> findByBookingBookingId(Long bookingId);
    boolean existsByShowShowIdAndSeatSeatId(Long showId, Long seatId);

    @Modifying
    @Query("DELETE FROM BookingSeat bs WHERE bs.booking.bookingId = :bookingId")
    void deleteByBookingId(@Param("bookingId") Long bookingId);
}

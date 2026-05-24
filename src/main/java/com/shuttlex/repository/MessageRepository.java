package com.shuttlex.repository;

import com.shuttlex.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("""
            SELECT m FROM Message m
            JOIN FETCH m.sender s
            JOIN FETCH m.receiver r
            WHERE m.travelRequest.id = :travelRequestId
            ORDER BY m.createdAt ASC
            """)
    List<Message> findByTravelRequestIdOrderByCreatedAtAsc(@Param("travelRequestId") Long travelRequestId);
}

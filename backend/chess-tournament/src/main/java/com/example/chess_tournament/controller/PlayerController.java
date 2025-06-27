package com.example.chess_tournament.controller;

import com.example.chess_tournament.model.Player;
import com.example.chess_tournament.model.Tournament;
import com.example.chess_tournament.repository.PlayerRepository;
import com.example.chess_tournament.repository.TournamentRepository;

import com.example.chess_tournament.dto.PlayerRequest;
import com.example.chess_tournament.dto.PlayerListRequest;
import com.example.chess_tournament.dto.AttendanceRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/players")
public class PlayerController {

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private TournamentRepository tournamentRepository;

    // Create or edit one player
    @PostMapping
    public String addOrUpdatePlayer(@RequestBody PlayerRequest request) {
        Tournament tournament = tournamentRepository.findById(request.tournamentId).orElse(null);
        if (tournament == null)
            return "tournament doesn't exist";

        Player player;

        if (request.id != null) {
            // edit an existing player
            player = playerRepository.findById(request.id).orElse(null);
            if (player == null)
                return "player doesn't exist";
        } else {
            // create new player
            player = new Player();
            player.setConfirmAttendance(0);
            player.setTournament(tournament);
        }

        player.setName(request.name);
        player.setCountry(request.country);
        player.setBirthYear(request.birthYear);
        player.setRating(request.rating);
        player.setGender(request.gender);
        player.setFideId(request.fideId);
        player.setConfirmAttendance(0);
        player.setTournament(tournament);

        playerRepository.save(player);
        return "player" + player.getName() + (request.id != null ? "added" : "edited") + "successfully";
    }

    // Create players by list
    @PostMapping("/bulk")
    public String addPlayersBulk(@RequestBody PlayerListRequest request) {
        Tournament tournament = tournamentRepository.findById(request.tournamentId).orElse(null);
        if (tournament == null)
            return "tournamnet doesn't exist";

        for (String name : request.names) {
            Player player = new Player();
            player.setName(name);
            player.setCountry("ISR");
            player.setBirthYear(2005);
            player.setRating(1200);
            player.setGender("m");
            player.setFideId(0);
            player.setConfirmAttendance(0);
            player.setTournament(tournament);
            playerRepository.save(player);
        }

        return "" + request.names.size() + " players were added successfully";
    }

    // Confirm players' attendance
    @PutMapping("/attendance")
    public String confirmAttendance(@RequestBody AttendanceRequest request) {
        for (Long playerId : request.playerIds) {
            Player player = playerRepository.findById(playerId).orElse(null);
            if (player != null) {
                player.setConfirmAttendance(1);
                playerRepository.save(player);
            }
        }
        return "attendance for" + request.playerIds.size() + " players was updated";
    }

}

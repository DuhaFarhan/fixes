package com.example.chess_tournament.controller;

import com.example.chess_tournament.dto.TournamentDTO;
import com.example.chess_tournament.model.Arbiter;
import com.example.chess_tournament.model.Tournament;
import com.example.chess_tournament.repository.ArbiterRepository;
import com.example.chess_tournament.repository.TournamentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tournaments")
public class TournamentController {

    @Autowired
    private TournamentRepository tournamentRepository;

    @Autowired
    private ArbiterRepository arbiterRepository;

    @PostMapping
    public Long createTournament(@RequestBody TournamentDTO request) {
        // save arbiter
        Arbiter arbiter = new Arbiter();
        arbiter.setName(request.arbiterName);
        arbiter.setFideId(request.arbiterFideId);
        Arbiter savedArbiter = arbiterRepository.save(arbiter);

        // save tournament
        Tournament tournament = Tournament.builder()
                .name(request.name)
                .city(request.city)
                .country(request.country)
                .startDate(request.startDate)
                .endDate(request.endDate)
                .rounds(request.rounds)
                .numPlayers(request.numPlayers)
                .type(request.type)
                .ByeValue(request.byeValue)
                .tieBreakers(request.tieBreakers.toArray(new String[0]))
                .arbiter(savedArbiter)
                .build();

        Tournament savedTournament = tournamentRepository.save(tournament);
        return savedTournament.getId();
    }
}

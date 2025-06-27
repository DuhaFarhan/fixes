// TournamentRequest.java
package com.example.chess_tournament.dto;

import java.util.List;

public class TournamentDTO {
    public String name;
    public String city;
    public String country;
    public String startDate;
    public String endDate;
    public int rounds;
    public int numPlayers;
    public String type;
    public float byeValue;
    public List<String> tieBreakers;
    public String arbiterName;
    public long arbiterFideId;
}

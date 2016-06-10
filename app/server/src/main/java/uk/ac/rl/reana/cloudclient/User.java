/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package uk.ac.rl.reana.cloudclient;

import java.math.BigDecimal;
import javax.json.Json;
import javax.json.JsonObjectBuilder;

/**
 *
 * @author elz24996
 */
public class User extends Entity {

    private String sessionId;
    
    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public JsonObjectBuilder toJsonObjectBuilder(){
        JsonObjectBuilder out = Json.createObjectBuilder();
        out.add("sessionId", getSessionId());
        return out;
    }
    

}

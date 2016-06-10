/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package uk.ac.rl.reana.cloudclient;

import javax.ws.rs.core.Response;

import javax.json.Json;

/**
 *
 * @author elz24996
 */
public class CloudClientException extends Exception {
    
    private String message;
    protected int status;
    
    public CloudClientException(String message){
        this.status = 400;
        this.message = message;
    }
    
    public String getMessage(){
        return this.message;
    }
    
    public Response toRestResponse(){
        String json = Json.createObjectBuilder().add("message", (String) getMessage()).build().toString();
        return Response.status(status).entity(json).build();
    }
    
}

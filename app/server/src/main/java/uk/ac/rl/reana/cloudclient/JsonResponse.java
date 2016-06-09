/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package uk.ac.rl.reana.cloudclient;

import javax.json.Json;
import javax.json.JsonObjectBuilder;
import javax.json.JsonObject;

import javax.ws.rs.core.Response;


/**
 *
 * @author elz24996
 */
public class JsonResponse {
    
    private JsonObjectBuilder builder;
   
    public JsonResponse(){
        this.builder = Json.createObjectBuilder();
    }
    
    public JsonObjectBuilder getBuilder(){
        return builder;
    }
   
    public JsonObject getJsonObject(){
        return builder.build();
    }
    
    public String toString(){
        return getJsonObject().toString();
    }
    
    public Response toRestResponse(){
        return Response.ok().entity(toString()).build();
    }
}
    


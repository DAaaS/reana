/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package uk.ac.rl.reana.rest;

import javax.ejb.Stateless;
import javax.ejb.LocalBean;

import javax.ejb.EJB;
import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.FormParam;
import javax.ws.rs.core.GenericEntity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import uk.ac.rl.reana.cloudclient.CloudClient;
import uk.ac.rl.reana.cloudclient.CloudClientException;

/**
 *
 * @author elz24996
 */
@Stateless
@LocalBean
@Path("")
public class Api {
    
    private static final Logger logger = LoggerFactory.getLogger(Api.class);
    
    @GET
    @Path("/login")
    @Produces({MediaType.APPLICATION_JSON})
    public Response login(
            @QueryParam("username") String username,
            @QueryParam("password") String password) {
        
        try {
            return new CloudClient().login(username, password).toResponse();
        } catch(CloudClientException e) {
            return e.toResponse();
        }
        
    }
    
    @GET
    @Path("/machines")
    @Produces({MediaType.APPLICATION_JSON})
    public Response login(
            @QueryParam("sessionId") String sessionId) {
        
        try {
            return new CloudClient(sessionId).getMachines().toResponse();
        } catch(CloudClientException e) {
            return e.toResponse();
        }
        
    }
    
}

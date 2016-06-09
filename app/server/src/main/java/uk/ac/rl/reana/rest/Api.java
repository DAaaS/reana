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

import org.apache.xmlrpc.client.XmlRpcClient;
import org.apache.xmlrpc.client.XmlRpcClientConfigImpl;
import org.apache.xmlrpc.XmlRpcException;

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
    @Path("/authenticate")
    @Produces({MediaType.APPLICATION_JSON})
    public Response authenticate(
            @QueryParam("username") String username,
            @QueryParam("password") String password) {
        
        XmlRpcClientConfigImpl config = new XmlRpcClientConfigImpl();
        config.setServerURL(new URL("https://hn1.nubes.rl.ac.uk/RPC2"));
        
        //client.methodCall('one.user.login', [username + ":" + password, username, "", -1], function(error, result) {
        
        XmlRpcClient client = new XmlRpcClient();
        client.setConfig(config);
        Object[] params = new Object[]{username + ":" + password, username, "", -1};
        try {
            Object result = client.execute("one.user.login", params);
        } catch(XmlRpcException e) {
            
        }
    
        return Response.ok().entity(result).build();
    }

    
}

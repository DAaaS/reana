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

import javax.json.Json;
import javax.json.JsonObjectBuilder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URL;
import java.net.MalformedURLException;
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
    @Path("/login")
    @Produces({MediaType.APPLICATION_JSON})
    public Response login(
            @QueryParam("username") String username,
            @QueryParam("password") String password)
            throws java.net.MalformedURLException, XmlRpcException {
        
        JsonObjectBuilder out = Json.createObjectBuilder();
        
        XmlRpcClientConfigImpl config = new XmlRpcClientConfigImpl();
        config.setServerURL(new URL("https://hn1.nubes.rl.ac.uk/RPC2"));
        config.setEnabledForExceptions(true);
        
        XmlRpcClient client = new XmlRpcClient();
        client.setConfig(config);
        Object[] params = new Object[]{username + ":" + password, username, "", -1};
        Object[] result = (Object[]) client.execute("one.user.login", params);
        
        boolean isSuccess = (boolean) result[0];
        Response response;
        
        if(isSuccess){
            out.add("sessionId", (String) result[1]);
            return Response.ok().entity(out.build().toString()).build();
        } else {
            out.add("message", (String) result[1]);
            out.add("code", (Integer) result[2]);
            return Response.status(400).entity(out.build().toString()).build();
        }
        
        
    }

}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package uk.ac.rl.reana.cloudclient;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URL;
import java.net.MalformedURLException;
import org.apache.xmlrpc.client.XmlRpcClient;
import org.apache.xmlrpc.client.XmlRpcClientConfigImpl;

/**
 *
 * @author elz24996
 */

public class CloudClient {
    
    private String sessionId;
    private XmlRpcClient client;
    
    public CloudClient() throws CloudClientException {
        try {
            XmlRpcClientConfigImpl config = new XmlRpcClientConfigImpl();
            config.setServerURL(new URL("https://hn1.nubes.rl.ac.uk/RPC2"));
            this.client = new XmlRpcClient();
            client.setConfig(config);
        } catch(MalformedURLException e){
            throw new UnexpectedException(e.getMessage());
        }
    }
    
    public CloudClient(String sessionId) throws CloudClientException {
        this();
        this.sessionId = sessionId;
    }

    
    public JsonResponse login(String username, String password)
            throws CloudClientException {
        
        Object[] params = new Object[]{username + ":" + password, username, "", -1};
        try {
            Object[] result = (Object[]) client.execute("one.user.login", params);

            boolean isSuccess = (boolean) result[0];

            if(isSuccess){
                JsonResponse out = new JsonResponse();
                out.getBuilder().add("sessionId", (String) result[1]);
                return out;
            }
        } catch(Exception e){
            throw new UnexpectedException(e.getMessage());
        }
        
        throw new BadRequestException("Either your username or password is incorrect");
    }
    
    /*
    public JsonResponse getMachines() 
            throws CloudClientException {
        
           
    }
    */
}

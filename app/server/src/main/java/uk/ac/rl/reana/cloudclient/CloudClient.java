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

import javax.json.Json;
import javax.json.JsonObjectBuilder;
import javax.json.JsonArrayBuilder;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathFactory;
import javax.xml.xpath.XPathConstants;

import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.w3c.dom.Node;
import org.w3c.dom.Element;

import java.io.ByteArrayInputStream;
import java.math.BigDecimal;

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
                this.sessionId = username + ":" + (String) result[1];
                out.getBuilder().add("sessionId", sessionId);
                return out;
            }
        } catch(Exception e){
            throw new UnexpectedException(e.getMessage());
        }
        
        throw new BadRequestException("Either your username or password is incorrect");
    }
    
    private static String[] machineStates = {
        "LCM_INIT",
        "PROLOG",
        "BOOT",
        "RUNNING",
        "MIGRATE",
        "SAVE_STOP",
        "SAVE_SUSPEND",
        "SAVE_MIGRATE",
        "PROLOG_MIGRATE",
        "PROLOG_RESUME",
        "EPILOG_STOP",
        "EPILOG",
        "SHUTDOWN",
        "CANCEL",
        "FAILURE",
        "CLEANUP_RESUBMIT",
        "UNKNOWN",
        "HOTPLUG",
        "SHUTDOWN_POWEROFF",
        "BOOT_UNKNOWN",
        "BOOT_POWEROFF",
        "BOOT_SUSPENDED",
        "BOOT_STOPPED",
        "CLEANUP_DELETE",
        "HOTPLUG_SNAPSHOT",
        "HOTPLUG_NIC",
        "HOTPLUG_SAVEAS",
        "HOTPLUG_SAVEAS_POWEROFF",
        "HOTPLUG_SAVEAS_SUSPENDED",
        "SHUTDOWN_UNDEPLOY",
        "EPILOG_UNDEPLOY",
        "PROLOG_UNDEPLOY",
        "BOOT_UNDEPLOY"
    };
    
    public JsonResponse getMachines()
            throws CloudClientException {
        
        Object[] params = new Object[]{
            //auth token
            sessionId,
            //show only user's VMs & groups ??
            -1,
            //offset for pagination	
            0,
            //number of entries to return
            -1,
            //VM state to filter by.
            -1
        };
        
        try {
            Object[] result = (Object[]) client.execute("one.vmpool.info", params);

            boolean isSuccess = (boolean) result[0];

            if(isSuccess){
                JsonResponse out = new JsonResponse();
                
                DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
                DocumentBuilder builder = factory.newDocumentBuilder();
                String xml = (String) result[1];
                
                ByteArrayInputStream input =  new ByteArrayInputStream(xml.getBytes("UTF-8"));
                Document doc = builder.parse(input);
                
                XPath xPath =  XPathFactory.newInstance().newXPath();
                
                NodeList machines = (NodeList) xPath.compile("VM_POOL/VM").evaluate(doc, XPathConstants.NODESET);
                
                JsonArrayBuilder machinesArray = Json.createArrayBuilder();
                for(int i = 0; i < machines.getLength(); i++){
                    Node machine = machines.item(i);
                    JsonObjectBuilder machineObject = Json.createObjectBuilder();
                    machineObject.add("id", Integer.parseInt(xPath.compile("ID").evaluate(machine)));
                    machineObject.add("name", xPath.compile("NAME").evaluate(machine));
                    machineObject.add("groupName", xPath.compile("GNAME").evaluate(machine));
                    machineObject.add("state", machineStates[Integer.parseInt(xPath.compile("STATE").evaluate(machine))]);
                    machineObject.add("host", xPath.compile("HISTORY_RECORDS/HISTORY/HOSTNAME").evaluate(machine));
                    machinesArray.add(machineObject);
                }
                
                out.getBuilder().add("machines", machinesArray.build());
                
                return out;
            } else {
                throw new BadRequestException((String) result[1]);
            }
        } catch(Exception e){
            throw new UnexpectedException(e.getMessage());
        }
            
    }
}

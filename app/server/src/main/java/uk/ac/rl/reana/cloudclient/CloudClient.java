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
import java.net.InetAddress;

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

    public Session login(String username, String password)
            throws CloudClientException {
        
        Object[] params = new Object[]{username + ":" + password, username, "", -1};
        try {
            Object[] result = (Object[]) client.execute("one.user.login", params);

            boolean isSuccess = (boolean) result[0];

            if(isSuccess){
                Session out = new Session(this);
                out.setSessionId(username + ":" + (String) result[1]);
                return out;
            }
        } catch(Exception e){
            throw new UnexpectedException(e.getMessage());
        }
        
        throw new BadRequestException("Either your username or password is incorrect");
    }
    
    public User getUser()
            throws CloudClientException {
        
        return getUser(-1);
    }
    
    public User getUser(Integer id)
            throws CloudClientException {
        
        Object[] params = new Object[]{
            //auth token
            sessionId,
            //object id
            id
        };
        
        try {
            Object[] result = (Object[]) client.execute("one.user.info", params);

            boolean isSuccess = (boolean) result[0];

            if(isSuccess){
                User out = new User(this);
                Document document = createDocument((String) result[1]);
                XPath xPath =  XPathFactory.newInstance().newXPath();
                out.setUsername((String) xPath.compile("USER/NAME").evaluate(document));
                return out;
            } else {
                throw new BadRequestException((String) result[1]);
            }
        } catch(Exception e){
            throw new UnexpectedException(e.getMessage());
        }
        
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

    public EntityList<Machine> getMachines()
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
                EntityList<Machine> out = new EntityList<Machine>();
                
                Document document = createDocument((String) result[1]);
                XPath xPath =  XPathFactory.newInstance().newXPath();
                NodeList machines = (NodeList) xPath.compile("VM_POOL/VM").evaluate(document, XPathConstants.NODESET);
                
                for(int i = 0; i < machines.getLength(); i++){
                    Machine machine = new Machine(this);
                    Node machineNode = machines.item(i);
                    JsonObjectBuilder machineObject = Json.createObjectBuilder();
                    machine.setId(Integer.parseInt(xPath.compile("ID").evaluate(machineNode)));
                    machine.setName(xPath.compile("NAME").evaluate(machineNode));
                    machine.setGroupName(xPath.compile("GNAME").evaluate(machineNode));
                    machine.setState(machineStates[Integer.parseInt(xPath.compile("STATE").evaluate(machineNode))]);
                    String ip = xPath.compile("TEMPLATE/CONTEXT/ETH0_IP").evaluate(machineNode);
                    machine.setHost(InetAddress.getByName(ip).getHostName());
                    out.add(machine);
                }
                return out;
            } else {
                throw new BadRequestException((String) result[1]);
            }
        } catch(Exception e){
            throw new UnexpectedException(e.getMessage());
        }
        
    }
    
    private Document createDocument(String xml) throws Exception {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();
        ByteArrayInputStream input = new ByteArrayInputStream(xml.getBytes("UTF-8"));
        return builder.parse(input);
    }
}

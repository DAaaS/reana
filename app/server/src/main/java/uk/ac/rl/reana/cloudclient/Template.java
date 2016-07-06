/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package uk.ac.rl.reana.cloudclient;

import javax.json.Json;
import javax.json.JsonObjectBuilder;

/**
 *
 * @author elz24996
 */
public class Template extends Entity {
    
    
    private String name;
    private String description;
    private int cpuCount;
    private int memoryAllocation;
    
    public Template(CloudClient cloudClient){
        super(cloudClient);
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getCpuCount() {
        return cpuCount;
    }

    public void setCpuCount(int cpuCount) {
        this.cpuCount = cpuCount;
    }

    public int getMemoryAllocation() {
        return memoryAllocation;
    }

    public void setMemoryAllocation(int memoryAllocation) {
        this.memoryAllocation = memoryAllocation;
    }
    
    public JsonObjectBuilder toJsonObjectBuilder(){
        JsonObjectBuilder out = Json.createObjectBuilder();
        out.add("name", getName());
        out.add("description", getDescription());
        out.add("cpuCount", getCpuCount());
        out.add("memoryAllocation", getMemoryAllocation());
        return out;
    }
}

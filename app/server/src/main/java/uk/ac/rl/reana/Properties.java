/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package uk.ac.rl.reana;

import java.io.FileInputStream;
import java.io.IOException;
import javax.ejb.Singleton;
import javax.ejb.Startup;


/**
 *
 * @author elz24996
 */
@Startup
@Singleton
public class Properties extends java.util.Properties {
    
    public Properties(){
        super();
        try {
            load(new FileInputStream("reana.properties"));
        } catch(IOException e){
            
        }
    }
    
}

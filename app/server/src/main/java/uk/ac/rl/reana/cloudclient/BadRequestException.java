/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package uk.ac.rl.reana.cloudclient;

/**
 *
 * @author elz24996
 */
public class BadRequestException extends CloudClientException {
    
    public BadRequestException(String message){
        super(message);
    }
    
}

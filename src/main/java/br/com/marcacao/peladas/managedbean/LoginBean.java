package br.com.marcacao.peladas.managedbean;

import java.io.Serializable;
import java.util.Map;

import javax.faces.event.AbortProcessingException;
import javax.faces.event.ComponentSystemEvent;
import javax.faces.view.ViewScoped;
import javax.inject.Named;

import br.com.marcacao.peladas.util.FacesMessageSeverity;
import br.com.marcacao.peladas.util.FacesUtils;

@Named
@ViewScoped
public class LoginBean extends AbstractBean implements Serializable{

	private static final long serialVersionUID = 1L;
	
	public void preRender(ComponentSystemEvent cse) throws AbortProcessingException {
        Map<String, Object> atributos = cse.getComponent().getAttributes();
        String error = (String)atributos.get("error");
        if (error != null && !"".equals(error)) {
        	FacesUtils.addGlobalMessage(FacesMessageSeverity.ERROR, error);
        }
    }	
	 
}

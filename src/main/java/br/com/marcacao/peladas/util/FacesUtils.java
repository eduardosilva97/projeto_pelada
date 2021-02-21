package br.com.marcacao.peladas.util;

import javax.faces.application.FacesMessage;
import javax.faces.application.NavigationHandler;
import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;
import javax.faces.context.Flash;

public final class FacesUtils {

	private FacesUtils() {
	}

	public static FacesContext getFacesContext() {
		return FacesContext.getCurrentInstance();
	}

	public static String getActualId() {

		return getFacesContext().getViewRoot().getViewId();

	}
	public static void addGlobalMessage(FacesMessageSeverity severity, String title, String detail) {
		getFacesContext().addMessage(null, new FacesMessage(severity.getSeverity(), title, detail));
	}

	public static void addGlobalMessage(FacesMessageSeverity severity, String message) {
		addGlobalMessage(severity, message, null);
	}

	public static void redirect(String path) {
		if (path.contains("?")) {
			path += "&faces-redirect=true";
		} else {
			path += "?faces-redirect=true";
		}

		FacesContext fc = getFacesContext();
		ExternalContext ec = fc.getExternalContext();
		Flash flashContext = ec.getFlash();
		if (!flashContext.isKeepMessages()) {
			flashContext.setKeepMessages(true);
		}

		NavigationHandler nh = fc.getApplication().getNavigationHandler();
		nh.handleNavigation(fc, null, path);
	}

}

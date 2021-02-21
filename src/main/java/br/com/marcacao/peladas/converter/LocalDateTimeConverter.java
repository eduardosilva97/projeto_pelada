package br.com.marcacao.peladas.converter;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.convert.Converter;
import javax.faces.convert.ConverterException;
import javax.faces.convert.FacesConverter;

@FacesConverter("localDateTimeConverter")
public class LocalDateTimeConverter implements Converter {

	@Override
	public Object getAsObject(FacesContext context, UIComponent component, String stringValue) {
	
		if (null == stringValue || stringValue.isEmpty()) {
			return null;
		}
	
		LocalDateTime localDateTime = null;
		
		try {
		
			stringValue += ":00";
			
			localDateTime = LocalDateTime.parse(
			stringValue.trim(),
			DateTimeFormatter.ofPattern("dd/MM/yyyy").withZone(ZoneId.systemDefault()));
		
		} catch (DateTimeParseException e) {
		

		throw new ConverterException("O formato da data e hora deve ser dd/MM/aaaa HH:mm:ss.");

		}
	
		return localDateTime;
	
	}
	
	@Override
	public String getAsString(FacesContext context, UIComponent component, Object localDateTimeValue) {
	
		if (null == localDateTimeValue) {
	
			return "";
		}
	
		return ((LocalDateTime) localDateTimeValue)
			.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")
			.withZone(ZoneId.systemDefault()));
	}
	
	
}

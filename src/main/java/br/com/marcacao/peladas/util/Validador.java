package br.com.marcacao.peladas.util;

import java.util.Arrays;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.passay.LengthRule;
import org.passay.PasswordData;
import org.passay.PasswordValidator;
import org.passay.RuleResult;
import org.passay.WhitespaceRule;

public class Validador {

	public static boolean validarSenha(String password) {
		PasswordValidator validator = new PasswordValidator (Arrays.asList(

                new LengthRule(6, 12),
                // no whitespace
                new WhitespaceRule()
        ));
		RuleResult result = validator.validate(new PasswordData(password));
		if (result.isValid()) {
		 return true;
	    } else {
	     return false;
	    }
	}
	
	public static boolean validarEmail(String email) {
		Pattern p = Pattern.compile("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,6}$", Pattern.CASE_INSENSITIVE);
		Matcher m = p.matcher(email);
		return m.matches();
	}
	
}
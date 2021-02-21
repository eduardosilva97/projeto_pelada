package br.com.marcacao.peladas.managedbean;

import java.util.ArrayList;
import java.util.Collection;

import javax.inject.Named;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.SpringSecurityMessageSource;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import br.com.marcacao.peladas.entity.Usuario;
import br.com.marcacao.peladas.exception.BusinessException;
import br.com.marcacao.peladas.service.UsuarioService;
import br.com.marcacao.peladas.util.UsuarioSistema;

@Named
public class AutenticacaoBean implements UserDetailsService {

	@Autowired
	public UsuarioService usuarioService;
	
	private MessageSourceAccessor messages = SpringSecurityMessageSource.getAccessor();

	public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException{
		try {
			MessageSourceAccessor messages = SpringSecurityMessageSource.getAccessor();
	
			if (!login.equals("")) {
	
				Usuario usuario = usuarioService.findByEmail(login);
	
				if (usuario == null) {				
					throw new UsernameNotFoundException("Usuário não encontrado!");
				}
				return new UsuarioSistema(usuario.getUsername(), usuario.getPassword(), authorities());
	
			} else {
				throw new BusinessException(messages.getMessage("", "Campo Usuário Obrigatório"));
			}
		} catch (EmptyResultDataAccessException e) {
			
			throw new BusinessException(messages.getMessage("", "Usuário ou senha inválidos"));
		} catch (Exception e) {
			throw new BusinessException(messages.getMessage("", "Houve um erro ao tentar acessar o sistema"));
		}
	}

	public Collection<? extends GrantedAuthority> authorities() {
		return new ArrayList<>();
	}
}
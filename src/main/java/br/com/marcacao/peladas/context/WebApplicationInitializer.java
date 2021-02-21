package br.com.marcacao.peladas.context;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

import br.com.marcacao.peladas.context.adapter.WebApplicationSecurityConfigurerAdapter;
import br.com.marcacao.peladas.managedbean.AutenticacaoBean;


@Configuration
@ComponentScan(basePackages = { "br.com.marcacao.peladas" })
@Order(1)
public class WebApplicationInitializer extends AbstractAnnotationConfigDispatcherServletInitializer {

	protected Class<?>[] getRootConfigClasses() {

		return new Class<?>[] { WebApplicationInitializer.class, WebApplicationSecurityConfigurerAdapter.class, AutenticacaoBean.class};
	}

	@Override
	protected Class<?>[] getServletConfigClasses() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	protected String[] getServletMappings() {
		return new String[] { "/rest/*" };
	}


}
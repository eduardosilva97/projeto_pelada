# Projeto Pelada

O projeto pelada tem como objetivo simplificar a organização de peladas.

Para seu desenvolvimento foram utilizadas as seguintes ferramentas:

- Eclipse IDE 2020-03
- Jboss Tools 4.15.0.final
- WildFly 15.0
- Postgresql 9.5

Os principais frameworks utilizados foram:

- Primefaces 7.0
- JSF 2.2.18
- Hibernate
- Spring Security 4.2.10.RELEASE
- Lombok 1.18.16

Instruções:

- Para alterar configurações de url e usuário do banco de dados basta alterar o arquivo datasource.properties que se encontra em \src\main\resources\datasource.properties;

- O SQL de criação do banco de dados pode ser encontrado em \src\main\resources\db.sql;

- Para instalação do lombok, após baixar o projeto e realizar o build, é necessário ir até a pasta ~\.m2\repository\org\projectlombok\lombok\1.18.16 e executar o comando java -jar lombok.jar;

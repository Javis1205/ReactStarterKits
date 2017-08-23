# Install VPS ubuntu for TKframework

[..Back to Docs](../docs/README.md)

## Login VPS using pem
Before login you have to chmod your file
```
chmod 400 <path_to_pem_file>/file.pem
```
Login into VPS using pem files

```sh
ssh -i <path_to_pem_file>/file.pem `user`@`VPS_ip`
```

## Install mysql
```sh
sudo apt-get update
sudo apt-get install mysql-server
```
You'll be prompted to create a root password during the installation. Choose a secure one and make sure you remember it

User: `root`

Password: `123456`

### Check service status:
```sh
systemctl status mysql.service
```
### Configuring MySQL
```sh
sudo mysql_secure_installation
```
### Enable Remote access
 Uncommented in `/etc/mysql/my.cnf` (mysql 5.6 and below) or  `/etc/mysql/mysql.conf.d/mysqld.cnf` (mysql 5.7 and above) and assigned to your computers IP address and not loopback

Replace xxx with your IP Address
```sh
bind-address        = xxx.xxx.xxx.xxx
```
Or add a `bind-address      = 0.0.0.0` if you don't want to specify the IP
Restart mysql service
```sh
sudo service mysql restart
```
For a remote user to connect with the correct priveleges you need to have that user created in both the localhost and '%' as in.

```sh
mysql -uroot -p
`mysql> CREATE USER 'root'@'%' IDENTIFIED BY '123456';`
```


('123456' as password)

then,
```sh
`mysql> GRANT ALL ON *.* TO 'root'@'localhost';`
`mysql> GRANT ALL ON *.* TO 'root'@'%';`
```
and finally,

```sh
`mysql> FLUSH PRIVILEGES;`
`mysql> EXIT;`
```

### Import sample database
Database can get from `<TKframework dir>/scripts/tkframework.sql`

On VPS 
```sh
mysql -u username -p tkframework < tkframework.sql
```

## Install Node.js and Expressjs (optional)
```sh
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install -y nodejs
```
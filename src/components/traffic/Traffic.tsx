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

interface TrafficCategory {
    category: string;
    commands: CommandItem[];
}

const trafficData: TrafficCategory[] = [
  {
    "category": "Tcpdump",
    "commands": [
      {
        "title": "Capture on specific interface",
        "command": "tcpdump -i eth0"
      },
      {
        "title": "Capture specific host",
        "command": "tcpdump host 192.168.1.5"
      },
      {
        "title": "Capture specific port",
        "command": "tcpdump port 80"
      },
      {
        "title": "Capture by protocol (ICMP)",
        "command": "tcpdump icmp"
      },
      {
        "title": "Write capture to file (pcap)",
        "command": "tcpdump -w capture.pcap"
      },
      {
        "title": "Read from pcap file",
        "command": "tcpdump -r capture.pcap"
      },
      {
        "title": "Display ASCII content",
        "command": "tcpdump -A"
      },
      {
        "title": "Capture HTTP GET requests",
        "command": "tcpdump -s 0 -A 'tcp[((tcp[12:1] & 0xf0) >> 2):4] = 0x47455420'"
      }
    ]
  },
  {
    "category": "Wireshark Filters",
    "commands": [
      {
        "title": "Filter by IP address",
        "command": "ip.addr == 192.168.1.5"
      },
      {
        "title": "Filter by Source IP",
        "command": "ip.src == 192.168.1.5"
      },
      {
        "title": "Filter by Destination Port",
        "command": "tcp.dstport == 80"
      },
      {
        "title": "Filter HTTP GET methods",
        "command": "http.request.method == \"GET\""
      },
      {
        "title": "Filter HTTP POST methods",
        "command": "http.request.method == \"POST\""
      },
      {
        "title": "Show only TCP SYN packets",
        "command": "tcp.flags.syn == 1 && tcp.flags.ack == 0"
      },
      {
        "title": "Filter by text in payload",
        "command": "frame contains \"password\""
      },
      {
        "title": "Exclude specific IP",
        "command": "ip.addr != 192.168.1.1"
      }
    ]
  },
  {
    "category": "Nmap",
    "commands": [
      {
        "title": "Stealth Scan (SYN)",
        "command": "nmap -sS <target>"
      },
      {
        "title": "Service Version Detection",
        "command": "nmap -sV <target>"
      },
      {
        "title": "OS Detection",
        "command": "nmap -O <target>"
      },
      {
        "title": "Aggressive Scan (OS, Version, Script, Traceroute)",
        "command": "nmap -A <target>"
      },
      {
        "title": "Scan all ports",
        "command": "nmap -p- <target>"
      },
      {
        "title": "Default Script Scan",
        "command": "nmap -sC <target>"
      },
      {
        "title": "Scan specific vulnerability scripts",
        "command": "nmap --script=vuln <target>"
      }
    ]
  },
  {
    "category": "Scapy (Python)",
    "commands": [
      {
        "title": "Send ICMP Ping",
        "command": "send(IP(dst=\"192.168.1.5\")/ICMP())"
      },
      {
        "title": "Send TCP SYN",
        "command": "send(IP(dst=\"192.168.1.5\")/TCP(dport=80, flags=\"S\"))"
      },
      {
        "title": "Send DNS Query",
        "command": "sr1(IP(dst=\"8.8.8.8\")/UDP()/DNS(rd=1, qd=DNSQR(qname=\"example.com\")))"
      },
      {
        "title": "Sniff Packets",
        "command": "sniff(filter=\"tcp port 80\", count=10)"
      },
      {
        "title": "Read Pcap",
        "command": "packets = rdpcap(\"capture.pcap\")"
      }
    ]
  },
  {
    "category": "Bettercap",
    "commands": [
      {
        "title": "Start Network Probe",
        "command": "net.probe on"
      },
      {
        "title": "Show Network Hosts",
        "command": "net.show"
      },
      {
        "title": "Enable ARP Spoofing (Full Duplex)",
        "command": "set arp.spoof.fullduplex true; arp.spoof on"
      },
      {
        "title": "Set ARP Spoof Targets",
        "command": "set arp.spoof.targets 192.168.1.5"
      },
      {
        "title": "Enable DNS Spoofing",
        "command": "set dns.spoof.domains example.com; dns.spoof on"
      },
      {
        "title": "Start Sniffer",
        "command": "net.sniff on"
      }
    ]
  },
  {
    "category": "Netcat / Socat",
    "commands": [
      {
        "title": "Netcat Listener",
        "command": "nc -lvnp 4444"
      },
      {
        "title": "Netcat Connect",
        "command": "nc 192.168.1.5 4444"
      },
      {
        "title": "Netcat File Transfer (Receiver)",
        "command": "nc -lvnp 4444 > output.txt"
      },
      {
        "title": "Netcat File Transfer (Sender)",
        "command": "nc 192.168.1.5 4444 < input.txt"
      },
      {
        "title": "Socat Listener (Fork)",
        "command": "socat TCP-LISTEN:4444,fork STDOUT"
      },
      {
        "title": "Socat Connect",
        "command": "socat - TCP:192.168.1.5:4444"
      }
    ]
  }
];

export default function Traffic() {
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
                <IconFont type='icon-transfer' style={{ marginRight: 8 }} />
                Traffic Analysis
            </Title>
            <Paragraph type="secondary">
                Network traffic interception, analysis, and manipulation tools.
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
                    {trafficData.map((section, index) => (
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

import React from 'react';
import { Typography, Divider, Button, Space, Card, Avatar } from 'antd';
import { GithubOutlined, LinkedinOutlined, MailOutlined, DollarCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph, Link, Text } = Typography;

export default function AboutUs() {
    return (
        <div>
            <Title level={2} style={{ fontWeight: 'bold', margin: 15 }}>
                About us
            </Title>
            <Paragraph style={{ margin: 15 }}>
                Maintained and developed by Sareer Ahmed
            </Paragraph>
            <Divider dashed />
            <div style={{ padding: 15, marginTop: 15 }}>
                <Paragraph>
                    Secfinity is a web extension facilitating your web application penetration tests. It includes cheat
                    sheets as well as all the tools used during a test such as XSS payloads, Reverse shells, and much
                    more. With the extension, you no longer need to search for payloads in different websites or in your
                    local storage space; most of the tools are accessible in one click. Secfinity is accessible either
                    in pop-up mode or in a whole tab in the DevTools part of the browser with F12.
                </Paragraph>
                
                <Card style={{ marginTop: 20, marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
                        <Avatar size={64} src="https://avatars.githubusercontent.com/u/126616792?v=4" icon={<GithubOutlined />} />
                        <div>
                            <Title level={4} style={{ marginTop: 0 }}>Sareer Ahmed</Title>
                            <Paragraph type="secondary">Offensive Security Expert | OSCP+ | Computer Science Student</Paragraph>
                            <Paragraph>
                                I am a Computer Science student with a strong focus on offensive security, vulnerability research, and secure systems development.
                                I have hands-on experience in web application security, Active Directory environments, and real-world red teaming.
                            </Paragraph>
                            <Space wrap>
                                <Button type="primary" icon={<GithubOutlined />} href="https://github.com/sarerism" target="_blank">
                                    GitHub
                                </Button>
                                <Button type="primary" icon={<LinkedinOutlined />} href="https://www.linkedin.com/in/sareer-ahmed/" target="_blank" style={{ backgroundColor: '#0077b5' }}>
                                    LinkedIn
                                </Button>
                                <Button icon={<MailOutlined />} href="mailto:sareer.ahmed@outlook.de">
                                    Contact
                                </Button>
                            </Space>
                        </div>
                    </div>
                </Card>

                <Paragraph>
                    Note that this project is maintained, developed, and made available for free. You can offer me a
                    coffee; it will be very encouraging and greatly appreciated.
                </Paragraph>

                <div style={{ marginTop: 20 }}>
                    <Paragraph strong>Support the project:</Paragraph>
                    <a href='https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=sareercahn@gmail.com&currency_code=USD' target='_blank' rel='noreferrer noopener'>
                        <img
                            src='https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif'
                            alt='PayPal - The safer, easier way to pay online!'
                            style={{ height: 'auto', width: 'auto' }}
                        />
                    </a>
                    <Paragraph type="secondary" style={{ fontSize: '12px', marginTop: 5 }}>PayPal: sareercahn@gmail.com</Paragraph>
                </div>
            </div>
            <Divider dashed />
            <div style={{ padding: 15, marginTop: 15 }}>
                <Title level={3}>Contribute</Title>
                <Paragraph>
                    We are always looking for community input into our software. Feel free to contribute to the Secfinity repository:
                </Paragraph>
                <Paragraph>- Contribute to the project: <Link href='https://github.com/sarerism/Secfinity' target='_blank'>https://github.com/sarerism/Secfinity</Link></Paragraph>

                <Paragraph strong>Before submitting a bug report</Paragraph>
                <Paragraph>Check the open issues to see if the problem is already reported.</Paragraph>
                <Paragraph>If you encounter a problem that was reported and closed, check why it was closed. If you think it should be reopened, open a new issue instead.</Paragraph>
                <Paragraph>- Report a bug: <Link href='https://github.com/sarerism/Secfinity/issues' target='_blank'>https://github.com/sarerism/Secfinity/issues</Link></Paragraph>
            </div>
            <Divider dashed />
            <div key="c" style={{ padding: 15, marginTop: 15 }}>
                <Title level={3}> Credits </Title>
                <Paragraph> Original creators: Sareer A. </Paragraph>
                <Paragraph> PentestMonkey </Paragraph>
                <Paragraph> GTFOBins </Paragraph> <Paragraph> Antd </Paragraph> <Paragraph> Iconfont CN </Paragraph>
                <Paragraph> John Hammond </Paragraph> <Paragraph> The Noun Project </Paragraph>
                <Paragraph> PayloadsAllTheThings </Paragraph>
                <Paragraph> Fabien LOISON(flozz) for the p0wny @shell </Paragraph>
                <Paragraph> GoProSlowYo for the zsh reverse shell </Paragraph>
                <Paragraph> MITRE ATT&CK </Paragraph>
                <Paragraph> Thanks to dejisec for the Active Directory scripts ! <Link href='https://gist.github.com/dejisec/3477eff3258f1f43fc3c57de56295f34' target='_blank'>Link</Link> </Paragraph>
            </div>
        </div>
    );
}

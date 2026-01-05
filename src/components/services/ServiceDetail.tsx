import React, { useState, useEffect } from 'react';
import { Typography, Button, Input, Form, Divider, Card, Tag, Space, message, Collapse, Row, Col } from 'antd';
import { ArrowLeftOutlined, CopyOutlined, CheckOutlined, DesktopOutlined } from '@ant-design/icons';
import { Service, replaceCommandVariables } from '../../utils/services';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

interface ServiceDetailProps {
    service: Service;
    onBack: () => void;
}

export default function ServiceDetail({ service, onBack }: ServiceDetailProps) {
    const [variables, setVariables] = useState<{ [key: string]: string }>({
        IP: '',
        PORT: service.defaultPorts[0]?.toString() || '',
        USER: '',
        DOMAIN: '',
    });

    const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
    const [messageApi, contextHolder] = message.useMessage();

    // Update port when service changes
    useEffect(() => {
        setVariables(prev => ({
            ...prev,
            PORT: service.defaultPorts[0]?.toString() || '',
        }));
    }, [service]);

    // Handle variable input change
    const handleVariableChange = (key: string, value: string) => {
        setVariables(prev => ({ ...prev, [key]: value }));
    };

    // Copy command to clipboard
    const copyToClipboard = async (command: string, commandId: string) => {
        const processedCommand = replaceCommandVariables(command, variables);
        
        try {
            await navigator.clipboard.writeText(processedCommand);
            setCopiedCommand(commandId);
            messageApi.success('Command copied to clipboard!');
            
            // Reset copied state after 2 seconds
            setTimeout(() => {
                setCopiedCommand(null);
            }, 2000);
        } catch (error) {
            messageApi.error('Failed to copy command');
        }
    };

    // Get all commands count
    const totalCommands = service.categories.reduce(
        (total, category) => total + category.commands.length,
        0
    );

    return (
        <div>
            {contextHolder}
            
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
                <Button 
                    icon={<ArrowLeftOutlined />} 
                    onClick={onBack}
                    style={{ marginBottom: 16 }}
                >
                    Back to Services
                </Button>
                
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                    <Title level={2} style={{ margin: 0, marginRight: 16 }}>
                        <DesktopOutlined style={{ marginRight: 8 }} />
                        {service.name}
                    </Title>
                    <Tag color="blue" style={{ fontSize: 14, padding: '4px 12px' }}>
                        {totalCommands} commands
                    </Tag>
                </div>

                <Paragraph type="secondary" style={{ fontSize: 14, marginBottom: 12 }}>
                    {service.description}
                </Paragraph>

                <div>
                    <Text strong>Default Ports: </Text>
                    {service.defaultPorts.map(port => (
                        <Tag key={port} color="blue">{port}</Tag>
                    ))}
                </div>
            </div>

            <Divider />

            {/* Target Configuration */}
            <Card 
                title={<span><DesktopOutlined /> Target Configuration</span>}
                style={{ marginBottom: 24 }}
                headStyle={{ background: 'rgba(24, 144, 255, 0.1)' }}
            >
                <Form layout="vertical">
                    <Row gutter={16}>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item 
                                label={<Text strong>Target IP / Hostname</Text>}
                                required
                            >
                                <Input
                                    size="large"
                                    placeholder="192.168.1.100"
                                    value={variables.IP}
                                    onChange={(e) => handleVariableChange('IP', e.target.value)}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={8}>
                            <Form.Item label={<Text strong>Port</Text>}>
                                <Input
                                    size="large"
                                    placeholder={service.defaultPorts[0]?.toString()}
                                    value={variables.PORT}
                                    onChange={(e) => handleVariableChange('PORT', e.target.value)}
                                />
                            </Form.Item>
                        </Col>

                        {service.requiresAuth && (
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item label={<Text strong>Username</Text>}>
                                    <Input
                                        size="large"
                                        placeholder="admin"
                                        value={variables.USER}
                                        onChange={(e) => handleVariableChange('USER', e.target.value)}
                                    />
                                </Form.Item>
                            </Col>
                        )}

                        {service.requiresDomain && (
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item label={<Text strong>Domain</Text>}>
                                    <Input
                                        size="large"
                                        placeholder="example"
                                        value={variables.DOMAIN}
                                        onChange={(e) => handleVariableChange('DOMAIN', e.target.value)}
                                    />
                                </Form.Item>
                            </Col>
                        )}
                    </Row>
                </Form>
            </Card>

            {/* Command Categories */}
            <Collapse 
                defaultActiveKey={service.categories.map((_, idx) => idx.toString())}
                style={{ background: 'transparent' }}
            >
                {service.categories.map((category, categoryIdx) => (
                    <Panel
                        key={categoryIdx.toString()}
                        header={
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text strong style={{ fontSize: 16 }}>
                                    {category.name}
                                </Text>
                                <Tag color="green">{category.commands.length} commands</Tag>
                            </div>
                        }
                        style={{ marginBottom: 8 }}
                    >
                        <Space direction="vertical" style={{ width: '100%' }} size="middle">
                            {category.commands.map((cmd) => {
                                const processedCommand = replaceCommandVariables(cmd.command, variables);
                                const isCopied = copiedCommand === cmd.id;

                                return (
                                    <Card
                                        key={cmd.id}
                                        size="small"
                                        className="command-card"
                                        style={{ 
                                            background: 'rgba(0, 0, 0, 0.02)',
                                            border: '1px solid rgba(0, 0, 0, 0.06)'
                                        }}
                                    >
                                        {/* Command Header */}
                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'flex-start',
                                            marginBottom: 8
                                        }}>
                                            <div style={{ flex: 1 }}>
                                                <Text strong>{cmd.description}</Text>
                                                <div style={{ marginTop: 4 }}>
                                                    <Tag color="purple" style={{ fontSize: 11 }}>
                                                        {cmd.tool}
                                                    </Tag>
                                                </div>
                                            </div>
                                            
                                            <Button
                                                type={isCopied ? "primary" : "default"}
                                                icon={isCopied ? <CheckOutlined /> : <CopyOutlined />}
                                                onClick={() => copyToClipboard(cmd.command, cmd.id)}
                                                style={{ flexShrink: 0 }}
                                            >
                                                {isCopied ? 'Copied!' : 'Copy'}
                                            </Button>
                                        </div>

                                        {/* Command Display */}
                                        <div 
                                            className="command-text"
                                            style={{ 
                                                background: 'rgba(0, 0, 0, 0.7)',
                                                color: '#0f0',
                                                padding: '12px',
                                                borderRadius: 4,
                                                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro, monospace',
                                                fontSize: 13,
                                                lineHeight: 1.6,
                                                overflow: 'auto',
                                                whiteSpace: 'pre-wrap',
                                                wordBreak: 'break-all',
                                                userSelect: 'all'
                                            }}
                                        >
                                            {processedCommand}
                                        </div>
                                    </Card>
                                );
                            })}
                        </Space>
                    </Panel>
                ))}
            </Collapse>

            {/* Additional Info */}
            <Card 
                style={{ marginTop: 24, background: 'rgba(255, 193, 7, 0.05)' }}
                bordered={false}
            >
                <Paragraph type="secondary" style={{ marginBottom: 0, fontSize: 12 }}>
                    <strong>Pro Tips:</strong><br />
                    • Fill in the target configuration fields above and commands will update automatically<br />
                    • Commands use standard pentesting tools - ensure they're installed on your system<br />
                    • Always verify you have written authorization before testing<br />
                    • Document all findings and maintain professional ethics
                </Paragraph>
            </Card>
        </div>
    );
}

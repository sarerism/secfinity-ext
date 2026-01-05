import React, { useState } from 'react';
import { Typography, Input, Row, Col, Card, Tag, Badge } from 'antd';
import { SearchOutlined, DesktopOutlined, createFromIconfontCN } from '@ant-design/icons';
import { SERVICES, Service } from '../../utils/services';
import ServiceDetail from './ServiceDetail';

const IconFont = createFromIconfontCN({
  scriptUrl: ['./iconfont.js'],
});

const { Title, Paragraph, Text } = Typography;

export default function ServicesOverview() {
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Filter services based on search term
    const filteredServices = SERVICES.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.defaultPorts.some(port => port.toString().includes(searchTerm))
    );

    // Get icon based on service type
    const getServiceIcon = (serviceId: string) => {
        // ES6-compatible array checking
        const databases = ['mysql', 'mssql', 'postgresql', 'redis', 'elasticsearch'];
        const fileServices = ['http', 'https', 'smb', 'ftp', 'nfs'];
        const authServices = ['ssh', 'rdp', 'winrm', 'ldap', 'kerberos'];
        
        if (databases.indexOf(serviceId) !== -1) {
            return <IconFont type="icon-sql" style={{ fontSize: 24, color: '#52c41a' }} />;
        }
        if (fileServices.indexOf(serviceId) !== -1) {
            return <IconFont type="icon-transfer" style={{ fontSize: 24, color: '#1890ff' }} />;
        }
        if (authServices.indexOf(serviceId) !== -1) {
            return <IconFont type="icon-shield" style={{ fontSize: 24, color: '#faad14' }} />;
        }
        return <IconFont type="icon-gnubash" style={{ fontSize: 24, color: '#722ed1' }} />;
    };

    // Count total commands for a service
    const getTotalCommands = (service: Service): number => {
        return service.categories.reduce((total, category) => total + category.commands.length, 0);
    };

    // If a service is selected, show detail view
    if (selectedService) {
        return (
            <ServiceDetail 
                service={selectedService} 
                onBack={() => setSelectedService(null)} 
            />
        );
    }

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
                <Title level={2} style={{ marginBottom: 8 }}>
                    <DesktopOutlined style={{ marginRight: 8 }} />
                    Service Enumeration & Exploitation
                </Title>
                <Paragraph type="secondary">
                    Professional pentesting command library for common network services
                </Paragraph>
                <Paragraph type="warning" style={{ 
                    background: 'rgba(255, 193, 7, 0.1)', 
                    padding: '8px 12px', 
                    borderRadius: 4,
                    border: '1px solid rgba(255, 193, 7, 0.3)',
                    marginTop: 16
                }}>
                    ⚠️ <strong>Disclaimer:</strong> Commands are provided for authorized penetration testing only. 
                    Unauthorized access to computer systems is illegal.
                </Paragraph>
            </div>

            {/* Search */}
            <Input
                size="large"
                placeholder="Search services by name, port, or description..."
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: 24 }}
            />

            {/* Services Grid */}
            <Row gutter={[16, 16]}>
                {filteredServices.map(service => (
                    <Col xs={24} sm={12} md={8} lg={6} key={service.id}>
                        <Card
                            hoverable
                            onClick={() => setSelectedService(service)}
                            style={{ height: '100%' }}
                            bodyStyle={{ padding: 16 }}
                        >
                            <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                {getServiceIcon(service.id)}
                                <Badge 
                                    count={getTotalCommands(service)} 
                                    style={{ backgroundColor: '#52c41a' }}
                                    title="Total commands available"
                                />
                            </div>
                            
                            <Title level={4} style={{ marginBottom: 8, marginTop: 0 }}>
                                {service.name}
                            </Title>
                            
                            <div style={{ marginBottom: 12 }}>
                                {service.defaultPorts.map(port => (
                                    <Tag key={port} color="blue" style={{ marginBottom: 4 }}>
                                        :{port}
                                    </Tag>
                                ))}
                            </div>
                            
                            <Paragraph 
                                ellipsis={{ rows: 2 }} 
                                type="secondary" 
                                style={{ fontSize: 12, marginBottom: 8 }}
                            >
                                {service.description}
                            </Paragraph>

                            <div style={{ fontSize: 11, color: '#8c8c8c' }}>
                                {service.categories.map((cat, idx) => (
                                    <span key={cat.name}>
                                        {cat.name}
                                        {idx < service.categories.length - 1 ? ' • ' : ''}
                                    </span>
                                ))}
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            {filteredServices.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <SearchOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
                    <Paragraph type="secondary">
                        No services found matching "{searchTerm}"
                    </Paragraph>
                </div>
            )}
        </div>
    );
}
